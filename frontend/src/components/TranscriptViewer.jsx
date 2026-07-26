import { useState, useEffect, useRef } from "react";
import { getTranscriptStatus, generateSummary, getSummary } from "../services/api";

function TranscriptViewer({ botId }) {
  const [status, setStatus] = useState("pending");
  const [transcript, setTranscript] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const segmentRefs = useRef([]);

  useEffect(() => {
    if (!botId) return;

   
    checkTranscript();

    intervalRef.current = setInterval(checkTranscript, 5000);
    return () => clearInterval(intervalRef.current);
  }, [botId]);

  const checkTranscript = async () => {
    try {
      const data = await getTranscriptStatus(botId);
      if (data.status === "completed") {
        setTranscript(data.transcript || []);
        setParticipants(data.participants || []);
        setAudioUrl(data.audio_url || null);
        setStatus("completed");
        clearInterval(intervalRef.current);

      
        try {
          const existingSummary = await getSummary(botId);
          if (existingSummary.status === "completed") {
            setSummary(existingSummary.summary);
          }
        } catch (err) {
         
        }
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  };

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const data = await generateSummary(botId);
      setSummary(data.summary);
    } catch (err) {
      setSummaryError("Failed to generate summary. Try again.");
      console.error("Summary error:", err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const currentTime = audioRef.current.currentTime;
    const index = transcript.findIndex(
      (seg) =>
        seg.start !== null &&
        seg.end !== null &&
        currentTime >= seg.start &&
        currentTime <= seg.end
    );
    if (index !== -1 && index !== activeIndex) {
      setActiveIndex(index);
      segmentRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  if (status === "pending") {
    return (
      <div style={{
        marginTop: "20px",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#13131f",
        border: "1px solid #1e1e2e",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <div style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#6366f1",
          animation: "pulse 1.5s infinite",
        }} />
        <span style={{ fontSize: "14px", color: "#6b6b8a" }}>
          Waiting for meeting to end and transcript to process...
        </span>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Participants */}
      {participants.length > 0 && (
        <div>
          <div style={{
            fontSize: "11px", fontWeight: "600", letterSpacing: "1px",
            color: "#6b6b8a", textTransform: "uppercase", marginBottom: "8px",
          }}>Participants</div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {participants.map((name, i) => (
              <span key={i} style={{
                padding: "4px 12px", borderRadius: "20px",
                backgroundColor: "#1a1a2e", border: "1px solid #2a2a4e",
                fontSize: "13px", color: "#a5b4fc",
              }}>{name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Audio Player */}
      {audioUrl && (
        <div>
          <div style={{
            fontSize: "11px", fontWeight: "600", letterSpacing: "1px",
            color: "#6b6b8a", textTransform: "uppercase", marginBottom: "8px",
          }}>Recording</div>
          <audio
            ref={audioRef}
            controls
            onTimeUpdate={handleTimeUpdate}
            style={{ width: "100%", borderRadius: "8px" }}
          >
            <source src={audioUrl} type="audio/mpeg" />
          </audio>
        </div>
      )}

      {/* AI Summary Section */}
      <div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}>
          <div style={{
            fontSize: "11px", fontWeight: "600", letterSpacing: "1px",
            color: "#6b6b8a", textTransform: "uppercase",
          }}>AI Summary</div>

          {/* Always show button — Generate if no summary, Regenerate if exists */}
          <button
            onClick={handleGenerateSummary}
            disabled={summaryLoading}
            style={{
              padding: "6px 16px",
              borderRadius: "6px",
              border: "none",
              background: summaryLoading
                ? "#2a2a3e"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: summaryLoading ? "#6b6b8a" : "#fff",
              fontSize: "12px",
              fontWeight: "600",
              cursor: summaryLoading ? "not-allowed" : "pointer",
            }}
          >
            {summaryLoading
              ? "Generating..."
              : summary
              ? "🔄 Regenerate"
              : "✨ Generate Summary"}
          </button>
        </div>

        {summaryError && (
          <p style={{ color: "#f87171", fontSize: "13px" }}>{summaryError}</p>
        )}

        {summary && (
          <div style={{
            backgroundColor: "#0f0f1a",
            border: "1px solid #2a2a4e",
            borderRadius: "10px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}>
            {/* Overview */}
            <div>
              <div style={{
                fontSize: "11px", fontWeight: "700",
                color: "#6366f1", marginBottom: "6px",
              }}>OVERVIEW</div>
              <p style={{
                fontSize: "14px", color: "#c8c8e0",
                lineHeight: "1.6", margin: 0,
              }}>{summary.summary}</p>
            </div>

            {/* Key Points */}
            {summary.key_points?.length > 0 && (
              <div>
                <div style={{
                  fontSize: "11px", fontWeight: "700",
                  color: "#6366f1", marginBottom: "6px",
                }}>KEY POINTS</div>
                <ul style={{ margin: 0, paddingLeft: "16px" }}>
                  {summary.key_points.map((point, i) => (
                    <li key={i} style={{
                      fontSize: "14px", color: "#c8c8e0", lineHeight: "1.8",
                    }}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Items */}
            {summary.action_items?.length > 0 && (
              <div>
                <div style={{
                  fontSize: "11px", fontWeight: "700",
                  color: "#8b5cf6", marginBottom: "6px",
                }}>ACTION ITEMS</div>
                <ul style={{ margin: 0, paddingLeft: "16px" }}>
                  {summary.action_items.map((item, i) => (
                    <li key={i} style={{
                      fontSize: "14px", color: "#c8c8e0", lineHeight: "1.8",
                    }}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transcript */}
      {transcript.length > 0 && (
        <div>
          <div style={{
            fontSize: "11px", fontWeight: "600", letterSpacing: "1px",
            color: "#6b6b8a", textTransform: "uppercase", marginBottom: "8px",
          }}>Transcript</div>
          <div style={{
            display: "flex", flexDirection: "column", gap: "8px",
            maxHeight: "400px", overflowY: "auto", paddingRight: "4px",
          }}>
            {transcript.map((segment, i) => (
              <div
                key={i}
                ref={(el) => (segmentRefs.current[i] = el)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  backgroundColor: i === activeIndex ? "#1a1a3e" : "#13131f",
                  border: `1px solid ${i === activeIndex ? "#6366f1" : "#1e1e2e"}`,
                  borderLeft: `3px solid ${i === activeIndex ? "#6366f1" : "#2a2a4e"}`,
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: "6px",
                }}>
                  <div style={{
                    fontSize: "11px", fontWeight: "700",
                    color: i === activeIndex ? "#a5b4fc" : "#8b5cf6",
                    textTransform: "uppercase", letterSpacing: "0.5px",
                  }}>{segment.speaker}</div>
                  {segment.start !== null && segment.start !== undefined && (
                    <div style={{
                      fontSize: "11px", color: "#6b6b8a", fontFamily: "monospace",
                    }}>{formatTime(segment.start)}</div>
                  )}
                </div>
                <div style={{
                  fontSize: "14px",
                  color: i === activeIndex ? "#e8e8f0" : "#c8c8e0",
                  lineHeight: "1.6",
                }}>{segment.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(seconds) {
  if (seconds === null || seconds === undefined) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default TranscriptViewer;
