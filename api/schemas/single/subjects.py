from pydantic import Field

from schemas import CamelModel
from settings import SubjectSettings


class BaseSubject(CamelModel):
    title: str = Field(max_length=SubjectSettings.MAX_TITLE_LEN)
    short_title: str = Field(max_length=SubjectSettings.MAX_SHORT_TITLE_LEN)


class SubjectCreate(BaseSubject):
    pass


class SubjectRead(BaseSubject):
    id: int

    class Config(BaseSubject.Config):
        orm_mode = True


__all__ = ["SubjectCreate", "SubjectRead"]
