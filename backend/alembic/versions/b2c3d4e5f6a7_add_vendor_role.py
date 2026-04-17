"""add VENDOR to userrole enum

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-04-15 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op

revision: str = "b2c3d4e5f6a7"
down_revision: Union[str, None] = "a1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # PostgreSQL allows adding values to an existing enum with ALTER TYPE
    op.execute("ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'VENDOR'")


def downgrade() -> None:
    # Removing a value from a PostgreSQL enum requires recreating it —
    # we reassign any VENDOR users to USER first, then recreate the type.
    op.execute("UPDATE users SET role = 'USER' WHERE role = 'VENDOR'")
    op.execute("ALTER TYPE userrole RENAME TO userrole_old")
    op.execute("CREATE TYPE userrole AS ENUM ('USER', 'ADMIN')")
    op.execute(
        "ALTER TABLE users ALTER COLUMN role TYPE userrole "
        "USING role::text::userrole"
    )
    op.execute("DROP TYPE userrole_old")
