from schemas import CamelModel


class WorkoutCreate(CamelModel):
    subject_id: int
    teacher_id: int
    random_key: str
    student_id: int


__all__ = ["WorkoutCreate"]
