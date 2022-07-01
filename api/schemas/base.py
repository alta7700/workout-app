from datetime import datetime

from pydantic import BaseModel as PydanticBaseModel


def lower_camel(string: str) -> str:
    words = string.split('_')
    if len(words) == 1:
        return string.lower()
    return f'{words[0].lower()}{"".join((w.title() for w in words[1:]))}'


class CamelModel(PydanticBaseModel):

    class Config:
        allow_population_by_field_name = True
        alias_generator = lower_camel
        json_encoders = {
            datetime: lambda v: v.timestamp()
        }


class ORMCamelModel(CamelModel):

    class Config(CamelModel.Config):
        orm_mode = True
