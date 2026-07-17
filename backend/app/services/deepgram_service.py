from deepgram import DeepgramClient
from app.config import DEEPGRAM_API_KEY


def get_transcript(
    audio_bytes: bytes,
    mimetype: str,
    participants: list = [],
    diarization: list = []
) -> dict:

    client = DeepgramClient(api_key=DEEPGRAM_API_KEY)

    payload = {
        "buffer": audio_bytes,
        "mimetype": mimetype,
    }

    options = {
        "diarize": True,
        "punctuate": True,
        "language" : "multi",
        "model": "nova-3",
        "smart_format": True,
    }

    response = client.listen.prerecorded.v("1").transcribe_file(payload, options)
    return parse_transcript(response, participants, diarization)


def match_speaker_name(
    segment_start: float,
    diarization: list,
    fallback: str
) -> str:
    if not diarization:
        return fallback

    BUFFER = 1.0

    candidates = [
        entry for entry in diarization
        if (entry.get("start_time", 0) - BUFFER) <= segment_start <= (entry.get("end_time", 0) + BUFFER)
    ]

    if candidates:
        best = max(candidates, key=lambda e: e.get("start_time", 0))
        return best.get("speaker", fallback)

    # No real match even with buffer — don't force a wrong guess
    return fallback


def parse_transcript(
    response,
    participants: list = [],
    diarization: list = []
) -> dict:

    words = (
        response.results
        .channels[0]
        .alternatives[0]
        .words
    )

    real_participants = [
        p for p in participants
        if p != "AI Meeting Assistant"
    ]

    SENTENCE_ENDINGS = {'.', '?', '!'}

    segments = []
    current_speaker = None
    current_text = []
    current_start = None
    current_end = None

    for word in words:
        speaker = word.speaker
        word_text = word.word

        if speaker != current_speaker:
            if current_speaker is not None and current_text:
                fallback = (
                    real_participants[current_speaker]
                    if current_speaker < len(real_participants)
                    else f"Speaker {current_speaker}"
                )
                speaker_name = match_speaker_name(current_start, diarization, fallback)
                segments.append({
                    "speaker": speaker_name,
                    "text": " ".join(current_text),
                    "start": current_start,
                    "end": current_end
                })

            current_speaker = speaker
            current_text = [word_text]
            current_start = round(word.start, 2)
            current_end = round(word.end, 2)

        else:
            current_text.append(word_text)
            current_end = round(word.end, 2)

            if (word_text and word_text[-1] in SENTENCE_ENDINGS
                    and len(current_text) >= 6):
                fallback = (
                    real_participants[current_speaker]
                    if current_speaker < len(real_participants)
                    else f"Speaker {current_speaker}"
                )
                speaker_name = match_speaker_name(current_start, diarization, fallback)
                segments.append({
                    "speaker": speaker_name,
                    "text": " ".join(current_text),
                    "start": current_start,
                    "end": current_end
                })
                current_text = []
                current_start = None
                current_end = None

    if current_text and current_speaker is not None:
        fallback = (
            real_participants[current_speaker]
            if current_speaker < len(real_participants)
            else f"Speaker {current_speaker}"
        )
        speaker_name = match_speaker_name(current_start, diarization, fallback)
        segments.append({
            "speaker": speaker_name,
            "text": " ".join(current_text),
            "start": current_start,
            "end": current_end
        })

    return {"transcript": segments}