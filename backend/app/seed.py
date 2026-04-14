"""Seed the database with demo data."""
import asyncio
from datetime import datetime, timezone

from app.core.database import AsyncSessionLocal
from app.models.product import Product, ProductCategory
from app.models.tournament import Tournament, TournamentStatus


PRODUCTS = [
    Product(name="Pokémon Écarlate & Violet — Booster", description="Booster de 10 cartes de la série Écarlate & Violet.", price=4.99, category=ProductCategory.TCG, stock=200, image_url=None),
    Product(name="Pokémon — Display 36 boosters SV", description="Display complet de 36 boosters.", price=159.99, category=ProductCategory.TCG, stock=20, image_url=None),
    Product(name="Magic: The Gathering — Draft Booster", description="Booster draft pour jouer en tournoi.", price=3.99, category=ProductCategory.TCG, stock=150, image_url=None),
    Product(name="Magic — Commander Deck 2024", description="Deck Commander prêt à jouer.", price=44.99, category=ProductCategory.TCG, stock=30, image_url=None),
    Product(name="Yu-Gi-Oh! — Structure Deck Dragon's Roar", description="Structure Deck 40 cartes.", price=9.99, category=ProductCategory.TCG, stock=50, image_url=None),
    Product(name="One Piece Card Game — Starter Deck", description="Deck de démarrage One Piece.", price=12.99, category=ProductCategory.TCG, stock=60, image_url=None),
    Product(name="Catan — Edition Standard", description="Le jeu de société stratégique classique.", price=39.99, category=ProductCategory.BOARD_GAME, stock=15, image_url=None),
    Product(name="Wingspan — Extension Europe", description="Extension pour le jeu Wingspan.", price=29.99, category=ProductCategory.BOARD_GAME, stock=10, image_url=None),
    Product(name="Dixit — Odyssey", description="Jeu de cartes narratif pour toute la famille.", price=34.99, category=ProductCategory.BOARD_GAME, stock=12, image_url=None),
    Product(name="Ultra Pro — Classeur 9 cases", description="Classeur de rangement cartes TCG, 360 cartes.", price=14.99, category=ProductCategory.ACCESSORY, stock=100, image_url=None),
    Product(name="Dragon Shield — Sleeves Matte (100)", description="Pochettes protège-cartes matte, lot de 100.", price=9.99, category=ProductCategory.ACCESSORY, stock=200, image_url=None),
    Product(name="Ultimate Guard — Boulder Deck Case 100+", description="Boîte rigide pour 100 cartes sleevées.", price=19.99, category=ProductCategory.ACCESSORY, stock=40, image_url=None),
]

TOURNAMENTS = [
    Tournament(
        name="Tournoi Pokémon VGC — Série Printemps",
        game="Pokémon VGC",
        date=datetime(2026, 5, 10, 14, 0, tzinfo=timezone.utc),
        max_players=32,
        registered_players=12,
        entry_fee=10.0,
        status=TournamentStatus.UPCOMING,
    ),
    Tournament(
        name="FNM Magic: The Gathering — Draft Modern",
        game="Magic: The Gathering",
        date=datetime(2026, 4, 25, 19, 0, tzinfo=timezone.utc),
        max_players=16,
        registered_players=8,
        entry_fee=15.0,
        status=TournamentStatus.UPCOMING,
    ),
    Tournament(
        name="Yu-Gi-Oh! — Regional Qualifier",
        game="Yu-Gi-Oh!",
        date=datetime(2026, 6, 1, 10, 0, tzinfo=timezone.utc),
        max_players=64,
        registered_players=0,
        entry_fee=20.0,
        status=TournamentStatus.UPCOMING,
    ),
]


async def seed():
    async with AsyncSessionLocal() as session:
        for product in PRODUCTS:
            session.add(product)
        for tournament in TOURNAMENTS:
            session.add(tournament)
        await session.commit()
    print(f"Seeded {len(PRODUCTS)} products and {len(TOURNAMENTS)} tournaments.")


if __name__ == "__main__":
    asyncio.run(seed())
