import httpx
from app.config import MEETING_BAAS_API_KEY

# Meeting BaaS v2 base URL
MEETING_BAAS_URL = "https://api.meetingbaas.com/v2"


def send_bot(meeting_url: str, callback_url: str) -> dict:
    """
    Sends a Meeting BaaS bot to the given meeting URL.
    Returns the bot_id assigned by Meeting BaaS.
    """

    headers = {
        "Content-Type": "application/json",
        "x-meeting-baas-api-key": MEETING_BAAS_API_KEY
    }

    payload = {
        "meeting_url": meeting_url,
        "bot_name": "AI Meeting Assistant",
        "recording_mode": "audio_only",     
        "callback_enabled": True,
        "callback_config": {
            "url": callback_url,           
            "method": "POST"
        }
    }

    with httpx.Client() as client:
        response = client.post(
            f"{MEETING_BAAS_URL}/bots",
            json=payload,
            headers=headers
        )

    response.raise_for_status()
    data = response.json()
    return data["data"]