from random import choices
from string import ascii_letters, digits

import async_timeout
from tortoise import timezone

from core.redis_client import redis
from schemas import WorkoutStart


class WORedisManager:

    # WO = WorkOut
    WO_CREATING = 'wo:creating'
    PUBSUB_WO_RESULT = 'wo:result'
    EMPTY_VALUE = 'empty'

    subject_id: int
    teacher_id: int
    random_key: str

    def __init__(self, subject_id: int, teacher_id: int, random_key: str):
        self.subject_id = subject_id
        self.teacher_id = teacher_id
        self.random_key = random_key or self.generate_random_key()

    @staticmethod
    def generate_random_key() -> str:
        return ''.join(choices(population=ascii_letters + digits, k=25)) + str(int(timezone.now().timestamp()))

    def get_wo_creating_key(self) -> str:
        return f"{self.WO_CREATING}:{self.subject_id}:{self.teacher_id}:{self.random_key}"

    def get_wo_result_key(self) -> str:
        return f"{self.PUBSUB_WO_RESULT}:{self.random_key}"

    async def start_wo(self) -> WorkoutStart:
        await redis.set(self.get_wo_creating_key(), self.EMPTY_VALUE, ex=60)
        return WorkoutStart(
                subject_id=self.subject_id,
                teacher_id=self.teacher_id,
                random_key=self.random_key
        )

    async def set_student_wo(self, stud_id: int) -> bool:
        key = self.get_wo_creating_key()
        if (value := await redis.get(key)) is not None or value != self.EMPTY_VALUE:
            return False
        await redis.set(key, stud_id, ex=600)
        return True

    async def wait_for_commit_message(self):
        key = self.get_wo_result_key()
        while True:
            async with async_timeout.timeout(1.0):
                if message := await redis.get(key) is not None:
                    return message

    async def check_wo(self, subject_id: int, teacher_id: int, random_key: str) -> int | None:
        key = cls.get_wo_creating_key(subject_id, teacher_id, random_key)
        student_id = await redis.get(key)
        return student_id

    @classmethod
    async def commit_wo(cls, subject_id: int, teacher_id: int, random_key: str) -> WorkoutCreate:
        key = cls.get_wo_creating_key(subject_id, teacher_id, random_key)
        student_id = await redis.get(key)
        if student_id:
            await redis.delete(key)
            return WorkoutCreate(
                subject_id=subject_id,
                teacher_id=teacher_id,
                student_id=int(student_id),
                random_key=random_key
            )
