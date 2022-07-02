from datetime import datetime

from schemas import ORMCamelModel, TeacherRead, StudentRead


class AcceptedWorkOutRead(ORMCamelModel):
    # Нет преподавателей, потому что это список принятых данным преподавателем отработок

    id: int
    subject_id: int
    student: StudentRead
    created_at: datetime


class WorkOutRead(ORMCamelModel):

    id: int
    subject_id: int
    teacher: TeacherRead
    student: StudentRead
    created_at: datetime


class StudentWorkOut(ORMCamelModel):
    id: int
    subject_id: int
    teacher: TeacherRead
    created_at: datetime
