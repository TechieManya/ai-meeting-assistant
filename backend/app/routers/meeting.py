from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel
from typing import Optional, List
import httpx
import json
from datetime import datetime, timezone

from app.services.meeting_baas_service import send_bot, get_bot_data
from app.services.deepgram_service import get_transcript
from app.services.groq_service import generate_summary
from app.services.email_service import send_meeting_summary_email
from app.services.mongo_service import (
    save_transcript,
    get_transcript_by_bot_id,
    get_all_meetings,
    create_pending_meeting,
    get_meeting_owner,
    get_user_by_id,
    save_summary,
)
from app.services.auth_service import get_current_user
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

        # --- Auto-generate summary + send email notification ---
        try:
            owner_id = get_meeting_owner(payload.data.bot_id)
            user = get_user_by_id(owner_id) if owner_id else None

            if user and user.get("email"):
                summary = generate_summary(transcript_data["transcript"])
                save_summary(payload.data.bot_id, summary)
                print(f"=== SUMMARY AUTO-GENERATED: {payload.data.bot_id} ===")

                meeting_title = f"Meeting · {payload.data.bot_id[:8].upper()}"
                meeting_date = datetime.now(timezone.utc).strftime("%d %b %Y, %I:%M %p UTC")

                send_meeting_summary_email(
                    to_email=user["email"],
                    meeting_title=meeting_title,
                    meeting_date=meeting_date,
                    participants=participants_list,
                    summary=summary,
                )
            else:
                print(f"=== NO OWNER/EMAIL FOUND FOR {payload.data.bot_id}, SKIPPING EMAIL ===")

        except Exception as e:
            print(f"=== SUMMARY/EMAIL STEP FAILED (transcript already saved safely): {e} ===")
        # --- END BLOCK ---

    except Exception as e:
        print(f"=== PROCESSING FAILED: {str(e)} ===")


# --- Endpoints ---

@router.post("/join")
def join_meeting(request: JoinMeetingRequest, current_user: dict = Depends(get_current_user)):
    callback_url = f"{NGROK_URL}/api/v1/meeting/callback"
    try:
        result = send_bot(
            meeting_url=request.meeting_url,
            callback_url=callback_url
        )
        bot_id = result["bot_id"]

        create_pending_meeting(
            bot_id=bot_id,
            user_id=str(current_user["_id"]),
            meeting_url=request.meeting_url,
        )

        return {
            "message": "Bot is joining the meeting",
            "bot_id": bot_id
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
def fetch_transcript(bot_id: str, current_user: dict = Depends(get_current_user)):
    owner_id = get_meeting_owner(bot_id)
    if owner_id and owner_id != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="This meeting doesn't belong to you")

    result = get_transcript_by_bot_id(bot_id)

    if not result or not result.get("transcript"):
        return {"status": "pending"}

    return {
        "status": "completed",
        "bot_id": result["bot_id"],
        "participants": result.get("participants", []),
        "audio_url": result.get("audio_url"),
        "transcript": result["transcript"]
    }


@router.get("/all")
def get_all_meetings_list(current_user: dict = Depends(get_current_user)):
    meetings = get_all_meetings(user_id=str(current_user["_id"]))
    return {"meetings": meetings}


@router.get("/audio/{bot_id}")
def fetch_fresh_audio(bot_id: str, current_user: dict = Depends(get_current_user)):
    owner_id = get_meeting_owner(bot_id)
    if owner_id and owner_id != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="This meeting doesn't belong to you")

    try:
        data = get_bot_data(bot_id)
        return {"audio_url": data.get("audio")}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Could not fetch audio: {str(e)}")


@router.post("/{bot_id}/send-report")
def send_meeting_report(bot_id: str, current_user: dict = Depends(get_current_user)):
    """
    Manually re-sends the meeting summary email to the currently logged-in user.
    Used by the "Send Report" button in the summary panel.
    """
    owner_id = get_meeting_owner(bot_id)
    if owner_id and owner_id != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="This meeting doesn't belong to you")

    meeting = get_transcript_by_bot_id(bot_id)
    if not meeting or not meeting.get("summary"):
        raise HTTPException(status_code=400, detail="No summary available yet for this meeting")

    if not current_user.get("email"):
        raise HTTPException(status_code=400, detail="No email on file for your account")

    meeting_title = f"Meeting · {bot_id[:8].upper()}"
    created_at = meeting.get("created_at")
    meeting_date = created_at.strftime("%d %b %Y, %I:%M %p UTC") if created_at else "Date unavailable"

    result = send_meeting_summary_email(
        to_email=current_user["email"],
        meeting_title=meeting_title,
        meeting_date=meeting_date,
        participants=meeting.get("participants", []),
        summary=meeting["summary"],
    )

    if result is None:
        raise HTTPException(status_code=502, detail="Failed to send email — check server logs")

    return {"status": "sent", "sent_to": current_user["email"]}