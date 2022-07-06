from datetime import timedelta
from enum import Enum

from jose.constants import ALGORITHMS
from passlib.context import CryptContext
from tortoise import timezone

from schemas import UserMeRead
from schemas.base import CamelModel
from settings import SECRET


class TokenTypes(str, Enum):
    refresh = 'refresh'
    access = 'access'


class JWTConfig:
    ALGORITHM = ALGORITHMS.HS256
    LIFETIME: dict[str, timedelta] = {
        TokenTypes.access: timedelta(days=30),
        TokenTypes.refresh: timedelta(days=30),
    }
    SECRET = SECRET


class TokenUser(CamelModel):

    id: int
    username: str
    is_teacher: bool
    is_superuser: bool

    class Config(CamelModel.Config):
        orm_mode = True


class Token(CamelModel):
    type: TokenTypes
    iat: int  # timestamp
    user: TokenUser

    def is_expired(self) -> bool:
        td = JWTConfig.LIFETIME[self.type]
        return timezone.now().timestamp() - self.iat > td.total_seconds()


class AuthModel(CamelModel):
    username: str
    password: str


class TokenPair(CamelModel):
    access_token: str
    refresh_token: str
    user: UserMeRead


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
