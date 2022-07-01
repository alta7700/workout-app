from fastapi import APIRouter, Query, Depends
from starlette import status
from tortoise.exceptions import IntegrityError

from auth.config import TokenUser
from exceptions import UsernameExists, PermissionDenied
from services import users as users_service
from dependencies import auth as auth_deps
from schemas import StudentCreate, StudentRead, faculties, StudHierarchy

students_router = APIRouter()


@students_router.post('/create', response_model=StudentRead, status_code=status.HTTP_201_CREATED)
async def create(data: StudentCreate):
    db_user = await users_service.pre_create_user(data)
    try:
        await db_user.save()
    except IntegrityError:
        raise UsernameExists()
    return StudentRead.from_orm(db_user)


@students_router.get('/', response_model=StudHierarchy)
async def get_students(
        faculty_id: int = Query(None, alias='faculty', ge=1, le=len(faculties)),
        course_n: int = Query(None, alias='course', ge=1),
        group_n: int = Query(None, alias='group', ge=1),
        user: TokenUser = Depends(auth_deps.get_auth)
):
    if user.is_superuser or user.is_teacher:
        pass
    elif user.is_head and (user.faculty_id, user.course_n, user.group_n) == (faculty_id, course_n, group_n):
        pass
    else:
        raise PermissionDenied('Преподавателя или старосты')
    students_list = await users_service.get_students_list(faculty_id, course_n, group_n)
    return users_service.get_students_tree(students_list)
