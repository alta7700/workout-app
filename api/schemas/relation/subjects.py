from schemas import SubjectRead, TeacherRead


class SubjectTeachers(SubjectRead):
    teachers: list[TeacherRead]


__all__ = ["SubjectTeachers"]
