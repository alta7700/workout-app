from datetime import datetime

from tortoise.expressions import Subquery

from models import WorkOut, StudentTeachers
from schemas import WorkoutCreate


async def get_wo_stud_list(
        subject_id: int, student_id: int = None, accepted_by: int = None, teacher_id: int = None,
        start: datetime = None, end: datetime = None, students=True,
) -> list[WorkOut]:
    query = WorkOut.filter(subject_id=subject_id)
    if student_id:
        query = query.filter(student_id=student_id)
    if accepted_by:
        query = query.filter(teacher_id=accepted_by)
    if teacher_id:
        sq = StudentTeachers.filter(subject_id=subject_id, teacher_id=teacher_id).distinct().values_list('id', flat=True)
        query = query.filter(student_id__in=Subquery(sq))
    if start and end:
        query = query.filter(created_at__range=(start, end))
    elif start:
        query = query.filter(created_at__gte=start)
    elif end:
        query = query.filter(created_at__lte=end)
    if students:
        query = query.select_related('student')
    return await query


async def create_workout(data: WorkoutCreate) -> WorkOut:
    return await WorkOut.create(**data.dict())
