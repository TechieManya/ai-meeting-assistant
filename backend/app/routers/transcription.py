from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.deepgram_service import get_transcript

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):

    allowed_types = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Upload an mp3 or wav."
        )

    
    audio_bytes = await file.read()

   
   
    result = get_transcript(audio_bytes, file.content_type)

    return result