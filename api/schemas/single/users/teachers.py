from datetime import datetime
from typing import Optional

from .base import BaseUser, UserCreateMixin


class BaseTeacher(BaseUser):
    pass


class TeacherCreate(BaseTeacher, UserCreateMixin):
    pass


class TeacherRead(BaseTeacher):
    id: int
    is_active: bool
    last_login: Optional[datetime]

    class Config(BaseTeacher.Config):
        orm_mode = True


__all__ = ["TeacherCreate", "TeacherRead"]
