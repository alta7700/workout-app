from typing import Any, Optional

from fastapi import HTTPException
from starlette import status


class UsernameExists(HTTPException):
    def __init__(self,
                 detail: Any = 'Пользователь с таким логином уже существует',
                 headers: Optional[dict[str, Any]] = None,
                 ) -> None:
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail, headers=headers)


class NotAuthorized(HTTPException):
    def __init__(self,
                 detail: Any = 'Необходимо авторизоваться',
                 headers: Optional[dict[str, Any]] = None,
                 ) -> None:
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail, headers=headers)


class AuthFailed(HTTPException):
    def __init__(self,
                 detail: Any = 'Неверный логин или пароль',
                 headers: Optional[dict[str, Any]] = None,
                 ) -> None:
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail, headers=headers)


class InvalidJWTToken(HTTPException):
    def __init__(self,
                 detail: Any = 'Неверный токен авторизации',
                 headers: Optional[dict[str, Any]] = None,
                 ) -> None:
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail, headers=headers)


class TokenExpired(HTTPException):
    def __init__(self,
                 detail: Any = 'Истёк срок действия токена авторизации',
                 headers: Optional[dict[str, Any]] = None,
                 ) -> None:
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail, headers=headers)


class TokenPayloadInvalid(HTTPException):
    def __init__(self,
                 detail: Any = 'Неверная информация в токене авторизации',
                 headers: Optional[dict[str, Any]] = None,
                 ) -> None:
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail, headers=headers)


class UserLocked(HTTPException):
    def __init__(self,
                 detail: Any = 'Пользователь заблокирован',
                 headers: Optional[dict[str, Any]] = None,
                 ) -> None:
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail, headers=headers)


class InvalidAuthHeader(HTTPException):
    def __init__(self,
                 detail: Any = 'Необходим заголовок Token: Bearer ...jwt token...',
                 headers: Optional[dict[str, Any]] = None,
                 ) -> None:
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail, headers=headers)


class PermissionDenied(HTTPException):
    def __init__(self,
                 whose: str,
                 headers: Optional[dict[str, Any]] = None,
                 ) -> None:
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=f"Необходимы права {whose}", headers=headers)


class BadRequest(HTTPException):
    def __init__(self,
                 detail: Any = '',
                 headers: Optional[dict[str, Any]] = None,
                 ) -> None:
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail, headers=headers)

