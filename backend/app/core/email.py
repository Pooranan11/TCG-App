import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import aiosmtplib

from app.core.config import settings

logger = logging.getLogger("uvicorn.error")


async def send_email(to: str, subject: str, html: str) -> None:
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning("SMTP not configured — email to %s not sent. Subject: %s", to, subject)
        return

    message = MIMEMultipart("alternative")
    message["From"] = settings.SMTP_FROM
    message["To"] = to
    message["Subject"] = subject
    message.attach(MIMEText(html, "html", "utf-8"))

    await aiosmtplib.send(
        message,
        hostname=settings.SMTP_HOST,
        port=settings.SMTP_PORT,
        username=settings.SMTP_USER,
        password=settings.SMTP_PASSWORD,
        start_tls=settings.SMTP_TLS,
        validate_certs=settings.SMTP_TLS,
    )


async def send_verification_email(to: str, token: str) -> None:
    link = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    html = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
      <h2 style="color:#1a2744;margin-bottom:8px">Vérifiez votre adresse email</h2>
      <p style="color:#444;margin-bottom:24px">
        Merci de vous être inscrit sur <strong>Chasseur de Jeux</strong>.<br>
        Cliquez sur le bouton ci-dessous pour activer votre compte.
      </p>
      <a href="{link}"
         style="display:inline-block;background:#f5c518;color:#1a2744;font-weight:700;
                padding:12px 28px;border-radius:4px;text-decoration:none;letter-spacing:0.05em">
        Vérifier mon email
      </a>
      <p style="color:#888;font-size:12px;margin-top:24px">
        Ce lien expire dans 24 heures.<br>
        Si vous n'avez pas créé de compte, ignorez cet email.
      </p>
    </div>
    """
    await send_email(to, "Activez votre compte Chasseur de Jeux", html)


async def send_reset_password_email(to: str, token: str) -> None:
    link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    html = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
      <h2 style="color:#1a2744;margin-bottom:8px">Réinitialisation du mot de passe</h2>
      <p style="color:#444;margin-bottom:24px">
        Vous avez demandé à réinitialiser votre mot de passe sur <strong>Chasseur de Jeux</strong>.<br>
        Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
      </p>
      <a href="{link}"
         style="display:inline-block;background:#f5c518;color:#1a2744;font-weight:700;
                padding:12px 28px;border-radius:4px;text-decoration:none;letter-spacing:0.05em">
        Réinitialiser mon mot de passe
      </a>
      <p style="color:#888;font-size:12px;margin-top:24px">
        Ce lien expire dans 1 heure.<br>
        Si vous n'avez pas fait cette demande, ignorez cet email.
      </p>
    </div>
    """
    await send_email(to, "Réinitialisation de votre mot de passe Chasseur de Jeux", html)
