import json
import re
from typing import Any

from starlette.datastructures import QueryParams
from starlette.requests import Request


class QueryModel:

    camel_to_snake_pattern = re.compile('([A-Z]+)')

    @classmethod
    def camel_to_snake(cls, string):
        return cls.camel_to_snake_pattern.sub(r'_\1', string).lower()

    def __init__(self, qs: QueryParams):
        types_mapping = {
            int: self.set_query_int,
            str: self.set_query_str,
            list[str]: self.set_query_list_str,
            list[int]: self.set_query_list_int,
            dict[str, Any]: self.set_query_dict,
        }
        for attr, t in self.__annotations__.items():
            types_mapping[t](qs, attr)

    def set_query_int(self, qs: QueryParams, name: str) -> None:
        value = int(v) if (v := qs.get(name)) else None
        setattr(self, name, value)

    def set_query_str(self, qs: QueryParams, name: str) -> None:
        setattr(self, name, qs.get(name))

    def set_query_list_str(self, qs: QueryParams, name: str) -> None:
        setattr(self, name, qs.getlist(name + '[]'))

    def set_query_list_int(self, qs: QueryParams, name: str) -> None:
        setattr(self, name, [int(x) for x in qs.getlist(name + '[]')])

    def set_query_dict(self, qs: QueryParams, name: str) -> None:
        data = {}
        if len(d := qs.getlist(name)) == 1:
            d = json.loads(d[0])
            for key, value in d.items():
                data[self.camel_to_snake(key)] = value
        setattr(self, name, data)


class StudentsParams(QueryModel):
    q: str
    order: list[str]
    filters: dict[str, Any]
    page: int
    limit: int

    def __init__(self, qs: QueryParams):
        super(StudentsParams, self).__init__(qs)
        self.q = self.q or ''
        self.order = [self.camel_to_snake(x) for x in self.order]
        self.page = self.page or 1
        self.limit = self.limit or 50


def get_query_pars(request: Request):
    qs = request.query_params
    return StudentsParams(qs)
