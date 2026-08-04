
# Conferio — AI Meeting Assistant

> Your Pensieve for Meetings

An AI-powered meeting assistant that automatically joins Google Meet calls, records audio, transcribes speech with speaker identification, generates AI summaries, and displays everything in a professional React dashboard.

🌐 **Live App:** [conferio.vercel.app](https://conferio.vercel.app)
📡 **API:** [conferio-backend-s38i.onrender.com](https://conferio-backend-s38i.onrender.com)
📖 **API Docs:** [conferio-backend-s38i.onrender.com/docs](https://conferio-backend-s38i.onrender.com/docs)

## How It Works


User pastes Google Meet link
        ↓
Meeting BaaS bot joins and records the meeting
        ↓
Meeting ends → callback hits FastAPI backend
        ↓
Audio downloaded and sent to Deepgram (STT + diarization)
        ↓
Transcript saved to MongoDB with speaker names + timestamps
        ↓
Groq LLM generates meeting summary
        ↓
React dashboard displays transcript + summary + synced audio player


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, deployed on Vercel |
| Backend | FastAPI (Python) + uvicorn, deployed on Render |
| Database | MongoDB Atlas |
| Meeting Bot | Meeting BaaS |
| Speech-to-Text | Deepgram (nova-2 model) |
| AI Summarization | Groq API — LLaMA 3.1 8B |
| Auth | JWT + bcrypt (passlib) |


## Features

### ✅ Phase 1 — Meeting Bot Integration
- Meeting BaaS bot joins Google Meet automatically
- Records full meeting audio
- Sends callback to FastAPI when meeting ends

### ✅ Phase 2 — Speech-to-Text + Diarization
- Deepgram nova-2 for transcription
- Speaker diarization with real participant names (not Speaker 0/1)
- Timestamps on every transcript segment
- Audio player with YouTube-style transcript sync
- Sentence breaks for readability
- Manual audio file upload also supported

### ✅ Phase 3 — AI Summarization
- Groq API with LLaMA 3.1 8B
- Generates: Executive Summary, Key Points, Action Items
- Summary stored in MongoDB alongside transcript
- On-demand generation with Regenerate button

### ✅ Phase 4 — Dashboard + Auth
- Full authentication (signup, login, JWT sessions)
- Per-user meeting isolation (each user sees only their meetings)
- Meeting history sidebar (ChatGPT/WhatsApp style)
- Professional SaaS UI — Slate + Indigo theme
- Chat-bubble transcript with live playback sync
- Collapsible sidebar
- Audio player with fresh signed URL on every open

### ✅ Phase 5 — Deployment
- Backend deployed on Render (persistent process for background tasks)
- Frontend deployed on Vercel (auto-detected Vite, global CDN)
- Automatic CI/CD — push to GitHub → both platforms redeploy automatically
- All secrets managed via environment variables, nothing in source control

###  ✅ Phase 6 — Action Items & Email Reports (upcoming)
### ⬜ Phase 7 — Advanced Dashboard (upcoming)




## Local Development Setup

### Prerequisites
- Python 3.11.9
- Node.js 18+
- MongoDB Atlas account
- API keys for: Deepgram, Meeting BaaS, Groq

### Backend

bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload


### Frontend

bash
cd frontend
npm install
npm run dev


### Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

DEEPGRAM_API_KEY=
MEETING_BAAS_API_KEY=
MONGODB_URL=
GROQ_API_KEY=
JWT_SECRET_KEY=
NGROK_URL=        # your ngrok public URL for local dev


## Deployment

| Platform | Service | URL |
|---|---|---|
| Vercel | Frontend | conferio.vercel.app |
| Render | Backend | conferio-backend-s38i.onrender.com |
| MongoDB Atlas | Database | cloud-hosted |

Both platforms are connected to this GitHub repo. Every push to `main` triggers an automatic redeploy on both Vercel and Render — no manual steps needed.

## Mentor
**Miles** — Senior Engineer

Developed as part of a B.Tech AI-ML summer internship project (3rd year, Northcap University).
