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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <h1>AI Meeting Assistant</h1>
      <p>Upload an audio file to generate a transcript with speaker labels.</p>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="file"
          accept=".mp3,.wav"
          onChange={handleFileChange}
        />
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          style={{ marginLeft: "10px" }}
        >
          {loading ? "Processing..." : "Upload & Transcribe"}
        </button>
      </div>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {transcript && (
        <div>
          <h2>Transcript</h2>
          {transcript.map((segment, index) => (
            <div
              key={index}
              style={{
                marginBottom: "16px",
                padding: "12px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <strong>{segment.speaker}</strong>
              <p style={{ margin: "4px 0 0 0" }}>{segment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AudioUploader;