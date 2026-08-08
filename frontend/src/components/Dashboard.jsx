import { useState, useEffect } from "react";
import MeetingHeader from "./MeetingHeader";
import SummaryPanel from "./SummaryPanel";
import TranscriptPanel from "./TranscriptPanel";
import AudioPlayerPanel from "./AudioPlayerPanel";
import { getTranscriptStatus, generateSummary, getSummary, getFreshAudioUrl } from "../services/api";
import { useTheme } from "../ThemeContext";

function WelcomeScreen({ userName }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      padding: "40px",
      backgroundColor: "#f8fafc",
    }}>
      <div style={{ fontSize: "32px", marginBottom: "16px" }}>🤖</div>
      <h2 style={{
        fontSize: "24px",
        fontWeight: "700",
        color: "#0f172a",
        margin: "0 0 8px",
        textAlign: "center",
      }}>
        Ready for your next meeting?
      </h2>
      <p style={{
        fontSize: "14px",
        color: "#64748b",
        textAlign: "center",
        maxWidth: "380px",
        lineHeight: "1.7",
        margin: "0 0 40px",
      }}>
        Select a meeting from the sidebar to view its transcript and summary,
        or start a new meeting to begin recording.
      </p>

      <div style={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: "48px",
      }}>
        {[
          { icon: "🎙️", label: "Auto Recording", desc: "Bot joins and records" },
          { icon: "📝", label: "AI Transcript", desc: "Speaker-identified text" },
          { icon: "✨", label: "Smart Summary", desc: "Key points & action items" },
        ].map((feature) => (
          <div key={feature.label} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            padding: "20px 24px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            minWidth: "140px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              width: "44px", height: "44px",
              borderRadius: "12px",
              backgroundColor: "#eeeffd",
              display: "flex", alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}>{feature.icon}</div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "13px", fontWeight: "600",
                color: "#0f172a", marginBottom: "2px",
              }}>{feature.label}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                {feature.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

function Dashboard({ mode, selectedMeeting, activeBotId, onTranscriptReady, userName }) {
  const { theme } = useTheme();

  const [transcript, setTranscript] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [status, setStatus] = useState("pending");
  const [currentBotId, setCurrentBotId] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (mode === "history" && selectedMeeting) {
      setTranscript(selectedMeeting.transcript || []);
      setParticipants(selectedMeeting.participants || []);
      setSummary(selectedMeeting.summary || null);
      setCurrentBotId(selectedMeeting.bot_id);
      setStatus("completed");
      setCurrentTime(0);

      let cancelled = false;
      let currentBlobUrl = null;

      getFreshAudioUrl(selectedMeeting.bot_id)
        .then((data) => {
          if (cancelled) return;
          currentBlobUrl = data.audio_url;
          setAudioUrl(data.audio_url);
        })
        .catch((err) => {
          if (cancelled) return;
          console.error("Audio refresh failed:", err);
          setAudioUrl(null);
        });

      return () => {
        cancelled = true;
        if (currentBlobUrl && currentBlobUrl.startsWith("blob:")) {
          URL.revokeObjectURL(currentBlobUrl);
        }
      };
    }
  }, [selectedMeeting, mode]);

  useEffect(() => {
    if (mode !== "live" || !activeBotId) return;

    setStatus("pending");
    setTranscript([]);
    setSummary(null);
    setCurrentBotId(activeBotId);
    setCurrentTime(0);

    const interval = setInterval(async () => {
      try {
        const data = await getTranscriptStatus(activeBotId);
        if (data.status === "completed") {
          setTranscript(data.transcript || []);
          setParticipants(data.participants || []);
          setAudioUrl(data.audio_url || null);
          setStatus("completed");
          clearInterval(interval);
          onTranscriptReady?.();

          try {
            const existing = await getSummary(activeBotId);
            if (existing.status === "completed") setSummary(existing.summary);
          } catch {}
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeBotId, mode]);

  const handleGenerateSummary = async () => {
    if (!currentBotId) return;
    setSummaryLoading(true);
    try {
      const data = await generateSummary(currentBotId);
      setSummary(data.summary);
    } catch (err) {
      console.error("Summary error:", err);
    } finally {
      setSummaryLoading(false);
    }
  };

  if (!selectedMeeting && !activeBotId) {
    return <WelcomeScreen userName={userName} />;
  }

  if (status === "pending") {
    return (
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        height: "100%", gap: "16px",
        backgroundColor: "#f8fafc",
      }}>
        
        <div style={{
          width: "10px", height: "10px",
          borderRadius: "50%",
          backgroundColor: "#4f46e5",
          animation: "pulse 1.5s infinite",
        }} />
        <div style={{ fontSize: "14px", color: "#64748b" }}>
          Waiting for meeting to end and transcript to process...
        </div>
        <div style={{ fontSize: "12px", color: "#94a3b8" }}>
          This usually takes 1–3 minutes after the meeting ends.
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: "100%",
      overflow: "hidden",
      boxSizing: "border-box",
      backgroundColor: "#f8fafc",
    }}>
      <div style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
        <MeetingHeader meeting={selectedMeeting} />
      </div>

      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 440px",
        overflow: "hidden",
      }}>
        <div
          className="custom-scrollbar"
          style={{
            overflowY: "auto",
            padding: "24px 28px",
            borderRight: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            boxSizing: "border-box",
          }}
        >
          <SummaryPanel
            summary={summary}
            summaryLoading={summaryLoading}
            onGenerate={handleGenerateSummary}
            botId={currentBotId}
          />
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}>
          <div
            className="custom-scrollbar"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px 24px",
              boxSizing: "border-box",
            }}
          >
            <TranscriptPanel
              transcript={transcript}
              participants={participants}
              currentTime={currentTime}
            />
          </div>

          {audioUrl && (
            <div style={{
              flexShrink: 0,
              borderTop: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              padding: "16px 20px",
              boxSizing: "border-box",
            }}>
              <AudioPlayerPanel 
                audioUrl={audioUrl}
                onTimeUpdate={setCurrentTime}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;