from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.tournament import TournamentStatus


class TournamentBase(BaseModel):
    name: str
    game: str
    date: datetime
    max_players: int
    entry_fee: float = 0.0
    status: TournamentStatus = TournamentStatus.UPCOMING


class TournamentCreate(TournamentBase):
    pass


class TournamentUpdate(TournamentBase):
    pass


class TournamentRead(TournamentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    registered_players: int
    created_at: datetime
