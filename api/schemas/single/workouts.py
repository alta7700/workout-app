from schemas import CamelModel


class WorkoutStart(CamelModel):
    subject_id: int
    teacher_id: int
    random_key: str


class WorkoutCreate(WorkoutStart):
    student_id: int


__all__ = ["WorkoutStart", "WorkoutCreate"]
