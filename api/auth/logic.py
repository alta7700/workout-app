from tortoise import timezone

from exceptions import InvalidJWTToken
from models import User
from schemas import UserMeRead
from .config import pwd_context, JWTConfig, Token, TokenUser, TokenTypes, TokenPair
from jose import jwt, JWTError


__all__ = [
    "get_fake_password", "verify_password", "get_password_hash", "create_token", "get_token_payload", "get_token_pair"
]


def get_fake_password(real_password: str, user: User) -> str:
    return real_password + str(user.password_change_dt.timestamp())


def verify_password(fake_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(fake_password, hashed_password)


def get_password_hash(fake_password: str) -> str:
    return pwd_context.hash(fake_password)


def create_token(payload: Token) -> str:
    return jwt.encode(payload.dict(), JWTConfig.SECRET, JWTConfig.ALGORITHM)


def get_token_payload(token: str) -> Token:
    try:
        payload = jwt.decode(token, JWTConfig.SECRET, JWTConfig.ALGORITHM)
    except JWTError:
        raise InvalidJWTToken()
    return Token(**payload)


def get_token_pair(user: User) -> TokenPair:
    now = timezone.now().timestamp()
    user_data = TokenUser.from_orm(user)
    access = Token(type=TokenTypes.access, iat=now, user=user_data)
    refresh = Token(type=TokenTypes.refresh, iat=now, user=user_data)

    access_token = create_token(access)
    refresh_token = create_token(refresh)

    return TokenPair(access_token=access_token, refresh_token=refresh_token, user=UserMeRead.from_orm(user))
