from typing import Optional

from pydantic import root_validator, validator
from tortoise.fields import ReverseRelation

from schemas import CamelModel, TeacherRead, StudentRead


StudHierarchy = dict[int, dict[int, dict[int, list[StudentRead]]]]


class TSBindCreate(CamelModel):
    subject_id: int
    teacher_id: int
    stud_ids: list[int]


class TSBindRead(CamelModel):
    subject_id: int
    teacher: TeacherRead
    students: StudHierarchy


class TeacherWithSubjectIds(TeacherRead):
    subjects: Optional[list]

    @validator('subjects', pre=True)
    def translate_subjects_to_list_int(cls, v):
        if isinstance(v, ReverseRelation):
            v = [x.subject_id for x in v.related_objects]
        return v


class StudentsAvailableFilters(CamelModel):
    faculty_id: list[int]
    course_n: list[int]
    is_head: list[bool]


class StudentTableData(CamelModel):
    students: list[StudentRead]
    count: int
    filters: StudentsAvailableFilters
