from typing import Any

from starlette import status
from tortoise.expressions import Q

from auth.config import TokenUser
from models import User, StudentTeachers
from schemas import StudentRead, StudHierarchy, StudentTableData, StudentsAvailableFilters
from services.users import can_use_ws


async def filter_students(
        q: str = None, order: list[str] = None, filters: dict[str, Any] = None, page: int = None, limit: int = None
) -> list[User] | StudentTableData:
    query = User.filter_students()
    if q:
        q = q.split()
        match len(q):
            case 1:
                query = query.filter(Q(last_name__istartswith=q[0]) | Q(first_name__istartswith=q[0]) |
                                     Q(fathers_name__istartswith=q[0]) | Q(username__istartswith=q[0]))
            case 2:
                query = query.filter(last_name__istartswith=q[0], first_name__istartswith=q[1])
            case 3:
                query = query.filter(last_name__istartswith=q[0], first_name__istartswith=q[1],
                                     fathers_name__istartswith=q[2])
    if order:
        query = query.order_by(*order)
    if filters:
        filter_kwargs = {}
        for name, data in filters.items():
            if isinstance(data, list):
                filter_kwargs[name + '__in'] = data
            else:
                filter_kwargs[name] = data
        query = query.filter(**filter_kwargs)
    if limit:
        students_query = query.limit(limit)
        if page:
            students_query = students_query.offset((page-1)*limit)

        return StudentTableData(
            students=[StudentRead.from_orm(x) for x in await students_query],
            count=await query.count(),
            filters=await get_students_filter()
        )

    return await query


async def get_students_filter() -> StudentsAvailableFilters:
    f_ids, courses, is_head = set(), set(), set()
    for x in await User.filter_students().order_by("faculty_id", "course_n", "is_head")\
            .distinct().values("faculty_id", "course_n", "is_head"):
        f_ids.add(x["faculty_id"])
        courses.add(x["course_n"])
        is_head.add(x["is_head"])
    a = StudentsAvailableFilters(faculty_id=f_ids, course_n=courses, is_head=is_head)
    return a


async def get_teacher_students(subject_id: int, teacher_id: int) -> list[User]:
    query = User.filter_students()
    query = User.order_students(query)
    return await query.filter(teachers__teacher_id=teacher_id, teachers__subject_id=subject_id)


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


async def get_students_faculties() -> list[int]:
    return await User.filter_students().order_by('faculty_id').distinct().values_list('faculty_id', flat=True)


async def get_faculty_courses(faculty_id: int) -> list[int]:
    return await User.filter_students().filter(faculty_id=faculty_id).\
        order_by('course_n').distinct().values_list('course_n', flat=True)


async def get_course_groups(faculty_id: int, course_n: int) -> list[int]:
    return await User.filter_students().filter(faculty_id=faculty_id, course_n=course_n).\
        order_by('group_n').distinct().values_list('group_n', flat=True)


async def can_user_workout(token: str, subject_id: int) -> tuple[bool, int, str, TokenUser]:
    can, code, reason, student = can_use_ws(token)
    if student.is_teacher or student.is_superuser:
        can = False
        code = status.WS_1003_UNSUPPORTED_DATA
        reason = "Недостаточно прав доступа"
    return can, code, reason, student


async def get_students_subjects(student_id: int) -> list[int]:
    return await StudentTeachers.filter(student_id=student_id).values_list('subject_id', flat=True)
