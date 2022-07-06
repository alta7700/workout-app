from tortoise import Model, fields

import models
from settings import SubjectSettings


class Subject(Model):

    id: int = fields.SmallIntField(pk=True)
    title: str = fields.CharField(max_length=SubjectSettings.MAX_TITLE_LEN)
    short_title: str = fields.CharField(max_length=SubjectSettings.MAX_SHORT_TITLE_LEN, unique=True)

    teachers: fields.BackwardFKRelation["models.TeacherSubject"]

    class Meta:
        ordering = ('short_title', )


class TeacherSubject(Model):

    id: int = fields.IntField(pk=True)
    teacher = fields.ForeignKeyField('models.User', related_name='subjects', on_delete=fields.CASCADE)
    subject = fields.ForeignKeyField('models.Subject', related_name='teachers', on_delete=fields.CASCADE)

    class Meta:
        unique_together = ('teacher', 'subject')

