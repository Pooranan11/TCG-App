import logging
import secrets

from fastapi import APIRouter, Depends, HTTPException, Query, status

logger = logging.getLogger(__name__)
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from app.core.database import get_db
from app.core.email import send_reset_password_email, send_verification_email
from app.core.redis import redis_client
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserRead,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

VERIFY_TOKEN_TTL = 60 * 60 * 24      # 24 heures
RESET_TOKEN_TTL = 60 * 60             # 1 heure


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Compte désactivé")
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Veuillez vérifier votre adresse email avant de vous connecter",
        )

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(access_token=token)


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(
        select(User).where((User.email == payload.email) | (User.username == payload.username))
    )
    existing_user = existing.scalar_one_or_none()
    if existing_user:
        if existing_user.email == payload.email:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email déjà utilisé")
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Nom d'utilisateur déjà pris")

    user = User(
        email=payload.email,
        username=payload.username,
        hashed_password=hash_password(payload.password),
        is_verified=False,
    )
    db.add(user)
    try:
        await db.commit()
        await db.refresh(user)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email ou nom d'utilisateur déjà utilisé",
        )

    token = secrets.token_urlsafe(32)
    await redis_client.setex(f"verify:{token}", VERIFY_TOKEN_TTL, str(user.id))

    try:
        await send_verification_email(user.email, token)
    except Exception as e:
        # Email failed — rollback user creation so the address stays free
        await redis_client.delete(f"verify:{token}")
        await db.delete(user)
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Impossible d'envoyer l'email de vérification. Veuillez réessayer.",
        ) from e

    return {"message": "Compte créé. Vérifiez votre email pour activer votre compte."}


@router.get("/verify-email")
async def verify_email(token: str = Query(...), db: AsyncSession = Depends(get_db)):
    user_id = await redis_client.get(f"verify:{token}")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lien de vérification invalide ou expiré",
        )

    user = await db.get(User, int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable")

    if not user.is_verified:
        user.is_verified = True
        await db.commit()

    return {"message": "Email vérifié avec succès. Vous pouvez maintenant vous connecter."}


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    # Toujours retourner 200 pour ne pas révéler si l'email existe
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()

    if user and user.is_active:
        token = secrets.token_urlsafe(32)
        await redis_client.setex(f"reset:{token}", RESET_TOKEN_TTL, str(user.id))
        try:
            await send_reset_password_email(user.email, token)
        except Exception as exc:
            await redis_client.delete(f"reset:{token}")
            logger.error("Failed to send reset password email to %s: %s", user.email, exc)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Impossible d'envoyer l'email. Veuillez réessayer plus tard.",
            )

    return {"message": "Si cet email existe, un lien de réinitialisation a été envoyé."}


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    user_id = await redis_client.get(f"reset:{payload.token}")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lien de réinitialisation invalide ou expiré",
        )

    user = await db.get(User, int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable")

    user.hashed_password = hash_password(payload.new_password)
    await db.commit()
    await redis_client.delete(f"reset:{payload.token}")

    return {"message": "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter."}


@router.get("/me", response_model=UserRead)
async def me(current_user: User = Depends(get_current_user)):
    return current_user
