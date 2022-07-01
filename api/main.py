from fastapi import FastAPI

import settings
from core.db.connection import connect_database
from routers import include_all_routers


app = FastAPI(debug=settings.DEBUG)
include_all_routers(app)


@app.on_event('startup')
def start():
    connect_database(app)
