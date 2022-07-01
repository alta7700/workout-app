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

