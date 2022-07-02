from fastapi import Header, Query, Depends

from auth.config import Token, TokenTypes, TokenUser
from auth import logic as auth_logic
from exceptions import InvalidAuthHeader, InvalidJWTToken, TokenExpired, PermissionDenied


def parse_token_payload(token: str) -> Token:
    payload = auth_logic.get_token_payload(token=token)
    if payload.type != TokenTypes.access:
        raise InvalidJWTToken()
    if payload.is_expired():
        raise TokenExpired()
    return payload


async def get_auth(token: str = Header(alias='Token')) -> TokenUser:
    scheme, _, jwt_token = token.partition(' ')
    if scheme.lower() != 'bearer':
        raise InvalidAuthHeader()
    payload = parse_token_payload(jwt_token)
    return payload.user


async def get_admin(user: TokenUser = Depends(get_auth)) -> TokenUser:
    if not user.is_superuser:
        raise PermissionDenied('администратора')
    return user


async def get_teacher(user: TokenUser = Depends(get_auth)) -> TokenUser:
    if not user.is_teacher:
        raise PermissionDenied('преподавателя')
    return user
