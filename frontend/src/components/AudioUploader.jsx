import { useState } from "react";
import { transcribeAudio } from "../services/api";
import theme from "../theme";

function AudioUploader() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setTranscript(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await transcribeAudio(file);
      setTranscript(data.transcript);
    } catch (err) {
      setError("Something went wrong. Check if your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <label style={{
          padding: "10px 16px", borderRadius: "8px", border: `1px solid ${theme.border}`,
          backgroundColor: theme.surface, color: theme.textSecondary,
          fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap",
        }}>
          {file ? file.name : "Choose File"}
          <input type="file" accept=".mp3,.wav" onChange={handleFileChange} style={{ display: "none" }} />
        </label>
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            padding: "10px 20px", borderRadius: "8px", border: "none",
            background: !file || loading ? theme.surfaceHover : `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})`,
            color: !file || loading ? theme.textSecondary : "#fff",
            fontSize: "14px", fontWeight: "600",
            cursor: !file || loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Transcribe"}
        </button>
      </div>

      {error && (
        <div style={{ padding: "10px 14px", borderRadius: "8px", backgroundColor: theme.errorSoft, border: `1px solid ${theme.errorBorder}`, color: theme.errorText, fontSize: "13px" }}>
          {error}
        </div>
      )}

      {transcript && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
          {transcript.map((segment, i) => (
            <div key={i} style={{
              padding: "14px 16px", borderRadius: "10px",
              backgroundColor: theme.surface, border: `1px solid ${theme.border}`,
              borderLeft: `3px solid ${theme.accent}`,
            }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: theme.accent, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {segment.speaker}
              </div>
              <div style={{ fontSize: "14px", color: theme.textPrimary, lineHeight: "1.6" }}>
                {segment.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AudioUploader;