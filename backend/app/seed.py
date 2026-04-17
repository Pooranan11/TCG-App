"""Seed the database with demo data."""
import asyncio
from datetime import datetime, timezone

from sqlalchemy import select

from app.core.auth import hash_password
from app.core.database import AsyncSessionLocal
from app.models.product import Product, ProductCategory
from app.models.tournament import Tournament, TournamentStatus
from app.models.user import User, UserRole


PRODUCTS = [
    Product(name="Pokemon Ecarlate & Violet — Booster", description="Booster de 10 cartes de la serie Ecarlate & Violet.", price=4.99, category=ProductCategory.TCG, stock=200),
    Product(name="Pokemon — Display 36 boosters SV", description="Display complet de 36 boosters.", price=159.99, category=ProductCategory.TCG, stock=20),
    Product(name="Magic: The Gathering — Draft Booster", description="Booster draft pour jouer en tournoi.", price=3.99, category=ProductCategory.TCG, stock=150),
    Product(name="Magic — Commander Deck 2024", description="Deck Commander pret a jouer.", price=44.99, category=ProductCategory.TCG, stock=30),
    Product(name="Yu-Gi-Oh! — Structure Deck Dragon's Roar", description="Structure Deck 40 cartes.", price=9.99, category=ProductCategory.TCG, stock=50),
    Product(name="One Piece Card Game — Starter Deck", description="Deck de demarrage One Piece.", price=12.99, category=ProductCategory.TCG, stock=60),
    Product(name="Catan — Edition Standard", description="Le jeu de societe strategique classique.", price=39.99, category=ProductCategory.BOARD_GAME, stock=15),
    Product(name="Wingspan — Extension Europe", description="Extension pour le jeu Wingspan.", price=29.99, category=ProductCategory.BOARD_GAME, stock=10),
    Product(name="Dixit — Odyssey", description="Jeu de cartes narratif pour toute la famille.", price=34.99, category=ProductCategory.BOARD_GAME, stock=12),
    Product(name="Ultra Pro — Classeur 9 cases", description="Classeur de rangement cartes TCG, 360 cartes.", price=14.99, category=ProductCategory.ACCESSORY, stock=100),
    Product(name="Dragon Shield — Sleeves Matte (100)", description="Pochettes protege-cartes matte, lot de 100.", price=9.99, category=ProductCategory.ACCESSORY, stock=200),
    Product(name="Ultimate Guard — Boulder Deck Case 100+", description="Boite rigide pour 100 cartes sleevees.", price=19.99, category=ProductCategory.ACCESSORY, stock=40),
]

TOURNAMENTS = [
    Tournament(name="Tournoi Pokemon VGC — Serie Printemps", game="Pokemon VGC", date=datetime(2026, 5, 10, 14, 0, tzinfo=timezone.utc), max_players=32, registered_players=12, entry_fee=10.0, status=TournamentStatus.UPCOMING),
    Tournament(name="FNM Magic: The Gathering — Draft Modern", game="Magic: The Gathering", date=datetime(2026, 4, 25, 19, 0, tzinfo=timezone.utc), max_players=16, registered_players=8, entry_fee=15.0, status=TournamentStatus.UPCOMING),
    Tournament(name="Yu-Gi-Oh! — Regional Qualifier", game="Yu-Gi-Oh!", date=datetime(2026, 6, 1, 10, 0, tzinfo=timezone.utc), max_players=64, registered_players=0, entry_fee=20.0, status=TournamentStatus.UPCOMING),
]

USERS = [
    User(email="admin@chasseurdejeux.fr", username="admin", hashed_password=hash_password("Admin1234!"), role=UserRole.ADMIN),
]


async def seed():
    async with AsyncSessionLocal() as session:
        # Products — skip if name already exists
        existing_products = (await session.execute(select(Product.name))).scalars().all()
        new_products = [p for p in PRODUCTS if p.name not in existing_products]
        for p in new_products:
            session.add(p)

        # Tournaments — skip if name already exists
        existing_tournaments = (await session.execute(select(Tournament.name))).scalars().all()
        new_tournaments = [t for t in TOURNAMENTS if t.name not in existing_tournaments]
        for t in new_tournaments:
            session.add(t)

        # Users — skip if email already exists
        existing_emails = (await session.execute(select(User.email))).scalars().all()
        new_users = [u for u in USERS if u.email not in existing_emails]
        for u in new_users:
            session.add(u)

        await session.commit()

    print(f"Seeded {len(new_products)} products, {len(new_tournaments)} tournaments, {len(new_users)} users.")
    if new_users:
        print("Admin: admin@chasseurdejeux.fr / Admin1234!")


if __name__ == "__main__":
    asyncio.run(seed())
