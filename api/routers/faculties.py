from fastapi import APIRouter, Depends

from auth.config import TokenUser
from schemas import Faculty, faculties
from dependencies import auth as auth_deps

faculties_router = APIRouter()


@faculties_router.get('/', response_model=list[Faculty])
async def get_all(user: TokenUser = Depends(auth_deps.get_auth)):
    return list(faculties.values())
