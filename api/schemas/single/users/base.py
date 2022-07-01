from typing import Any

from pydantic import Field, validator

from schemas import CamelModel
from settings import UserSettings


class BaseUser(CamelModel):

    first_name: str = Field(max_length=UserSettings.MAX_FIRST_NAME_LEN)
    last_name: str = Field(max_length=UserSettings.MAX_LAST_NAME_LEN)
    fathers_name: str = Field(default='', max_length=UserSettings.MAX_FATHERS_NAME_LEN)
    username: str = Field(min_length=5, max_length=UserSettings.MAX_USERNAME_NAME_LEN)


class UserCreateMixin(CamelModel):
    password: str
    re_password: str

    @validator('password')
    def validate_password(cls, v: str):
        if len(v) < 8:
            raise ValueError('Пароль слишком короткий (минимум 8 символов)')
        if not v.isascii():
            raise ValueError(f'Пароль содержит недопустимые символы {(c for c in v if not c.isascii())}')
        if v.isdigit():
            raise ValueError('Пароль должен содержать хотя бы 1 заглавную и прописную букву')
        if v.islower():
            raise ValueError('Пароль должен содержать хотя бы 1 заглавную букву')
        if v.isupper():
            raise ValueError('Пароль должен содержать хотя бы 1 прописную букву')
        return v

    @validator('re_password')
    def passwords_equal(cls, v: str, values: dict[str, Any]):
        if pw := values.get('password'):
            if v != pw:
                raise ValueError("Пароли не совпадают")
        return v

