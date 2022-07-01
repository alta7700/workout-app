from datetime import datetime

from tortoise import Model, fields


class WorkOut(Model):

    id: int = fields.SmallIntField(pk=True)
    subject = fields.ForeignKeyField('models.Subject', related_name='workouts')
    teacher = fields.ForeignKeyField('models.User', related_name='accepted_workouts')
    student = fields.ForeignKeyField('models.User', related_name='workouts')
    random_key: str = fields.UUIDField(max_length=50)
    created_at: datetime = fields.DatetimeField(auto_now_add=True)
