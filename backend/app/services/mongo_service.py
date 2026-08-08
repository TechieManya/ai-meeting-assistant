from pymongo import MongoClient
from datetime import datetime, timezone
from bson import ObjectId
from gridfs import GridFS
from app.config import MONGODB_URL

client = MongoClient(MONGODB_URL)
db = client["meeting_assistant"]

transcripts_collection = db["transcripts"]
users_collection = db["users"]
audio_fs = GridFS(db, collection="audio_files")


# --- Users ---

def create_user(email: str, hashed_password: str, name: str):
    result = users_collection.insert_one({
        "email": email.lower().strip(),
        "hashed_password": hashed_password,
        "name": name,
        "created_at": datetime.now(timezone.utc),
    })
    return str(result.inserted_id)


def get_user_by_email(email: str):
    return users_collection.find_one({"email": email.lower().strip()})


def get_user_by_id(user_id: str):
    try:
        return users_collection.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return None


# --- Meetings ---

def create_pending_meeting(bot_id: str, user_id: str, meeting_url: str = None):
    """
    Called the moment a bot is sent to a meeting, so ownership and the
    original Google Meet URL exist before the Meeting BaaS callback arrives later.
    """
    transcripts_collection.update_one(
        {"bot_id": bot_id},
        {
            "$set": {
                "bot_id": bot_id,
                "user_id": user_id,
                "meeting_url": meeting_url,
                "status": "pending",
            },
            "$setOnInsert": {
                "created_at": datetime.now(timezone.utc),
                "transcript": [],
                "participants": [],
            },
        },
        upsert=True,
    )


def save_transcript(bot_id: str, transcript: list, participants: list, audio_url: str = None):
    transcripts_collection.update_one(
        {"bot_id": bot_id},
        {
            "$set": {
                "bot_id": bot_id,
                "transcript": transcript,
                "participants": participants,
                "audio_url": audio_url,
                "status": "completed",
            },
            "$setOnInsert": {
                "created_at": datetime.now(timezone.utc),
            },
        },
        upsert=True,
    )


def get_transcript_by_bot_id(bot_id: str):
    return transcripts_collection.find_one({"bot_id": bot_id}, {"_id": 0})


def get_meeting_owner(bot_id: str):
    doc = transcripts_collection.find_one({"bot_id": bot_id}, {"user_id": 1})
    return doc.get("user_id") if doc else None


def save_summary(bot_id: str, summary: dict):
    transcripts_collection.update_one(
        {"bot_id": bot_id},
        {"$set": {"summary": summary}}
    )


def get_all_meetings(user_id: str):
    documents = list(transcripts_collection.find(
        {"user_id": user_id},
        {
            "bot_id": 1,
            "meeting_url": 1,
            "participants": 1,
            "status": 1,
            "created_at": 1,
            "audio_url": 1,
            "transcript": 1,
            "summary": 1,
        }
    ).sort("_id", -1))

    for doc in documents:
        doc["_id"] = str(doc["_id"])

    return documents


# --- Permanent audio storage (GridFS) ---

def save_audio_file(bot_id: str, audio_bytes: bytes):
    """
    Permanently stores the meeting's audio in MongoDB itself,
    so playback no longer depends on Meeting BaaS's retention window.
    """
    existing = audio_fs.find({"filename": bot_id})
    for f in existing:
        audio_fs.delete(f._id)
    audio_fs.put(audio_bytes, filename=bot_id, content_type="audio/mpeg")


def get_audio_file(bot_id: str):
    """
    Returns the permanently-stored audio bytes for a meeting, or None
    if this meeting was processed before this fix existed.
    """
    file = audio_fs.find_one({"filename": bot_id})
    return file.read() if file else None