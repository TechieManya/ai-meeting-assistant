import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

function AudioPlayerPanel({ audioUrl, onTimeUpdate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <div
        style={{
          fontSize: "11px",
          fontWeight: "700",
          color: "#94a3b8",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Recording
      </div>

      <div className="custom-audio-player">
        <AudioPlayer
          src={audioUrl}
          showJumpControls={false}
          customAdditionalControls={[]}
          layout="horizontal-reverse"
          customProgressBarSection={[
            RHAP_UI.CURRENT_TIME,
            RHAP_UI.PROGRESS_BAR,
            RHAP_UI.DURATION,
          ]}
          customControlsSection={[
            RHAP_UI.MAIN_CONTROLS,
            RHAP_UI.VOLUME_CONTROLS,
          ]}
          onListen={(e) => onTimeUpdate?.(e.target.currentTime)}
        />
      </div>

      <style>{`
  .custom-audio-player .rhap_container {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 12px 18px;
    box-shadow: 0 2px 10px rgba(15,23,42,0.05);
  }

  .custom-audio-player .rhap_main {
    gap: 10px;
  }

  .custom-audio-player .rhap_main-controls-button {
    color: #4f46e5;
    width: 42px;
    height: 42px;
  }

  .custom-audio-player .rhap_main-controls-button:hover {
    color: #4338ca;
  }

  .custom-audio-player .rhap_progress-container {
    margin: 0 12px;
  }

  .custom-audio-player .rhap_progress-bar {
    height: 6px;
    background: #e2e8f0;
    border-radius: 999px;
  }

  .custom-audio-player .rhap_progress-filled {
    background: #4f46e5;
    border-radius: 999px;
  }

  .custom-audio-player .rhap_progress-indicator {
    width: 14px;
    height: 14px;
    top: -4px;
    background: #4f46e5;
    box-shadow: 0 0 0 4px rgba(79,70,229,0.15);
  }

  .custom-audio-player .rhap_volume-bar {
    background: #e2e8f0;
    height: 5px;
  }

  .custom-audio-player .rhap_volume-indicator {
    width: 12px;
    height: 12px;
    background: #4f46e5;
  }

  .custom-audio-player .rhap_volume-button {
    color: #64748b;
  }

  .custom-audio-player .rhap_time {
    color: #64748b;
    font-size: 12px;
    font-family: monospace;
  }

  .custom-audio-player .rhap_download-progress {
    background: #cbd5e1;
  }

  .custom-audio-player .rhap_repeat-button {
    display: none;
  }
`}</style>
    </div>
  );
}

export default AudioPlayerPanel;

