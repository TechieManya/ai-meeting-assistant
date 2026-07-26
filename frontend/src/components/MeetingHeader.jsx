import { useState, useRef, useEffect } from "react";
import { Clock, ChevronDown } from "lucide-react";
import theme from "../theme";

const AVATAR_COLORS = ["#4f46e5", "#0d9488", "#7c3aed", "#0284c7", "#4338ca"];

function getInitial(name) {
  return name ? name[0].toUpperCase() : "?";
}

function extractMeetCode(url) {
  if (!url) return null;
  try {
    return url.replace(/\/$/, "").split("/").pop();
  } catch {
    return null;
  }
}

function MeetingHeader({ meeting }) {
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setParticipantsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!meeting) return null;

  const participants = meeting.participants || [];
  const botId = meeting.bot_id || "";
  const shortId = botId.slice(0, 8).toUpperCase();
  const meetCode = extractMeetCode(meeting.meeting_url);
  const displayTitle =
    meeting.title || meeting.topic || (meetCode ? `Meeting · ${meetCode}` : `Meeting · ${shortId}`);

  const duration = meeting.duration_seconds
    ? `${Math.floor(meeting.duration_seconds / 60)}m ${meeting.duration_seconds % 60}s`
    : null;

  const chipStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: "500",
    color: theme.textSecondary,
    backgroundColor: theme.surfaceHover,
    border: `1px solid ${theme.border}`,
    borderRadius: "6px",
    padding: "4px 10px",
  };

  return (
    <div
      style={{
        padding: "14px 24px",
        borderBottom: `1px solid ${theme.border}`,
        backgroundColor: theme.surface,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: theme.textPrimary,
          }}
        >
          {displayTitle}
        </span>

        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            onClick={() => setParticipantsOpen((o) => !o)}
            style={{
              ...chipStyle,
              paddingLeft: participants.length ? "6px" : "10px",
              cursor: "pointer",
              border: `1px solid ${participantsOpen ? theme.accent : theme.border}`,
            }}
          >
            {participants.length > 0 && (
              <span style={{ display: "flex", marginRight: "2px" }}>
                {participants.slice(0, 3).map((name, i) => (
                  <span
                    key={i}
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                      color: "#ffffff",
                      fontSize: "9px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: i === 0 ? 0 : "-6px",
                      border: `1.5px solid ${theme.surfaceHover}`,
                    }}
                  >
                    {getInitial(name)}
                  </span>
                ))}
              </span>
            )}
            {participants.length} Participant{participants.length === 1 ? "" : "s"}
            <ChevronDown
              size={12}
              style={{ transform: participantsOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
            />
          </button>

          {participantsOpen && participants.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "36px",
                left: 0,
                minWidth: "180px",
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "10px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                padding: "8px",
                zIndex: 20,
              }}
            >
              {participants.map((name, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: theme.textPrimary,
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                      color: "#ffffff",
                      fontSize: "9px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {getInitial(name)}
                  </span>
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>

        {duration && (
          <span style={chipStyle}>
            <Clock size={13} />
            {duration}
          </span>
        )}
      </div>

      {/* Completed Badge — now a real flex sibling using the outer space-between */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 16px",
          borderRadius: "999px",
          backgroundColor: "#f0fdf4",
          border: "1px solid #bbf7d0",
          color: "#16a34a",
          fontSize: "13px",
          fontWeight: "600",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#16a34a",
          }}
        />
        Completed
      </span>
    </div>
  );
}

export default MeetingHeader;