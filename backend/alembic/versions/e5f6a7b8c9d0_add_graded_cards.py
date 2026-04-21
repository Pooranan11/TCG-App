"""add graded cards

Revision ID: e5f6a7b8c9d0
Revises: d4e5f6a7b8c9
Create Date: 2026-04-21 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "e5f6a7b8c9d0"
down_revision: Union[str, None] = "d4e5f6a7b8c9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "graded_cards",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("card_name", sa.String(255), nullable=False),
        sa.Column("card_number", sa.String(20), nullable=False),
        sa.Column("set_name", sa.String(255), nullable=False),
        sa.Column("pokemon_tcg_id", sa.String(100), nullable=True),
        sa.Column("image_url", sa.String(512), nullable=True),
        sa.Column(
            "grading_company",
            sa.Enum("PSA", "BGS", "CGC", name="gradingcompany"),
            nullable=False,
        ),
        sa.Column("grade", sa.String(10), nullable=False),
        sa.Column("cert_number", sa.String(100), nullable=True),
        sa.Column("price", sa.Numeric(10, 2), nullable=False),
        sa.Column("stock", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
    )

    op.add_column(
        "order_items",
        sa.Column(
            "graded_card_id",
            sa.Integer(),
            sa.ForeignKey("graded_cards.id", ondelete="SET NULL"),
            nullable=True,
            index=True,
        ),
    )


def downgrade() -> None:
    op.drop_column("order_items", "graded_card_id")
    op.drop_table("graded_cards")
    op.execute("DROP TYPE IF EXISTS gradingcompany")
