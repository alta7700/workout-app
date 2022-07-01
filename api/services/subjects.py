from models import Subject, TeacherSubject, User
from schemas import SubjectCreate


async def create_subject(data: SubjectCreate) -> Subject:
    return await Subject.create(**data.dict())


async def get_subjects_list() -> list[Subject]:
    return await Subject.all()


async def add_teachers(subject_id: int, teacher_ids: list[int]) -> None:
    subject = await Subject.get_or_none(id=subject_id)
    if subject:
        teachers = await User.filter(id__in=teacher_ids, is_teacher=True)
        if teachers:
            objects = [TeacherSubject(subject_id=subject_id, teacher_id=t.id) for t in teachers]
            await TeacherSubject.bulk_create(objects=objects, ignore_conflicts=True)
