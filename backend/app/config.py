from dotenv import load_dotenv
import os

load_dotenv()  # Reads .env file and puts values into os.environ

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
MEETING_BAAS_API_KEY = os.getenv("MEETING_BAAS_API_KEY")
NGROK_URL = os.getenv("NGROK_URL")
MONGODB_URL = os.getenv("MONGODB_URL")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-change-this-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

