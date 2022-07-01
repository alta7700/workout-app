from starlette import status
from tortoise import timezone
from tortoise.exceptions import DoesNotExist
from tortoise.functions import Lower

from auth.config import TokenUser
from dependencies.auth import parse_token_payload
from exceptions import AuthFailed, BadRequest, InvalidJWTToken, TokenExpired
from models import User
from auth import logic as auth_logic
from schemas import TeacherCreate, StudentCreate


async def get_user_by_id(user_id: int, raise_e=False) -> User:
    user = await User.get_or_none(id=user_id)
    if not user and raise_e:
        raise BadRequest('Пользователь не найден')
    return user


async def get_user_by_username(username: str) -> User | None:
    return await User.annotate(username_lower=Lower('username')).get_or_none(username_lower=username.lower())


async def authenticate_user(username: str, password: str) -> User:
    user = await get_user_by_username(username)
    if user is None:
        raise AuthFailed()
    fake_password = auth_logic.get_fake_password(password, user)
    if auth_logic.verify_password(fake_password, user.hashed_password) is False:
        raise AuthFailed()
    return user


async def pre_create_user(user: StudentCreate | TeacherCreate) -> User:
    db_user = User(**user.dict())

    now = timezone.now()
    db_user.password_change_dt = now

    password_hash = auth_logic.get_password_hash(auth_logic.get_fake_password(user.password, db_user))
    db_user.hashed_password = password_hash

    return db_user


def can_use_ws(token: str) -> tuple[bool, int, str, TokenUser]:
    can, code, reason, user = True, 0, '', None
    try:
        payload = parse_token_payload(token)
        user = payload.user
    except InvalidJWTToken:
        can = False
        code = status.WS_1007_INVALID_FRAME_PAYLOAD_DATA
        reason = "Неверный токен авторизации"
    except TokenExpired:
        can = False
        code = status.WS_1013_TRY_AGAIN_LATER
        reason = "Истёк срок действия токена авторизации"
    return can, code, reason, user
