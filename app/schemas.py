from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    user_name: str
    password: str
    email: EmailStr  # Added email field

class UserOut(BaseModel):
    id: int
    user_name: str
    email: EmailStr

    class Config:
        from_attributes = True

class ChatHistoryOut(BaseModel):
    id: int
    role: str
    content: str

    class Config:
        from_attributes = True

class UserSignIn(BaseModel):
    user_name: str
    password: str

class ChangePassword(BaseModel):
    user_name: str
    old_password: str
    new_password: str

class UpdateProfile(BaseModel):
    user_name: str
    name: Optional[str] = None
    age: Optional[int] = None
    designation: Optional[str] = None

class UpdateUsername(BaseModel):
    current_user_name: str
    new_user_name: str
    password: str  # Require password for security

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordReset(BaseModel):
    token: str
    new_password: str