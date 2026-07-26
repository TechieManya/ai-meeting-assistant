import { useState } from "react";
import { Users, Calendar } from "lucide-react";
import theme from "../theme";

function extractMeetCode(url) {
  if (!url) return null;
  try {
    return url.replace(/\/$/, "").split("/").pop();
  } catch {
    return null;
  }
}

function MeetingCard({ meeting, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false);

  const participants = meeting.participants || [];
  const botId = meeting.bot_id || "";
  const shortId = botId.slice(0, 8).toUpperCase();

  const meetCode = extractMeetCode(meeting.meeting_url);
  const displayTitle =
    meeting.title ||
    meeting.topic ||
    meeting.subject ||
    (meetCode ? `Meeting · ${meetCode}` : `Meeting · ${shortId}`);

  const formatDate = () => {
    try {
      const rawTimestamp = meeting.created_at || meeting.date;

      const timestamp = rawTimestamp
        ? new Date(rawTimestamp).getTime()
        : parseInt(meeting._id?.slice(0, 8), 16) * 1000;

      const date = new Date(timestamp);

      if (isNaN(date.getTime())) return "Unknown Date";

      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown Date";
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "14px 16px",
        marginBottom: "10px",

        borderRadius: "16px",

        border: isSelected
          ? "1px solid #C7D2FE"
          : "1px solid #E5E7EB",

        backgroundColor: isSelected
          ? "#EEF2FF"
          : hovered
          ? "#F8FAFC"
          : "#FFFFFF",

        boxShadow: isSelected
          ? "0 6px 16px rgba(79,70,229,0.10)"
          : hovered
          ? "0 4px 10px rgba(15,23,42,0.06)"
          : "0 1px 3px rgba(15,23,42,0.04)",

        cursor: "pointer",
        transition: "all 0.2s ease",
        boxSizing: "border-box",
      }}
    >
      {isSelected && (
        <span
          style={{
            position: "absolute",
            left: "-1px",
            top: "10px",
            bottom: "10px",
            width: "5px",
            borderRadius: "999px",
            backgroundColor: "#4F46E5",
          }}
        />
      )}

      <div
        style={{
          fontWeight: "600",
          fontSize: "13px",
          color: isSelected ? "#4338CA" : theme.textPrimary,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: "1.4",
        }}
        title={displayTitle}
      >
        {displayTitle}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          fontSize: "11px",
          color: theme.textMuted,
          marginTop: "6px",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <Calendar size={11} />
        <span>{formatDate()}</span>
      </div>

      {participants.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "11px",
            color: theme.textSecondary,
            marginTop: "6px",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <Users size={11} />

          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={participants.join(", ")}
          >
            {participants.join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}

export default MeetingCard;