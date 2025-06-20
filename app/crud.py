from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
from datetime import datetime, timedelta
import uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(db: Session, user_name: str):
    return db.query(models.User).filter(models.User.user_name == user_name).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(user_name=user.user_name, hashed_password=hashed_password, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def change_password(db: Session, user_name: str, old_password: str, new_password: str):
    user = get_user_by_username(db, user_name)
    if not user or not verify_password(old_password, user.hashed_password):
        return False
    user.hashed_password = pwd_context.hash(new_password)
    db.commit()
    return True

def update_profile(db: Session, user_name: str, profile_data: schemas.UpdateProfile):
    user = get_user_by_username(db, user_name)
    if not user:
        return None
    if profile_data.name is not None:
        user.name = profile_data.name
    if profile_data.age is not None:
        user.age = profile_data.age
    if profile_data.designation is not None:
        user.designation = profile_data.designation
    if profile_data.email:
        user.email=profile_data.email
    db.commit()
    db.refresh(user)
    return user

def update_username(db: Session, current_user_name: str, new_user_name: str, password: str):
    user = get_user_by_username(db, current_user_name)
    if not user or not verify_password(password, user.hashed_password):
        return None
    if get_user_by_username(db, new_user_name):
        return False  # Username already exists
    user.user_name = new_user_name
    db.commit()
    db.refresh(user)
    return user

def create_password_reset_token(db: Session, user_id: int):
    token = str(uuid.uuid4())
    expires_at = datetime.utcnow() + timedelta(hours=1)  # Token valid for 1 hour
    db_token = models.PasswordResetToken(user_id=user_id, token=token, expires_at=expires_at)
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return token

def get_password_reset_token(db: Session, token: str):
    return db.query(models.PasswordResetToken).filter(
        models.PasswordResetToken.token == token,
        models.PasswordResetToken.is_used == False,
        models.PasswordResetToken.expires_at > datetime.utcnow()
    ).first()

def reset_password(db: Session, token: str, new_password: str):
    token_obj = get_password_reset_token(db, token)
    if not token_obj:
        return False
    user = db.query(models.User).filter(models.User.id == token_obj.user_id).first()
    if not user:
        return False
    user.hashed_password = pwd_context.hash(new_password)
    token_obj.is_used = True
    db.commit()
    return True