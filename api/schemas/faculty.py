from schemas.base import CamelModel


class Faculty(CamelModel):
    id: int
    title: str
    short_title: str
    max_course: int


LECH = Faculty(id=1, title='Лечебный', short_title='ЛЕЧ', max_course=6)
MPF = Faculty(id=2, title='Медико-профилактический', short_title='МПФ', max_course=6)
PED = Faculty(id=3, title='Педиатрический', short_title='ПЕД', max_course=6)
STOM = Faculty(id=4, title='Стоматологический', short_title='СТОМ', max_course=5)
FARM = Faculty(id=5, title='Фармакологический', short_title='ФАРМ', max_course=5)

faculties: dict[int, Faculty] = {x.id: x for x in (LECH, MPF, PED, STOM, FARM)}

