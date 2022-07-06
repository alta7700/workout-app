from fastapi import APIRouter, Depends

from auth.config import TokenUser
from schemas import UserMeRead
from services import users as users_services
from dependencies import auth as auth_deps

users_router = APIRouter()


@users_router.get('/me', response_model=UserMeRead, response_model_exclude_none=True, tags=['users'])
async def get_me(user: TokenUser = Depends(auth_deps.get_auth, use_cache=False)):
    user_db = users_services.get_user_by_id(user.id)
    return UserMeRead.from_orm(user_db)


@users_router.get('/me/subjects', response_model=list[int], tags=['users'])
async def get_my_subjects(user: TokenUser = Depends(auth_deps.get_auth, use_cache=False)):
    if user.is_superuser:
        return []
    if user.is_teacher:
        return await users_services.get_teacher_subjects(user.id)
    return await users_services.get_students_subjects(user.id)
