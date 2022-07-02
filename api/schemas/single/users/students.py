from datetime import datetime
from typing import Optional

from .base import BaseUser, UserCreateMixin


class BaseStudent(BaseUser):
    faculty_id: int
    course_n: int
    group_n: int


class StudentCreate(BaseStudent, UserCreateMixin):
    pass


class StudentRead(BaseStudent):
    id: int
    is_active: bool
    is_head: bool
    last_login: Optional[datetime]

    class Config(BaseStudent.Config):
        orm_mode = True


class StudForHierarchy(BaseUser):
    id: int
    is_active: bool
    is_head: bool
    last_login: Optional[datetime]


__all__ = ["StudentCreate", "StudentRead"]
