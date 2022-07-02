from .users import users_router
from .students import students_router
from .teachers import teachers_router


users_router.include_router(students_router, prefix='/students', tags=['students'])
users_router.include_router(teachers_router, prefix='/teachers', tags=['teachers'])

