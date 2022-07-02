from random import choices
from string import ascii_letters, digits
from typing import Optional, Any

from starlette import status
from starlette.websockets import WebSocket, WebSocketState
from tortoise import timezone

from models import User
from services import users as users_service
from services import workouts as workouts_service

from schemas import StudentRead, WorkoutCreate

channels_pool: dict[str, "WorkoutChannel"]= {}


class WorkoutChannel:

    teacher_ws: WebSocket
    teacher_db: User
    student_ws: Optional[WebSocket]
    student_db: Optional[User]

    subject_id: int
    teacher_id: int
    comment: str
    random_key: Optional[str]

    def __init__(self, teacher_ws: WebSocket, teacher_db: User, subject_id: int, comment: str):
        self.teacher_ws = teacher_ws
        self.teacher_db = teacher_db

        self.subject_id = subject_id
        self.comment = comment
        self.random_key = None

    @staticmethod
    def generate_random_key() -> str:
        return ''.join(choices(population=ascii_letters + digits, k=25)) + str(int(timezone.now().timestamp()))

    @classmethod
    async def connect_teacher(cls, teacher_ws: WebSocket, subject_id: int) -> Optional["WorkoutChannel"]:
        await teacher_ws.accept()
        token = await teacher_ws.receive_text()
        can, code, reason, teacher_tk = await users_service.can_user_accept_workouts(token=token, subject_id=subject_id)
        if not can:
            return await teacher_ws.close(code=code, reason=reason)
        teacher_db = await users_service.get_user_by_id(user_id=teacher_tk.id)
        await teacher_ws.send_json({'type': 'valid', 'data': 'OK'})
        comment = await teacher_ws.receive_text()
        return cls(teacher_ws, teacher_db, subject_id, comment)

    @classmethod
    async def connect_student(cls, student_ws: WebSocket, random_key: str) -> Optional["WorkoutChannel"]:
        await student_ws.accept()
        if not (chanel := channels_pool.get(random_key)):
            return await student_ws.close(code=status.WS_1007_INVALID_FRAME_PAYLOAD_DATA, reason='Код недействителен')
        if chanel.student_ws and chanel.student_ws.client_state != WebSocketState.DISCONNECTED:
            return await student_ws.close(
                code=status.WS_1000_NORMAL_CLOSURE,
                reason='Другой студент уже подключился по этому коду'
            )
        token = await student_ws.receive_text()
        can, code, reason, student_tk = await users_service.can_user_workout(token=token, subject_id=chanel.subject_id)
        if not can:
            return await student_ws.close(code=code, reason=reason)
        student_db = await users_service.get_user_by_id(user_id=student_tk.id)
        chanel.student_ws = student_ws
        chanel.student_db = student_db
        return chanel

    async def send_teacher(self, msg: Any) -> None:
        if self.teacher_ws.client_state != WebSocketState.DISCONNECTED:
            await self.teacher_ws.send_json(msg)

    async def send_student(self, msg: Any) -> None:
        if self.student_ws and self.student_ws.client_state != WebSocketState.DISCONNECTED:
            await self.student_ws.send_json(msg)

    async def send_both(self, msg: Any) -> None:
        await self.send_teacher(msg)
        await self.send_student(msg)

    async def close(self) -> None:
        await self.send_both({'type': 'do_close'})
        self.del_from_pool()

    async def disconnect_student(self) -> None:
        await self.send_student({'type': 'do_close'})
        self.student_ws = None
        self.student_db = None

    def del_from_pool(self) -> None:
        if channels_pool.get(self.random_key):
            channels_pool.pop(self.random_key)

    def update_random_key(self) -> None:
        self.del_from_pool()
        self.random_key = self.generate_random_key()
        channels_pool[self.random_key] = self

    async def start_wo(self) -> None:
        self.update_random_key()
        await self.send_teacher({'type': 'started', 'data': self.random_key})

    async def send_student_info_to_teacher(self):
        await self.send_teacher(StudentRead.from_orm(self.student_db).dict(by_alias=True))

    async def commit_wo(self):
        data = WorkoutCreate(
            subject_id=self.subject_id,
            teacher_id=self.teacher_db.id,
            student_id=self.student_db.id,
            comment=self.comment,
            random_key=self.random_key
        )
        await workouts_service.create_workout(data)
        await self.send_both({'type': 'committed', 'data': 'Отработка принята'})
        await self.disconnect_student()

    async def cancel_wo(self):
        await self.send_both({'type': 'canceled', 'data': 'Отработка не принята'})
        await self.disconnect_student()
