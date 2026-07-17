from fastapi import APIRouter, HTTPException
from app.services.groq_service import generate_summary
from app.services.mongo_service import get_transcript_by_bot_id, save_summary

router = APIRouter()


@router.post("/{bot_id}")
def summarize_meeting(bot_id: str):
    """
    Generates an AI summary for a completed meeting transcript.
    Fetches transcript from MongoDB, sends to Groq, saves and returns summary.
    """
    

    meeting = get_transcript_by_bot_id(bot_id)
    
    if not meeting:
        raise HTTPException(
            status_code=404,
            detail=f"No transcript found for bot_id: {bot_id}"
        )
    
    transcript = meeting.get("transcript", [])
    
    if not transcript:
        raise HTTPException(
            status_code=400,
            detail="Transcript is empty, cannot generate summary"
        )
    
   
    try:
        summary = generate_summary(transcript)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Groq API error: {str(e)}"
        )
    

    save_summary(bot_id, summary)
    
 
    return {
        "bot_id": bot_id,
        "summary": summary
    }


@router.get("/{bot_id}")
def get_meeting_summary(bot_id: str):
    """
    Fetches existing summary for a meeting.
    React calls this to check if summary already exists.
    """
    meeting = get_transcript_by_bot_id(bot_id)
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    summary = meeting.get("summary")
    
    if not summary:
        return {"status": "not_generated"}
    
    return {
        "status": "completed",
        "bot_id": bot_id,
        "summary": summary
    }
