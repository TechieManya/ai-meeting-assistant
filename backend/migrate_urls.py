from app.services.mongo_service import transcripts_collection
from app.services.meeting_baas_service import get_bot_data

old_meetings = list(transcripts_collection.find({"meeting_url": {"$exists": False}}))
print(f"Found {len(old_meetings)} meetings missing a meeting_url")

updated = 0
failed = []

for doc in old_meetings:
    bot_id = doc["bot_id"]
    try:
        bot_data = get_bot_data(bot_id)
        meeting_url = bot_data.get("meeting_url")

        if meeting_url:
            transcripts_collection.update_one(
                {"_id": doc["_id"]},
                {"$set": {"meeting_url": meeting_url}}
            )
            print(f"Updated {bot_id} -> {meeting_url}")
            updated += 1
        else:
            print(f"No meeting_url for {bot_id}")
            failed.append(bot_id)

    except Exception as e:
        print(f"Failed for {bot_id}: {e}")
        failed.append(bot_id)

print()
print(f"Successfully updated {updated} meetings")
print(f"Failed: {len(failed)}")
print(failed)