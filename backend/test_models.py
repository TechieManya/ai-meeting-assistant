from google import genai
from app.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

for model in client.models.list():
    print(model.name)

try:
    response = client.models.generate_content(
        model="gemini-2.5-flash",  
        contents="Hello! Confirming connection."
    )
    print("\n✅ Success! Gemini Response:", response.text)
    
except Exception as e:
    print("\n❌ Generation Failed:", str(e))
