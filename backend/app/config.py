from dotenv import load_dotenv
import os

load_dotenv()  # Reads .env file and puts values into os.environ

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")