from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from groq import Groq
from . import models, database, schemas, crud, email_utils
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "http://localhost:5173",  # Vite or React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)
FRONTEND_BASE_URL = "http://localhost:5173"

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

API_KEY = "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"
client = Groq(api_key=API_KEY)

def clean_reply(text: str) -> str:
    cleaned_text = ' '.join(text.replace('\n', ' ').split())
    return cleaned_text

@app.post("/users/", response_model=schemas.UserOut)
def create_new_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.user_name)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists.")
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already exists.")
    return crud.create_user(db, user)

@app.post("/signin/")
def sign_in(user: schemas.UserSignIn, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.user_name)
    if not db_user or not crud.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid username or password.")
    # Send sign-in notification
    email_utils.send_email(
        to_email=db_user.email,
        subject="Sign-In Notification",
        body=f"Dear {db_user.user_name},\n\nYou have successfully signed in to Luna Chatbot at {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC.\n\nIf this was not you, please secure your account immediately.\n\nBest regards,\nLuna Team"
    )
    return {"message": "Sign in successful"}

@app.post("/change-password/")
def change_password(data: schemas.ChangePassword, db: Session = Depends(get_db)):
    success = crud.change_password(db, data.user_name, data.old_password, data.new_password)
    if not success:
        raise HTTPException(status_code=400, detail="Old password is incorrect or user not found.")
    return {"message": "Password changed successfully"}

@app.post("/update-profile/", response_model=schemas.UserOut)
def update_profile(profile: schemas.UpdateProfile, db: Session = Depends(get_db)):
    updated_user = crud.update_profile(db, profile.user_name, profile)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found.")
    return updated_user

@app.post("/update-username/", response_model=schemas.UserOut)
def update_username(data: schemas.UpdateUsername, db: Session = Depends(get_db)):
    result = crud.update_username(db, data.current_user_name, data.new_user_name, data.password)
    if result is None:
        raise HTTPException(status_code=400, detail="Invalid username or password.")
    if result is False:
        raise HTTPException(status_code=400, detail="New username already exists.")
    return result

@app.post("/password-reset-request/")
def request_password_reset(data: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, data.email)
    if not user:
        raise HTTPException(status_code=404, detail="Email not found.")
    
    token = crud.create_password_reset_token(db, user.id)
    reset_link = f"{FRONTEND_BASE_URL}/reset-password?token={token}"

    email_utils.send_email(
        to_email=user.email,
        subject="Password Reset Request",
        body=(
            f"Dear {user.user_name},\n\n"
            f"You requested a password reset. Click the link below to reset your password:\n"
            f"{reset_link}\n\n"
            "This link is valid for 1 hour.\n\nBest regards,\nLuna Team"
        )
    )
    return {"message": "Password reset link sent to your email."}



@app.post("/password-reset/")
def reset_password(data: schemas.PasswordReset, db: Session = Depends(get_db)):
    success = crud.reset_password(db, data.token, data.new_password)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid or expired token.")
    return {"message": "Password reset successfully."}

@app.post("/chat/")
def chat_with_groq(chat_request: schemas.ChatRequest, db: Session = Depends(get_db)):
    user_input = chat_request.message.lower().strip()
    conversation = []

    # Handle specific queries locally
    if user_input in ["what is your name", "what's your name", "who are you"]:
        luna_reply = "My name is Luna"
    elif user_input in ["when was your birthday", "your date of birth", "your dob"]:
        luna_reply = "18th June 2025"
    else:
        # Fetch recent chat history from DB and clean it
        chats = db.query(models.ChatHistory).order_by(models.ChatHistory.timestamp.desc()).limit(20).all()
        for chat in reversed(chats):
            role = chat.role.lower()
            if role not in {"user", "assistant"}:
                if role == "luna":
                    role = "assistant"
                else:
                    continue  # skip invalid role
            conversation.append({"role": role, "content": chat.content})

        # Add current user input
        conversation.append({"role": "user", "content": chat_request.message})

        # Call Groq API
        try:
            response = client.chat.completions.create(
                model="gemma2-9b-it",
                messages=conversation,
                max_tokens=1024,
                temperature=0.7,
            )
            reply = response.choices[0].message.content
            cleaned_reply = clean_reply(reply)
            luna_reply = {"message": cleaned_reply}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Groq API failed: {str(e)}")

    # Store both user and bot messages in DB
    user_chat = models.ChatHistory(role="user", content=chat_request.message)
    db.add(user_chat)

    bot_chat = models.ChatHistory(role="Luna", content=luna_reply if isinstance(luna_reply, str) else luna_reply["message"])
    db.add(bot_chat)

    db.commit()

    return {"Bot": luna_reply}
