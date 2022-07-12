from typing import Any

from fastapi import APIRouter, Query, Depends, Path
from starlette import status
from tortoise.exceptions import IntegrityError

from auth.config import TokenUser
from dependencies.query import StudentsParams
from exceptions import UsernameExists, PermissionDenied
from services import users as users_service
from dependencies import auth as auth_deps
from dependencies import query as query_deps
from schemas import StudentCreate, faculties, StudHierarchy, StudentRead, StudentTableData

students_router = APIRouter()


@students_router.post('/create', status_code=status.HTTP_201_CREATED)
async def create(data: StudentCreate):
    db_user = await users_service.pre_create_user(data)
    db_user.is_head = False
    try:
        await db_user.save()
    except IntegrityError:
        raise UsernameExists()


@students_router.get('/', response_model=StudentTableData)
async def get_students(
        query: StudentsParams = Depends(query_deps.get_query_pars, use_cache=False),
        user: TokenUser = Depends(auth_deps.get_auth, use_cache=False),
):
    if not (user.is_superuser or user.is_teacher):
        raise PermissionDenied('Преподавателя')
    return await users_service.filter_students(**query.__dict__)


@students_router.get('/tree', response_model=list[int])
async def get_faculty_ids(
        user: TokenUser = Depends(auth_deps.get_auth, use_cache=False)
):
    if not (user.is_superuser or user.is_teacher):
        raise PermissionDenied('Администратора или преподавателя')
    return await users_service.get_students_faculties()


@students_router.get('/tree/{faculty_id}', response_model=list[int])
async def get_faculty_courses(
        faculty_id: int = Path(..., ge=1, le=len(faculties)),
        user: TokenUser = Depends(auth_deps.get_auth, use_cache=False)
):
    if not (user.is_superuser or user.is_teacher):
        raise PermissionDenied('Администратора или преподавателя')
    return await users_service.get_faculty_courses(faculty_id)


@students_router.get('/tree/{faculty_id}/{course_n}', response_model=list[int])
async def get_course_groups(
        faculty_id: int = Path(..., ge=1, le=len(faculties)),
        course_n: int = Path(..., ge=1, le=6),
        user: TokenUser = Depends(auth_deps.get_auth, use_cache=False)
):
    if not (user.is_superuser or user.is_teacher):
        raise PermissionDenied('Администратора или преподавателя')
    return await users_service.get_course_groups(faculty_id, course_n)


@students_router.get('/tree/{faculty_id}/{course_n}/{group_n}', response_model=list[StudentRead],
                     response_model_exclude={'faculty_id', 'course_n', 'group_n'})
async def get_course_groups(
        faculty_id: int = Path(..., ge=1, le=len(faculties)),
        course_n: int = Path(..., ge=1, le=6),
        group_n: int = Path(..., ge=1),
        user: TokenUser = Depends(auth_deps.get_auth, use_cache=False)
):
    if not (user.is_superuser or user.is_teacher):
        raise PermissionDenied('Администратора или преподавателя')
    return [StudentRead.from_orm(x) for x in await users_service.filter_students(
        order=['last_name', 'first_name', 'fathers_name'],
        filters={'faculty_id': faculty_id, 'course_n': course_n, 'group_n': group_n}
    )]


