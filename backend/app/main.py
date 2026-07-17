from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import transcription , meeting , summary

app = FastAPI(
    title="AI Meeting Assistant",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transcription.router, prefix="/api/v1", tags=["Transcription"])
app.include_router(meeting.router, prefix="/api/v1/meeting", tags=["Meeting"])
app.include_router(summary.router, prefix="/api/v1/summary", tags=["Summary"])


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Meeting Assistant API is running"}