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
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
            border: "1px solid #2a2a3e",
            backgroundColor: "#13131f",
            color: "#e8e8f0",
            fontSize: "14px",
            outline: "none",
          }}
        />
        <button
          onClick={handleJoin}
          disabled={!meetingUrl.trim() || loading}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: loading || !meetingUrl.trim()
              ? "#2a2a3e"
              : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: loading || !meetingUrl.trim() ? "#6b6b8a" : "#fff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: loading || !meetingUrl.trim() ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            transition: "opacity 0.2s",
          }}
        >
          {loading ? "Sending..." : "Send Bot"}
        </button>
      </div>

      {error && (
        <div style={{
          padding: "10px 14px",
          borderRadius: "8px",
          backgroundColor: "#1f0f0f",
          border: "1px solid #3f1f1f",
          color: "#f87171",
          fontSize: "13px",
        }}>{error}</div>
      )}

      {botId && (
        <div style={{
          padding: "10px 14px",
          borderRadius: "8px",
          backgroundColor: "#0f1a0f",
          border: "1px solid #1a3a1a",
          color: "#4ade80",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <span>✅</span>
          <span>Bot is joining your meeting</span>
          <span style={{ color: "#6b6b8a", marginLeft: "auto", fontFamily: "monospace", fontSize: "11px" }}>
            {botId.slice(0, 8)}...
          </span>
        </div>
      )}
    </div>
  );
}

export default MeetingJoinForm;