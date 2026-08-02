import { useState, useEffect } from "react";
import { FileText, ListChecks, CheckSquare, Square, RefreshCw, Sparkles, Mail } from "lucide-react";
import { sendMeetingReport } from "../services/api";

function HoverCard({ style, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...style,
        borderColor: hovered ? "#4f46e5" : "#e2e8f0",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 4px 12px rgba(0, 0, 0, 0.08)"
          : "0 1px 3px rgba(0, 0, 0, 0.05)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
}

function SummaryPanel({ summary, summaryLoading, onGenerate, botId }) {
  const [completedItems, setCompletedItems] = useState({});
  const [sendingReport, setSendingReport] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);

  useEffect(() => {
    setCompletedItems({});
    setSendStatus(null);
  }, [summary]);

  const toggleActionItem = (index) => {
    setCompletedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSendReport = async () => {
    if (!botId) return;
    setSendingReport(true);
    setSendStatus(null);
    try {
      await sendMeetingReport(botId);
      setSendStatus("sent");
    } catch (err) {
      setSendStatus("error");
    } finally {
      setSendingReport(false);
    }
  };

  const cardStyle = {
    padding: "28px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxSizing: "border-box",

    minWidth: 0,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
   
  };

  const eyebrowStyle = {
   display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "18px",
  fontSize: "12px",
  fontWeight: 800,
  color: "#4f46e5",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  };

  const pillButtonStyle = (disabled) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "8px 18px",
    borderRadius: "999px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    color: disabled ? "#94a3b8" : "#0f172a",
    fontSize: "13px",
    fontWeight: "600",
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
    transition: "all 0.15s ease",
  });

  return (
    <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    minWidth: 0,
  }}
>
    
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            fontWeight: 700,
            color: "#4f46e5",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginTop: "10px",
          }}
        >
          <Sparkles size={13} /> AI Summary
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {summary && (
            <button
              onClick={handleSendReport}
              disabled={sendingReport}
              style={pillButtonStyle(sendingReport)}
              onMouseEnter={(e) => {
                if (!sendingReport) {
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                  e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.06)";
              }}
            >
              <Mail size={14} />
              {sendingReport ? "Sending..." : "Send Report"}
            </button>
          )}

          <button
            onClick={onGenerate}
            disabled={summaryLoading}
            style={pillButtonStyle(summaryLoading)}
            onMouseEnter={(e) => {
              if (!summaryLoading) {
                e.currentTarget.style.backgroundColor = "#f8fafc";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.06)";
            }}
          >
            <RefreshCw size={14} className={summaryLoading ? "animate-spin" : ""} />
            {summaryLoading ? "Generating..." : summary ? "Regenerate" : "Generate"}
          </button>
        </div>
      </div>

      {sendStatus === "sent" && (
        <div style={{ fontSize: "12px", color: "#16a34a", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "10px 14px" }}>
          ✅ Report sent to your email.
        </div>
      )}
      {sendStatus === "error" && (
        <div style={{ fontSize: "12px", color: "#dc2626", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px" }}>
          ❌ Failed to send report. Please try again.
        </div>
      )}

      {!summary && !summaryLoading && (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px dashed #e2e8f0",
            color: "#94a3b8",
            fontSize: "13px",
          }}
        >
          Click Generate to create an AI summary of this meeting.
        </div>
      )}

      {summary && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {summary.summary && (
            <HoverCard style={cardStyle}>
              <div style={eyebrowStyle}>
                <FileText size={13} /> Executive Summary
              </div>
              <p
                style={{
                  fontSize: "13.5px",
                  color: "#0f172a",
                  lineHeight: 1.65,
                  margin: 0,
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {summary.summary}
              </p>
            </HoverCard>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "16px",
              alignItems: "stretch",
            }}
          >
            {summary.key_points?.length > 0 && (
              <HoverCard
                style={{
                  ...cardStyle,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div style={eyebrowStyle}>
                  <ListChecks size={13} /> Key Points
                </div>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    flex: 1,
                  }}
                >
                  {summary.key_points.map((point, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: "13px",
                        color: "#0f172a",
                        lineHeight: 1.55,
                        display: "flex",
                        gap: "10px",
                        minWidth: 0
                      }}
                    >
                      <span
                        style={{
                          marginTop: "6px",
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          backgroundColor: "#4f46e5",
                          flexShrink: 0,
                        }}
                      />
                      <span
                          style={{
                           overflowWrap: "anywhere",
                          wordBreak: "break-word",
                          }}
                       >
                          {point}
                       </span>
                    </li>
                  ))}
                </ul>
              </HoverCard>
            )}

            {summary.action_items?.length > 0 && (
              <HoverCard
                style={{
                  ...cardStyle,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div style={eyebrowStyle}>
                  <CheckSquare size={13} /> Action Items
                </div>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    flex: 1,
                  }}
                >
                  {summary.action_items.map((item, i) => {
                    const isDone = !!completedItems[i];
                    return (
                      <li
                        key={i}
                        onClick={() => toggleActionItem(i)}
                        style={{
                          fontSize: "13px",
                          color: isDone ? "#94a3b8" : "#0f172a",
                          textDecoration: isDone ? "line-through" : "none",
                          lineHeight: 1.55,
                          display: "flex",
                          gap: "10px",
                          alignItems: "flex-start",
                          cursor: "pointer",
                          userSelect: "none",
                          transition: "color 0.15s ease",
                          minWidth: 0
                        }}
                      >
                        {isDone ? (
                          <CheckSquare
                            size={15}
                            color="#10b981"
                            style={{ flexShrink: 0, marginTop: "2px" }}
                          />
                        ) : (
                          <Square
                            size={15}
                            color="#94a3b8"
                            style={{ flexShrink: 0, marginTop: "2px" }}
                          />
                        )}
                       <span
  style={{
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  }}
>
  {item}
</span>
                      </li>
                    );
                  })}
                </ul>
              </HoverCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SummaryPanel;