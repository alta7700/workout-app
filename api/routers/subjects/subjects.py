from fastapi import APIRouter, Depends, Body
from tortoise.exceptions import IntegrityError

from auth.config import TokenUser
from exceptions import BadRequest
from models import User
from dependencies import auth as auth_deps
from schemas import SubjectRead, TeacherRead, SubjectCreate
from services import subjects as subjects_service
from services import users as users_service

subjects_router = APIRouter()


@subjects_router.post('/create', response_model=SubjectRead)
async def create(data: SubjectCreate, admin: User = Depends(auth_deps.get_admin, use_cache=False)):
    try:
        subject = await subjects_service.create_subject(data=data)
    except IntegrityError:
        raise BadRequest('Предмет уже создан')
    return SubjectRead.from_orm(subject)


@subjects_router.get('/', response_model=list[SubjectRead])
async def get_all(user: User = Depends(auth_deps.get_auth, use_cache=False)):
    return [SubjectRead.from_orm(s) for s in await subjects_service.get_subjects_list()]


@subjects_router.get('/{subject_id}/teachers', response_model=list[TeacherRead])
async def get_teachers_list(subject_id: int, user: TokenUser = Depends(auth_deps.get_auth, use_cache=False)):
    teachers = await users_service.get_subject_teachers(subject_id=subject_id)
    return [TeacherRead.from_orm(t) for t in teachers]


@subjects_router.post('/{subject_id}/add_teacher', response_model=list[TeacherRead])
async def create(
        subject_id: int, teacher_ids: list[int] = Body(...),
        admin: User = Depends(auth_deps.get_admin, use_cache=False)
):
    await subjects_service.add_teachers(subject_id=subject_id, teacher_ids=teacher_ids)
    teachers = await users_service.get_subject_teachers(subject_id=subject_id)
    return [TeacherRead.from_orm(t) for t in teachers]

