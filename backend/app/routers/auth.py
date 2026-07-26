from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.services.mongo_service import create_user, get_user_by_email
from app.services.auth_service import hash_password, verify_password, create_access_token

router = APIRouter()


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
def register(request: RegisterRequest):
    if get_user_by_email(request.email):
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    hashed = hash_password(request.password)
    user_id = create_user(request.email, hashed, request.name)
    token = create_access_token(user_id)

    return {"token": token, "user": {"id": user_id, "email": request.email, "name": request.name}}


@router.post("/login")
def login(request: LoginRequest):
    user = get_user_by_email(request.email)
    if not user or not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token(str(user["_id"]))
    return {"token": token, "user": {"id": str(user["_id"]), "email": user["email"], "name": user["name"]}}