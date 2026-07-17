from openai import OpenAI
from app.config import GROQ_API_KEY

# OpenAI SDK pointed at Groq's API
client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)


def format_transcript_for_prompt(transcript: list) -> str:
    lines = []
    for segment in transcript:
        speaker = segment.get("speaker", "Unknown")
        text = segment.get("text", "")
        lines.append(f"{speaker}: {text}")
    return "\n".join(lines)


def generate_summary(transcript: list) -> dict:
    """
    Sends transcript to Groq LLM and returns structured summary.
    """
    transcript_text = format_transcript_for_prompt(transcript)

    prompt = f"""You are an AI meeting assistant. Analyze the following meeting transcript and provide a structured summary.

TRANSCRIPT:
{transcript_text}

Please provide:
1. SUMMARY: A 2-3 sentence overview of what the meeting was about.
2. KEY POINTS: 3-5 bullet points of the most important topics discussed.
3. ACTION ITEMS: Any tasks, follow-ups, or decisions mentioned. If none, write "No action items identified."

Format your response exactly like this:
SUMMARY:
[your summary here]

KEY POINTS:
- [point 1]
- [point 2]
- [point 3]

ACTION ITEMS:
- [action item 1]
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful AI meeting assistant that creates concise, accurate meeting summaries."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,  
        max_tokens=1024
    )

    raw_text = response.choices[0].message.content
    return parse_summary_response(raw_text)


def parse_summary_response(text: str) -> dict:
    """
    Parses LLM text response into structured sections.
    """
    result = {
        "summary": "",
        "key_points": [],
        "action_items": []
    }

    current_section = None
    lines = text.strip().split("\n")

    for line in lines:
        line = line.strip()
        if not line:
            continue

        if line.startswith("SUMMARY:"):
            current_section = "summary"
            inline = line.replace("SUMMARY:", "").strip()
            if inline:
                result["summary"] = inline
        elif line.startswith("KEY POINTS:"):
            current_section = "key_points"
        elif line.startswith("ACTION ITEMS:"):
            current_section = "action_items"
        elif current_section == "summary" and not result["summary"]:
            result["summary"] = line
        elif current_section == "key_points" and line.startswith("-"):
            result["key_points"].append(line[1:].strip())
        elif current_section == "action_items" and line.startswith("-"):
            result["action_items"].append(line[1:].strip())

    return result