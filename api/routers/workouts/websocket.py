from fastapi import APIRouter
from starlette.websockets import WebSocket, WebSocketDisconnect

from services.workouts import WorkoutChannel


wo_ws_router = APIRouter()


@wo_ws_router.websocket('/{subject_id}')
async def run_teacher_ws(websocket: WebSocket, subject_id: int):
    chanel = await WorkoutChannel.connect_teacher(websocket, subject_id)
    if not chanel:
        return
    try:
        while True:
            match await chanel.teacher_ws.receive_json():
                case {'type': 'start'}:
                    await chanel.start_wo()
                case {'type': 'commit', 'randomKey': random_key}:
                    if random_key == chanel.random_key:
                        await chanel.commit_wo()
                    else:
                        await chanel.send_teacher({'type': 'error', 'data': 'Произошла ошибка, попробуйте заново'})
                case {'type': 'cancel'}:
                    await chanel.cancel_wo()
                case {'type': 'close me'}:
                    await chanel.close()
                    return
                case _:
                    await websocket.send_json({
                        'type': 'error',
                        'data': 'Неизвестная команда'
                    })
    except WebSocketDisconnect:
        await chanel.close()


@wo_ws_router.websocket('/{random_key}')
async def run_student_ws(websocket: WebSocket, random_key: str):
    chanel = await WorkoutChannel.connect_student(websocket, random_key)
    if not chanel:
        return
    await chanel.send_student_info_to_teacher()
    try:
        while True:
            match await chanel.teacher_ws.receive_json():
                case {'type': 'close me'}:
                    await chanel.disconnect_student()
                    return
                case _:
                    await websocket.send_json({
                        'type': 'error',
                        'data': 'Неизвестная команда'
                    })
    except WebSocketDisconnect:
        await chanel.disconnect_student()

