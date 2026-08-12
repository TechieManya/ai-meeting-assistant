import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import AuthScreen from "../components/AuthScreen";
import MeetingHeader from "../components/MeetingHeader";
import SummaryPanel from "../components/SummaryPanel";
import TranscriptPanel from "../components/TranscriptPanel";
import AudioPlayerPanel from "../components/AudioPlayerPanel";
import { getTranscriptStatus, generateSummary, getFreshAudioUrl } from "../services/api";
import theme from "../theme";

function MeetingPage() {
  const { meetingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getTranscriptStatus(meetingId)
      .then((data) => {
        if (data.status !== "completed") {
          setError("This meeting isn't ready yet.");
        } else {
          setMeeting(data);
          if (data.summary) {
            setSummary(data.summary);
          } else {
            setSummaryLoading(true);
            generateSummary(meetingId)
              .then((result) => setSummary(result.summary))
              .catch(() => {})
              .finally(() => setSummaryLoading(false));
          }
        }
      })
      .catch(() => setError("Couldn't load this meeting. It may not exist or you may not have access."))
      .finally(() => setLoading(false));

    getFreshAudioUrl(meetingId)
      .then((data) => setAudioUrl(data.audio_url))
      .catch(() => setAudioUrl(null));
  }, [meetingId, user]);

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    try {
      const data = await generateSummary(meetingId);
      setSummary(data.summary);
    } finally {
      setSummaryLoading(false);
    }
  };

  if (!user) return <AuthScreen />;

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: theme.textSecondary }}>
        Loading meeting...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
        <div style={{ fontSize: "15px", color: theme.textPrimary, fontWeight: 600 }}>{error}</div>
        <button onClick={() => navigate("/app")} style={{
          padding: "8px 16px", borderRadius: "8px", border: `1px solid ${theme.border}`,
          backgroundColor: theme.surface, cursor: "pointer", fontSize: "13px",
        }}>
          Go to your dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: theme.bg }}>
      <MeetingHeader meeting={meeting} />
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: "0 0 60%", overflow: "auto", padding: "24px", borderRight: `1px solid ${theme.border}` }}>
          <SummaryPanel summary={summary} summaryLoading={summaryLoading} onGenerate={handleGenerateSummary} botId={meetingId} />
        </div>
        <div style={{ flex: "0 0 40%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
            <TranscriptPanel transcript={meeting.transcript} participants={meeting.participants} currentTime={currentTime} />
          </div>
          {audioUrl && (
            <div style={{ borderTop: `1px solid ${theme.border}`, backgroundColor: theme.surface }}>
              <AudioPlayerPanel audioUrl={audioUrl} onTimeUpdate={setCurrentTime} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MeetingPage;