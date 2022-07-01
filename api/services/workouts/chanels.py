from random import choices
from string import ascii_letters, digits
from typing import Optional

from starlette.websockets import WebSocket, WebSocketState
from tortoise import timezone


class WorkoutChanel:

    teacher: WebSocket
    subject_id: int
    teacher_id: int
    comment: str
    random_key: Optional[str]

    student: Optional[WebSocket]

    def __init__(self, teacher: WebSocket, subject_id: int, teacher_id: int, comment: str):
        self.teacher = teacher
        self.subject_id = subject_id
        self.teacher_id = teacher_id
        self.random_key = self.generate_random_key()
        self.comment = comment

    @staticmethod
    def generate_random_key() -> str:
        return ''.join(choices(population=ascii_letters + digits, k=25)) + str(int(timezone.now().timestamp()))

    def update_random_key(self) -> None:
        self.random_key = self.generate_random_key()

    def connect_student(self, student: WebSocket) -> None:
        self.student = student

    def disconnect_student(self, code: int, reason: str) -> None:
        if self.student.client_state != WebSocketState.DISCONNECTED:
            self.student.close(code=code, reason=reason)
        self.student = None


