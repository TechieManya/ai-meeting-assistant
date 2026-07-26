import { useState, useRef, useEffect } from "react";
import { Mic, Search } from "lucide-react";

const AVATAR_PALETTE = ["#4f46e5", "#0d9488", "#7c3aed", "#0284c7", "#4338ca"];

function getSpeakerColor(speaker, participants) {
  const idx = participants.indexOf(speaker);
  return AVATAR_PALETTE[idx % AVATAR_PALETTE.length] || "#4f46e5";
}

function getInitials(name) {
  return name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";
}

function TranscriptPanel({
  transcript = [],
  participants = [],
  currentTime = 0,
}) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [search, setSearch] = useState("");
  const segmentRefs = useRef([]);

  function formatTime(seconds) {
    if (seconds === null || seconds === undefined) return "";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    if (!transcript.length) return;

    let newIndex = -1;

    for (let i = 0; i < transcript.length; i++) {
      const start = transcript[i].start ?? 0;
      const end = transcript[i + 1]?.start ?? Infinity;

      if (currentTime >= start && currentTime < end) {
        newIndex = i;
        break;
      }
    }

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      segmentRefs.current[newIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentTime, transcript]);

  
  const highlightText = (text) => {
  if (!search.trim()) return text;

  const regex = new RegExp(`(${search})`, "gi");

  return text.split(regex).map((part, index) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <mark
        key={index}
        style={{
          backgroundColor: "#fef08a",
          color: "#111827",
          padding: "1px 2px",
          borderRadius: "3px",
          fontWeight: 600,
        }}
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
};

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            fontWeight: 600,
            color: "#475569",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <Mic size={12} strokeWidth={2.5} />
          Transcript
        </div>

        <div
          style={{
            position: "relative",
            width: "200px",
          }}
        >
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transcript..."
            style={{
              width: "100%",
              padding: "8px 12px 8px 34px",
              borderRadius: "999px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
              outline: "none",
              background: "#fff",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Participants */}
      {participants.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
          }}
        >
          {participants.map((name, i) => {
            const color = getSpeakerColor(name, participants);

            return (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  backgroundColor: color + "14",
                  fontSize: "11px",
                  color,
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: color,
                  }}
                />

                {name}
              </span>
            );
          })}
        </div>
      )}

      {/* Transcript */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {transcript.length === 0 ? (
          <div
            style={{
              padding: "32px 20px",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "13px",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px dashed #e2e8f0",
            }}
          >
            {search
              ? "No matching transcript found."
              : "No transcript available for this meeting."}
          </div>
        ) : (
          transcript.map((segment, i) => {
            const color = getSpeakerColor(segment.speaker, participants);
            const isActive = transcript.indexOf(segment) === activeIndex;

            return (
              <div
                key={i}
                ref={(el) => (segmentRefs.current[i] = el)}
                style={{
                  position: "relative",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  backgroundColor: isActive ? "#eef2ff" : "#ffffff",
                  border: `1px solid ${
                    isActive ? "#c7d2fe" : "#e2e8f0"
                  }`,
                  boxShadow: isActive
                    ? "0 2px 8px rgba(79,70,229,0.12)"
                    : "0 1px 2px rgba(0,0,0,0.03)",
                  transition:
                    "background-color .2s,border-color .2s,box-shadow .2s",
                }}
              >
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 12,
                      bottom: 12,
                      width: "3px",
                      borderRadius: "0 3px 3px 0",
                      backgroundColor: "#4f46e5",
                    }}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        display: "grid",
                        placeItems: "center",
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        fontSize: "10px",
                        fontWeight: 700,
                        color,
                        backgroundColor: color + "1f",
                      }}
                    >
                      {getInitials(segment.speaker)}
                    </span>

                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      {highlightText(segment.speaker)}
                    </span>
                  </span>

                  {segment.start !== null &&
                    segment.start !== undefined && (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          fontFamily: "monospace",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {formatTime(segment.start)}
                      </span>
                    )}
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#0f172a",
                    lineHeight: 1.6,
                    paddingLeft: "30px",
                  }}
                >
                  {highlightText(segment.text)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TranscriptPanel;