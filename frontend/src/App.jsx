import { useState, useEffect } from "react";
import AudioUploader from "./components/AudioUploader";
import MeetingJoinForm from "./components/MeetingJoinForm";
import TranscriptViewer from "./components/TranscriptViewer";

function App() {
  const [botId, setBotId] = useState(() => {
    return localStorage.getItem("active_bot_id") || null;
  });

  const handleBotJoined = (id) => {
    localStorage.setItem("active_bot_id", id);
    setBotId(id);
  };

  const handleClear = () => {
    localStorage.removeItem("active_bot_id");
    setBotId(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0a0f",
      color: "#e8e8f0",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1e1e2e",
        padding: "20px 40px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: "#0d0d14",
      }}>
        <div style={{
          width: "32px",
          height: "32px",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
        }}>🤖</div>
        <div>
          <div style={{ fontWeight: "700", fontSize: "16px" }}>
            AI Meeting Assistant
          </div>
          <div style={{ fontSize: "12px", color: "#6b6b8a" }}>
            Powered by Deepgram + Meeting BaaS
          </div>
        </div>
        {/* Clear button — useful for starting a new meeting */}
        {botId && (
          <button
            onClick={handleClear}
            style={{
              marginLeft: "auto",
              padding: "6px 14px",
              borderRadius: "6px",
              border: "1px solid #2a2a3e",
              backgroundColor: "transparent",
              color: "#6b6b8a",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            New Meeting
          </button>
        )}
      </div>

      {/* Main content */}
      <div style={{
        maxWidth: "780px",
        margin: "0 auto",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}>
        <Section
          label="LIVE MEETING"
          title="Send Bot to Meeting"
          description="Paste a Google Meet link. The bot joins, records, and transcribes automatically."
        >
          <MeetingJoinForm onBotJoined={handleBotJoined} />
          {botId && <TranscriptViewer botId={botId} />}
        </Section>

        <Section
          label="AUDIO FILE"
          title="Upload & Transcribe"
          description="Upload an existing MP3 or WAV file to generate a transcript."
        >
          <AudioUploader />
        </Section>
      </div>
    </div>
  );
}

function Section({ label, title, description, children }) {
  return (
    <div style={{
      backgroundColor: "#0f0f1a",
      border: "1px solid #1e1e2e",
      borderRadius: "16px",
      padding: "28px",
    }}>
      <div style={{
        fontSize: "11px",
        fontWeight: "600",
        letterSpacing: "1.5px",
        color: "#6366f1",
        marginBottom: "8px",
        textTransform: "uppercase",
      }}>{label}</div>
      <div style={{
        fontSize: "20px",
        fontWeight: "700",
        letterSpacing: "-0.4px",
        marginBottom: "6px",
      }}>{title}</div>
      <div style={{
        fontSize: "13px",
        color: "#6b6b8a",
        marginBottom: "24px",
        lineHeight: "1.5",
      }}>{description}</div>
      {children}
    </div>
  );
}

export default App;