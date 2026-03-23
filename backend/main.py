from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os
from dotenv import load_dotenv

# 🔐 Load API Key from .env
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("❌ GEMINI_API_KEY not found in .env file")

# 🤖 Configure Gemini
genai.configure(api_key=API_KEY)

# ✅ Use Gemini 1.5 Flash (fast + free)
model = genai.GenerativeModel("gemini-1.5-flash")

# 🚀 FastAPI app
app = FastAPI()

# 🌐 CORS (Frontend connect ke liye)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📦 Request model
class ChatRequest(BaseModel):
    message: str

# 🏠 Home route
@app.get("/")
def home():
    return {"message": "Gemini Backend Running 🚀"}

# 💬 Chat route (MAIN AI LOGIC)
@app.post("/chat")
def chat(req: ChatRequest):
    user_message = req.message
    print("🔥 User:", user_message)

    try:
        # 🤖 AI Response
        response = model.generate_content(user_message)

        # Safety check
        if response and response.text:
            reply = response.text
        else:
            reply = "⚠️ Koi response nahi mila AI se"

    except Exception as e:
        reply = f"❌ Error aaya: {str(e)}"

    return {"reply": reply}