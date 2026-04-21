from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    POSTGRES_DB: str = "tcg"
    POSTGRES_USER: str = "tcg"
    POSTGRES_PASSWORD: str = "tcg"
    POSTGRES_HOST: str = "localhost"

    REDIS_URL: str = "redis://localhost:6379"

    SECRET_KEY: str = "changeme"
    CORS_ORIGINS: str = "http://localhost"
    APP_ENV: str = "development"
    FRONTEND_URL: str = "http://localhost"

    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = "noreply@chasseurdejeux.fr"
    SMTP_TLS: bool = True

    SEED_ADMIN_EMAIL: str = "admin@chasseurdejeux.fr"
    SEED_ADMIN_PASSWORD: str = "Admin1234!"

    @model_validator(mode="after")
    def check_production_secrets(self) -> "Settings":
        if self.APP_ENV == "production":
            if self.SECRET_KEY == "changeme":
                raise ValueError("SECRET_KEY must be changed in production")
            if self.POSTGRES_PASSWORD == "tcg":
                raise ValueError("POSTGRES_PASSWORD must be changed in production")
        return self

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}/{self.POSTGRES_DB}"
        )

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]


settings = Settings()
