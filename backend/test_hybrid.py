import json
from unittest.mock import MagicMock

# Dynamically import the code you just saved in Step 2
from app.services.deepgram_service import parse_transcript

# Define a tiny helper class to simulate how Deepgram packages words
class MockWord:
    def __init__(self, word, start, end, speaker):
        self.word = word
        self.start = start
        self.end = end
        self.speaker = speaker

# FAKE DEEPGRAM DATA: 
# Every single word is speaker 0! (Miles' exact failure problem)
mock_words_from_deepgram = [
    # Manya speaks here from 0.5s to 2.2s
    MockWord("hello", start=0.5, end=0.8, speaker=0),
    MockWord("how", start=0.9, end=1.2, speaker=0),
    MockWord("are", start=1.3, end=1.6, speaker=0),
    MockWord("you.", start=1.7, end=2.2, speaker=0), 
    
    # Meenu speaks here from 5.5s to 7.2s
    MockWord("i", start=5.5, end=5.8, speaker=0),
    MockWord("am", start=5.9, end=6.2, speaker=0),
    MockWord("doing", start=6.3, end=6.6, speaker=0),
    MockWord("good.", start=6.7, end=7.2, speaker=0)  
]

# Set up the internal data structure your function expects to unpack
mock_response = MagicMock()
mock_response.results.channels = [MagicMock()]
mock_response.results.channels[0].alternatives = [MagicMock()]
mock_response.results.channels[0].alternatives[0].words = mock_words_from_deepgram

# FAKE MEETING BAAS METADATA TIMELINE
# The network data tells us who was actually unmuted on the platform
mock_meeting_baas_diarization = [
    {"start": 0.0, "end": 4.0, "speaker": "Manya"},
    {"start": 5.0, "end": 10.0, "speaker": "Meenu"}
]

participants_list = ["Manya", "Meenu"]

if __name__ == "__main__":
    print("--- RUNNING LOCAL TEST: DEEPGRAM RETURNED 1 OBJECT ---")
    
    # Run the raw logic locally
    output = parse_transcript(
        response=mock_response, 
        participants=participants_list, 
        diarization=mock_meeting_baas_diarization
    )
    
    # Output the result beautifully to the terminal window
    print(json.dumps(output, indent=2))
