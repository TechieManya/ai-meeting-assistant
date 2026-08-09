from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.services.mongo_service import (
    create_user, get_user_by_email,
    set_reset_token, get_user_by_reset_token, update_password,
)
from app.services.auth_service import hash_password, verify_password, create_access_token, generate_reset_token
from app.services.email_service import send_password_reset_email
from app.config import FRONTEND_URL

router = APIRouter()


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


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


@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest):
    user = get_user_by_email(request.email)

    if user:
        token = generate_reset_token()
        expires_at = datetime.now(timezone.utc) + timedelta(hours=1)

        set_reset_token(request.email, token, expires_at)

        reset_link = f"{FRONTEND_URL}/reset-password/{token}"

        email_result = send_password_reset_email(
            request.email,
            reset_link
        )

        if not email_result:
            raise HTTPException(
                status_code=500,
                detail="Failed to send password reset email"
            )

    return {
        "message": "If an account exists with that email, a reset link has been sent."
    }


@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest):
    user = get_user_by_reset_token(request.token)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")

    expires_at = user.get("reset_token_expires")
    if expires_at and expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="This reset link has expired")

    hashed = hash_password(request.new_password)
    update_password(str(user["_id"]), hashed)
    return {"message": "Password updated successfully"}