import { useState } from "react";
import { joinMeeting } from "../services/api";

function MeetingJoinForm({ onBotJoined }) {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [botId, setBotId] = useState(null);
  const [error, setError] = useState(null);

  const handleJoin = async () => {
    if (!meetingUrl.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await joinMeeting(meetingUrl);
      setBotId(data.bot_id);
      onBotJoined(data.bot_id);
    } catch (err) {
      setError("Failed to send bot. Check your backend and ngrok.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        padding: "32px",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#0f172a",
            marginBottom: "6px",
          }}
        >
          Start New Meeting
        </div>
        <div style={{ fontSize: "13px", color: "#475569" }}>
          Paste your Google Meet link below. The bot will join and record automatically.
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="https://meet.google.com/xxx-xxxx-xxx"
          value={meetingUrl}
          onChange={(e) => setMeetingUrl(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "14px",
            outline: "none",
            color: "#0f172a",
            backgroundColor: "#f8fafc",
          }}
        />
        <button
          onClick={handleJoin}
          disabled={!meetingUrl.trim() || loading}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: !meetingUrl.trim() || loading ? "#e2e8f0" : "#6366f1",
            color: !meetingUrl.trim() || loading ? "#94a3b8" : "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: !meetingUrl.trim() || loading ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.15s ease",
          }}
        >
          {loading ? "Sending..." : "Send Bot"}
        </button>
      </div>

      {error && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px 14px",
            borderRadius: "8px",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#dc2626",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {botId && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px 14px",
            borderRadius: "8px",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "#059669",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>✅</span>
          <span>Bot is joining your meeting. Transcript will appear when the meeting ends.</span>
        </div>
      )}
    </div>
  );
}

export default MeetingJoinForm;