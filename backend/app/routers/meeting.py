from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List
import httpx
import json

from app.services.meeting_baas_service import send_bot
from app.services.deepgram_service import get_transcript
from app.services.mongo_service import save_transcript, get_transcript_by_bot_id
from app.config import NGROK_URL

router = APIRouter()


# --- Models ---

class JoinMeetingRequest(BaseModel):
    meeting_url: str

class Participant(BaseModel):
    name: Optional[str] = None

class CallbackData(BaseModel):
    bot_id: str
    audio: Optional[str] = None
    diarization: Optional[str] = None
    participants: Optional[List[Participant]] = []

class CallbackPayload(BaseModel):
    event: str
    data: CallbackData


# --- Background task ---

def process_meeting(payload: CallbackPayload):
    audio_url = payload.data.audio
    diarization_url = payload.data.diarization

    if not audio_url:
        print("=== NO AUDIO URL IN CALLBACK ===")
        return

    try:
        print(f"=== DOWNLOADING AUDIO: {payload.data.bot_id} ===")
        audio_response = httpx.get(audio_url, timeout=120)
        audio_response.raise_for_status()
        audio_bytes = audio_response.content

        diarization_data = []
        if diarization_url:
            print("=== DOWNLOADING DIARIZATION ===")
            diar_response = httpx.get(diarization_url, timeout=30)
            diar_response.raise_for_status()
            lines = diar_response.text.strip().split("\n")
            diarization_data = [json.loads(line) for line in lines if line.strip()]
            print(f"=== DIARIZATION ENTRIES: {len(diarization_data)} ===")
           

        participants_list = [
            p.name for p in payload.data.participants
            if p.name and p.name != "AI Meeting Assistant"
        ]

        print("=== SENDING TO DEEPGRAM ===")
        transcript_data = get_transcript(
            audio_bytes,
            "audio/mpeg",
            participants_list,
            diarization_data
        )

        save_transcript(
            bot_id=payload.data.bot_id,
            transcript=transcript_data["transcript"],
            participants=participants_list,
            audio_url=audio_url
        )
        print(f"=== TRANSCRIPT SAVED: {payload.data.bot_id} ===")

    except Exception as e:
        print(f"=== PROCESSING FAILED: {str(e)} ===")


# --- Endpoints ---

@router.post("/join")
def join_meeting(request: JoinMeetingRequest):
    callback_url = f"{NGROK_URL}/api/v1/meeting/callback"
    try:
        result = send_bot(
            meeting_url=request.meeting_url,
            callback_url=callback_url
        )
        return {
            "message": "Bot is joining the meeting",
            "bot_id": result["bot_id"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send bot: {str(e)}"
        )


@router.post("/callback")
def meeting_callback(payload: CallbackPayload, background_tasks: BackgroundTasks):
    if payload.event != "bot.completed":
        return {"message": f"Event '{payload.event}' received, no action needed"}

    background_tasks.add_task(process_meeting, payload)
    return {"status": "received"}


@router.get("/transcript/{bot_id}")
def fetch_transcript(bot_id: str):
    result = get_transcript_by_bot_id(bot_id)

    if not result:
        return {"status": "pending"}

    return {
        "status": "completed",
        "bot_id": result["bot_id"],
        "participants": result.get("participants", []),
        "audio_url": result.get("audio_url"),
        "transcript": result["transcript"]
    }