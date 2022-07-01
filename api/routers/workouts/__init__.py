from fastapi import APIRouter
from .workouts import wo_http_router
from .websocket import wo_ws_router


workouts_router = APIRouter()
workouts_router.include_router(wo_http_router)
workouts_router.include_router(wo_ws_router, prefix='/ws')


