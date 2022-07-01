from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise

import settings


def connect_database(app: FastAPI):
    register_tortoise(
        app=app,
        config=settings.TORTOISE_ORM
    )

