from pymongo import MongoClient
from app.config import MONGODB_URL

# Create one MongoDB connection
client = MongoClient(MONGODB_URL)

# Database
db = client["meeting_assistant"]

# Collection
transcripts_collection = db["transcripts"]


def save_transcript(bot_id: str, transcript: list, participants: list, audio_url: str = None):
    """
    Save transcript in MongoDB.
    """

    transcripts_collection.update_one(
        {"bot_id": bot_id},
        {
            "$set": {
                "bot_id": bot_id,
                "transcript": transcript,
                "participants": participants,
                "audio_url": audio_url,
                "status": "completed"
            }
        },
        upsert=True
    )


def get_transcript_by_bot_id(bot_id: str):
    """
    Fetch transcript by bot_id.
    """

    document = transcripts_collection.find_one(
        {"bot_id": bot_id},
        {"_id": 0}
    )

    return document

def save_summary(bot_id: str, summary: dict):
    """
    Saves AI-generated summary to existing meeting document.
    """
    transcripts_collection.update_one(
        {"bot_id": bot_id},
        {"$set": {"summary": summary}}
    )