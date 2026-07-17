from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

# Simulate a transcript
test_transcript = [
    {"speaker": "Manya", "text": "Hello, today we are testing the AI meeting assistant."},
    {"speaker": "Rhythmic Tushar", "text": "Yes, the project looks great. When will Phase 3 be ready?"},
    {"speaker": "Manya", "text": "Phase 3 summarization is what we are building right now."},
]

transcript_text = "\n".join([f"{s['speaker']}: {s['text']}" for s in test_transcript])

response = client.chat.completions.create(
    model="llama-3.1-8b-instant",
    messages=[
        {"role": "system", "content": "You are a helpful AI meeting assistant."},
        {"role": "user", "content": f"""Summarize this meeting transcript.

TRANSCRIPT:
{transcript_text}

Format exactly like this:
SUMMARY:
[2-3 sentence overview]

KEY POINTS:
- [point 1]
- [point 2]

ACTION ITEMS:
- [action item or No action items identified]
"""}
    ],
    temperature=0.3,
    max_tokens=512
)

print(response.choices[0].message.content)