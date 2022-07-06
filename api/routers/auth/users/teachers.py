from fastapi import APIRouter, Depends
from starlette import status
from tortoise.exceptions import IntegrityError

from exceptions import UsernameExists, BadRequest
from models import User
from services import users as users_service
from dependencies import auth as auth_deps
from schemas import TeacherCreate, TSBindCreate, StudHierarchy, TeacherWithSubjectIds

teachers_router = APIRouter()


@teachers_router.get('/', response_model=list[TeacherWithSubjectIds])
async def get_teachers(admin: User = Depends(auth_deps.get_admin, use_cache=False)):
    return [TeacherWithSubjectIds.from_orm(x) for x in await users_service.get_teachers_list()]


@teachers_router.post('/create', status_code=status.HTTP_201_CREATED)
async def create(
        data: TeacherCreate,
        admin: User = Depends(auth_deps.get_admin, use_cache=False)
):
    db_user = await users_service.pre_create_user(data)
    db_user.is_teacher = True
    try:
        await db_user.save()
    except IntegrityError:
        raise UsernameExists()


@teachers_router.post('/bind', response_model=StudHierarchy)
async def bind_teacher_and_students(
        data: TSBindCreate,
        admin: User = Depends(auth_deps.get_admin, use_cache=False)
):
    if not await users_service.is_subject_teacher(teacher_id=data.teacher_id, subject_id=data.subject_id):
        raise BadRequest('У преподавателя нет доступа к этому предмету')
    await users_service.bind_teacher_and_students(
        subject_id=data.subject_id, teacher_id=data.teacher_id, stud_ids=data.stud_ids
    )
    students_list = await users_service.get_teacher_students(subject_id=data.subject_id, teacher_id=data.teacher_id)
    return users_service.get_students_tree(students_list)


