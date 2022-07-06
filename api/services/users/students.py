from starlette import status

from auth.config import TokenUser
from models import User, StudentTeachers
from schemas import StudentRead, StudHierarchy
from services.users import can_use_ws


async def get_students_list(
        faculty_id: int = None, course_n: int = None, group_n: int = None, is_head: bool = None
) -> list[User]:
    query = User.filter_students()
    if faculty_id:
        query = query.filter(faculty_id=faculty_id)
    if course_n:
        query = query.filter(course_n=course_n)
    if group_n:
        query = query.filter(group_n=group_n)
    if is_head is not None:
        query = query.filter(is_head=is_head)
    return await query


async def get_teacher_students(subject_id: int, teacher_id: int) -> list[User]:
    return await User.filter_students().filter(teachers__teacher_id=teacher_id, teachers__subject_id=subject_id)


def get_students_tree(
        studs: list[User]
) -> StudHierarchy:
    d = {}
    current = ()
    gr_list: list[StudentRead] = []
    for s in studs:
        if (s.faculty_id, s.course_n, s.group_n) != current:
            current = (s.faculty_id, s.course_n, s.group_n)
            if not (f := d.get(s.faculty_id)):
                f = d[s.faculty_id] = {}
            if not (c := f.get(s.course_n)):
                c = f[s.course_n] = {}
            if not (gr_list := c.get(s.group_n)):
                gr_list = c[s.group_n] = []
        gr_list.append(StudentRead.from_orm(s))
    return d


async def can_user_workout(token: str, subject_id: int) -> tuple[bool, int, str, TokenUser]:
    can, code, reason, student = can_use_ws(token)
    if student.is_teacher or student.is_superuser:
        can = False
        code = status.WS_1003_UNSUPPORTED_DATA
        reason = "Недостаточно прав доступа"
    return can, code, reason, student


async def get_students_subjects(student_id: int) -> list[int]:
    return await StudentTeachers.filter(student_id=student_id).values_list('subject_id', flat=True)
