from tortoise import Tortoise
from .users import User, StudentTeachers
from .subejcts import Subject, TeacherSubject
from .workouts import WorkOut


Tortoise.init_models([__name__], 'models')
