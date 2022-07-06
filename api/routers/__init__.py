from fastapi import FastAPI
from .auth import auth_router
from .subjects import subjects_router
from .workouts import workouts_router
from .faculties import faculties_router


def include_all_routers(app: FastAPI):
    app.include_router(auth_router, prefix='/api/auth')
    app.include_router(subjects_router, prefix='/api/subjects', tags=['subjects'])
    app.include_router(workouts_router, prefix='/api/workouts', tags=['workouts'])
    app.include_router(faculties_router, prefix='/api/faculties', tags=['faculties'])


__all__ = ["include_all_routers"]
