from datetime import datetime

from fastapi import APIRouter, Query, Depends

from exceptions import BadRequest
from models import User
from schemas import AcceptedWorkOutRead, WorkOutRead, StudentWorkOut
from services import workouts as workouts_service
from services import users as users_service
from dependencies import auth as auth_deps

wo_http_router = APIRouter()


@wo_http_router.get('/{subject_id}/{student_id}', response_model=list[StudentWorkOut])
async def get(
        subject_id: int,
        student_id: int,
        date_start: datetime = Query(None, alias='ds'),
        date_end: datetime = Query(None, alias='de'),
        teacher: User = Depends(auth_deps.get_teacher, use_cache=False)
):
    if not await users_service.is_students_teacher(teacher_id=teacher.id, subject_id=subject_id, student_id=student_id):
        raise BadRequest('Нет доступа к этому предмету')
    workouts = await workouts_service.get_wo_stud_list(
        subject_id=subject_id, student_id=student_id, start=date_start, end=date_end
    )
    return [StudentWorkOut.from_orm(w) for w in workouts]


@wo_http_router.get('/{subject_id}/accepted', response_model=list[AcceptedWorkOutRead])
async def get_accepted(
        subject_id: int,
        accepted_by: int = Query(None, alias='accepted'),
        date_start: datetime = Query(None, alias='ds'),
        date_end: datetime = Query(None, alias='de'),
        teacher: User = Depends(auth_deps.get_teacher, use_cache=False)
):
    if not await users_service.is_subject_teacher(teacher_id=teacher.id, subject_id=subject_id):
        raise BadRequest('Нет доступа к этому предмету')


    accepted_by = accepted_by or teacher.id
    workouts = await workouts_service.get_wo_stud_list(
        accepted_by=accepted_by, subject_id=subject_id, start=date_start, end=date_end, students=True
    )

    return [AcceptedWorkOutRead.from_orm(w) for w in workouts]
