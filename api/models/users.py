from datetime import datetime

from tortoise import Model, fields, timezone
from tortoise.queryset import QuerySet, MODEL

import models
from settings import UserSettings


class User(Model):

    id: int = fields.IntField(pk=True)
    first_name: str = fields.CharField(max_length=UserSettings.MAX_FIRST_NAME_LEN)
    last_name: str = fields.CharField(max_length=UserSettings.MAX_LAST_NAME_LEN)
    fathers_name: str = fields.CharField(max_length=UserSettings.MAX_FATHERS_NAME_LEN)

    username: str = fields.CharField(max_length=UserSettings.MAX_USERNAME_NAME_LEN, unique=True)
    hashed_password: str = fields.CharField(max_length=200)
    password_change_dt: datetime = fields.DatetimeField()
    is_active: bool = fields.BooleanField(default=True)

    is_teacher: bool = fields.BooleanField(default=False)
    is_superuser: bool = fields.BooleanField(default=False)

    faculty_id: int = fields.SmallIntField(null=True)
    course_n: int = fields.SmallIntField(null=True)
    group_n: int = fields.SmallIntField(null=True)
    is_head: bool = fields.BooleanField(null=True)

    workouts: fields.BackwardFKRelation["models.WorkOut"]
    accepted_workouts: fields.BackwardFKRelation["models.WorkOut"]

    subjects: fields.BackwardFKRelation["models.TeacherSubject"]
    teachers: fields.BackwardFKRelation["models.StudentTeachers"]
    students: fields.BackwardFKRelation["models.StudentTeachers"]

    last_login: datetime = fields.DatetimeField(null=True)
    joined_at: datetime = fields.DatetimeField(auto_now_add=True)

    async def update_last_login(self) -> None:
        self.last_login = timezone.now()
        await self.save(update_fields=('last_login',))

    @classmethod
    def filter_students(cls) -> QuerySet[MODEL]:
        return cls.filter(is_teacher=False, is_superuser=False)

    @classmethod
    def filter_teachers(cls) -> QuerySet[MODEL]:
        return cls.filter(is_teacher=True, is_superuser=False)


class StudentTeachers(Model):

    id: int = fields.IntField(pk=True)
    student = fields.ForeignKeyField('models.User', related_name='teachers', on_delete=fields.CASCADE)
    teacher = fields.ForeignKeyField('models.User', related_name='students', on_delete=fields.CASCADE)
    subject = fields.ForeignKeyField('models.Subject', on_delete=fields.CASCADE)

    class Meta:
        unique_together = ('student', 'subject')
