from pathlib import Path

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles

import settings
from core.db.connection import connect_database
from routers import include_all_routers


app = FastAPI(debug=settings.DEBUG)
include_all_routers(app)

if settings.DEBUG:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=['*'],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    @app.get('/', response_class=FileResponse)
    async def get_html():
        return FileResponse(Path(__file__).parent.parent / 'reactapp' / 'build' / 'index.html')

    app.mount("/static", StaticFiles(directory=Path(__file__).parent.parent / 'reactapp' / 'build' / 'static'), name="static")


@app.on_event('startup')
def start():
    connect_database(app)
