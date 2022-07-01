from fastapi import APIRouter
from .jwt import jwt_router
from .users import users_router


auth_router = APIRouter()


auth_router.include_router(jwt_router, prefix='/jwt', tags=['jwt'])
auth_router.include_router(users_router, prefix='/users')
