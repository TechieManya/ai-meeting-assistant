import { useState } from "react";
import { transcribeAudio } from "../services/api";

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
          padding: "10px 16px",
          borderRadius: "8px",
          border: "1px solid #2a2a3e",
          backgroundColor: "#13131f",
          color: "#a8a8c0",
          fontSize: "13px",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}>
          {file ? file.name : "Choose File"}
          <input
            type="file"
            accept=".mp3,.wav"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: !file || loading
              ? "#2a2a3e"
              : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: !file || loading ? "#6b6b8a" : "#fff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: !file || loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Transcribe"}
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

      {transcript && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
          {transcript.map((segment, i) => (
            <div key={i} style={{
              padding: "14px 16px",
              borderRadius: "10px",
              backgroundColor: "#13131f",
              border: "1px solid #1e1e2e",
              borderLeft: "3px solid #8b5cf6",
            }}>
              <div style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#8b5cf6",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>{segment.speaker}</div>
              <div style={{
                fontSize: "14px",
                color: "#c8c8e0",
                lineHeight: "1.6",
              }}>{segment.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AudioUploader;