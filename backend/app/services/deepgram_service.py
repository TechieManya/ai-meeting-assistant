from deepgram import DeepgramClient
from app.config import DEEPGRAM_API_KEY


def get_transcript(audio_bytes: bytes, mimetype: str) -> dict:
    client = DeepgramClient(DEEPGRAM_API_KEY)

    payload = {
        "buffer": audio_bytes,
        "mimetype": mimetype,
    }

    options = {
        "diarize": True,
        "punctuate": True,
        "language": "en",
    }

    response = client.listen.prerecorded.v("1").transcribe_file(payload, options)

    return parse_transcript(response)


def parse_transcript(response) -> dict:
    words = (
        response.results
        .channels[0]
        .alternatives[0]
        .words
    )

    segments = []
    current_speaker = None
    current_text = []

    for word in words:
        speaker = word.speaker

        if speaker != current_speaker:
            if current_speaker is not None:
                segments.append({
                    "speaker": f"Speaker {current_speaker}",
                    "text": " ".join(current_text)
                })
            current_speaker = speaker
            current_text = [word.word]
        else:
            current_text.append(word.word)

    if current_text:
        segments.append({
            "speaker": f"Speaker {current_speaker}",
            "text": " ".join(current_text)
        })

    return {"transcript": segments}