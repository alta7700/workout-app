from fastapi import APIRouter
from starlette import status
from starlette.websockets import WebSocket

from core.redis_client import RedisManager
from schemas import StudentRead
from services import users as users_service
from services import workouts as workouts_service


wo_ws_router = APIRouter()


@wo_ws_router.websocket('/{subject_id}')
async def run_teacher_ws(websocket: WebSocket, subject_id: int):
    await websocket.accept()
    token = await websocket.receive_text()
    can, code, reason, teacher = await users_service.can_user_accept_workouts(token=token, subject_id=subject_id)
    if not can:
        return await websocket.close(code=code, reason=reason)
    async for action in websocket.iter_json():
        match action:
            case {'type': 'create'}:
                await websocket.send_json({
                    'type': 'created',
                    'data': await RedisManager.start_wo(subject_id, teacher.id)
                })
            case {'type': 'check', 'random_key': random_key}:
                student_id = await RedisManager.check_wo(subject_id, teacher.id, random_key)
                if student_id and (student := await users_service.get_user_by_id(user_id=student_id)):
                    await websocket.send_json({
                        'type': 'checked',
                        'data': StudentRead.from_orm(student)
                    })
                else:
                    await websocket.send_json({
                        'type': 'checked',
                        'data': None
                    })
            case {'type': 'commit', 'random_key': random_key}:
                if wo_create := await RedisManager.commit_wo(subject_id, teacher.id, random_key):
                    await workouts_service.create_workout(wo_create)
                    await r
                    await websocket.send_json({
                        'type': 'committed',
                        'data': wo_create.dict()
                    })
                else:
                    await websocket.send_json({
                        'type': 'error',
                        'data': 'Произошла ошибка, попробуйте заново'
                    })
            case _:
                await websocket.send_json({
                    'type': 'error',
                    'data': 'Неизвестная команда'
                })


@wo_ws_router.websocket('/{subject_id}/{teacher_id}/{random_key}')
async def run_student_ws(websocket: WebSocket, subject_id: int, teacher_id: int, random_key: str):
    await websocket.accept()
    token = await websocket.receive_text()
    can, code, reason, student = await users_service.can_user_workout(token=token, subject_id=subject_id)
    if not can:
        return await websocket.close(code=code, reason=reason)
    ok = await RedisManager.set_student_wo(subject_id, teacher_id, random_key, student.id)
    if not ok:
        await websocket.close(code=status.WS_1013_TRY_AGAIN_LATER, reason='Произошла ошибка, попробуйте заново')
    await RedisManager.wait_for_commit_message(random_key)
