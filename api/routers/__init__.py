from fastapi import FastAPI
from .auth import auth_router
from .subjects import subjects_router
from .workouts import workouts_router


def include_all_routers(app: FastAPI):
    app.include_router(auth_router, prefix='/auth')
    app.include_router(subjects_router, prefix='/subjects', tags=['subjects'])
    app.include_router(workouts_router, prefix='/workouts', tags=['workouts'])


__all__ = ["include_all_routers"]
