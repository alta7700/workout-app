from starlette import status

from auth.config import TokenUser
from models import TeacherSubject, User, StudentTeachers, Subject
from services.users import can_use_ws


async def is_subject_teacher(teacher_id: int, subject_id: int) -> bool:
    return await TeacherSubject.exists(teacher_id=teacher_id, subject_id=subject_id)


async def is_students_teacher(teacher_id: int, subject_id: int, student_id: int) -> bool:
    return await StudentTeachers.exists(teacher_id=teacher_id, subject_id=subject_id, student_id=student_id)


async def get_teachers_list() -> list[User]:
    return await User.filter(is_active=True, is_teacher=True).prefetch_related('subjects')


async def get_subject_teachers(subject_id: int) -> list[User]:
    return await User.filter(is_active=True, is_teacher=True, subjects__subject_id=subject_id)


async def get_teacher_subjects(teacher_id: int) -> list[int]:
    return await TeacherSubject.filter(teacher_id=teacher_id).values_list('subject_id', flat=True)


async def bind_teacher_and_students(teacher_id: int, subject_id: int, stud_ids: list[int]) -> None:
    students = await User.filter(is_superuser=False, is_teacher=False, is_active=True, id__in=stud_ids)\
        .values_list('id', flat=True)
    await StudentTeachers.bulk_create(
        objects=[StudentTeachers(student_id=s, teacher_id=teacher_id, subject_id=subject_id) for s in students],
        ignore_conflicts=True
    )


async def can_user_accept_workouts(token: str, subject_id: int) -> tuple[bool, int, str, TokenUser]:
    can, code, reason, teacher = can_use_ws(token)
    if not teacher.is_teacher or not (await is_subject_teacher(teacher_id=teacher.id, subject_id=subject_id)):
        can = False
        code = status.WS_1003_UNSUPPORTED_DATA
        reason = "Недостаточно прав доступа"
    return can, code, reason, teacher
