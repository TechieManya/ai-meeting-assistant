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
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
EMAIL_FROM = os.getenv("EMAIL_FROM", "Conferio <onboarding@resend.dev>")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://conferio.vercel.app")


EMAILJS_SERVICE_ID = os.getenv("EMAILJS_SERVICE_ID")
EMAILJS_TEMPLATE_ID = os.getenv("EMAILJS_TEMPLATE_ID")
EMAILJS_PUBLIC_KEY = os.getenv("EMAILJS_PUBLIC_KEY")
EMAILJS_PRIVATE_KEY = os.getenv("EMAILJS_PRIVATE_KEY")

