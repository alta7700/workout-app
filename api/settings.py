from environs import Env


env = Env()
env.read_env('local.env')

DEBUG = env.bool("DEBUG")

REDIS_CONNECTION = {
    'host': env('REDIS_HOST'),
    'port': env('REDIS_PORT'),
    'db': env.int('REDIS_DB'),
    'password': env('REDIS_PASSWORD') or ''
}

SECRET = env("SECRET")

TORTOISE_ORM = {
    'connections': {"default": env('DEFAULT_DATABASE_CONNECTION_URL')},
    'apps': {
        'models': {
            'models': [
                'aerich.models',
                'models'
            ]
        }
    }
}


class UserSettings:
    MAX_FIRST_NAME_LEN = 50
    MAX_LAST_NAME_LEN = 50
    MAX_FATHERS_NAME_LEN = 50
    MAX_USERNAME_NAME_LEN = 50


class SubjectSettings:
    MAX_TITLE_LEN = 200
    MAX_SHORT_TITLE_LEN = 30
