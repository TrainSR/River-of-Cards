from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DECK_FILE_ID: str = ""
    ALLOWED_ORIGIN: str = ""
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
settings = Settings()