from fastapi import APIRouter, Body

import auth.logic as auth_logic
import services.users as users_service
from auth.config import AuthModel, TokenPair
from exceptions import TokenExpired, TokenPayloadInvalid, UserLocked

jwt_router = APIRouter()


@jwt_router.post('/create', response_model=TokenPair, response_model_exclude_none=True)
async def login(auth: AuthModel = Body(...)):
    user = await users_service.authenticate_user(auth.username, auth.password)
    await user.update_last_login()
    return auth_logic.get_token_pair(user=user)


@jwt_router.post('/refresh', response_model=TokenPair, response_model_exclude_none=True)
async def refresh(refresh_token: str = Body(alias='refreshToken')):
    token_payload = auth_logic.get_token_payload(refresh_token)
    if token_payload.is_expired():
        raise TokenExpired()
    if (user := await users_service.get_user_by_id(user_id=token_payload.user.id)) is None:
        raise TokenPayloadInvalid()
    if user.password_change_dt.timestamp() > token_payload.iat:
        raise TokenExpired()
    if not user.is_active:
        raise UserLocked()

    await user.update_last_login()
    return auth_logic.get_token_pair(user=user)
