# AI Meeting Assistant

An AI-powered meeting assistant that automatically joins meetings, records audio, transcribes speech with speaker identification, generates AI summaries, and displays everything in a React dashboard.

## Live Demo Flow
1. User pastes a Google Meet link
2. Meeting BaaS bot joins and records the meeting
3. Meeting ends → callback hits FastAPI backend
4. Audio sent to Deepgram for transcription + speaker diarization
5. Transcript saved to MongoDB
6. Groq LLM generates meeting summary
7. React displays transcript + summary + audio player with sync

## Tech Stack

### Frontend
- React + Vite
- Axios

### Backend
- FastAPI (Python)
- uvicorn

### AI & APIs
- Deepgram (Speech-to-Text + Speaker Diarization)
- Meeting BaaS (Meeting Bot)
- Groq / LLaMA 3.1 (AI Summarization)

### Database
- MongoDB Atlas

### Infrastructure
- ngrok (local development tunneling)

## Development Progress

### ✅ Phase 1 — Meeting Bot Integration
- Meeting BaaS bot joins Google Meet automatically
- Records full meeting audio
- Sends callback to FastAPI when meeting ends
- ngrok tunnel for local development

### ✅ Phase 2 — Speech-to-Text + Diarization
- Deepgram nova-2 model for transcription
- Speaker diarization with real participant names
- Timestamps on every transcript segment
- Audio player with transcript sync (YouTube-style)
- Sentence breaks for readability
- Manual audio file upload also supported
- Transcript + audio URL stored in MongoDB

### ✅ Phase 3 — AI Summarization
- Groq API with LLaMA 3.1 8B model
- Generates: Overview, Key Points, Action Items
- Summary stored in MongoDB alongside transcript
- On-demand generation with "Generate Summary" button

### 🚧 Phase 4 — Dashboard UI (In Progress)
- Meeting history sidebar
- Professional SaaS-style layout
- Improved audio player

### ⬜ Phase 5 — Action Items & Email Reports
### ⬜ Phase 6 — Full Dashboard

## Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Copy `.env.example` to `.env` and fill in:  DEEPGRAM_API_KEY=
MEETING_BAAS_API_KEY=
NGROK_URL=
MONGODB_URL=
GROQ_API_KEY=
