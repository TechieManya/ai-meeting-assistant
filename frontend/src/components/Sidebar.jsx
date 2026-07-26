import { ChevronLeft, ChevronRight, Plus, History } from "lucide-react";
import MeetingCard from "./MeetingCard";

function Sidebar({
  meetings = [],
  selectedMeeting,
  activeBotId,
  onSelectMeeting,
  onNewMeeting,
  collapsed,
  onToggleCollapse,
}) {
  const safeMeetings = Array.isArray(meetings)
    ? meetings
    : meetings?.meetings || meetings?.data || [];

  return (
    <aside
      style={{
        width: collapsed ? "68px" : "260px",
        minWidth: collapsed ? "68px" : "260px",
        height: "100vh",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "all 0.2s ease-in-out",
        boxSizing: "border-box",
        userSelect: "none",
      }}
    >
      <div
        style={{
          padding: collapsed ? "16px 12px" : "16px",
          borderBottom: "1px solid #e2e8f0",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {!collapsed ? (
          <button
            onClick={onNewMeeting}
            style={{
              flex: 1,
              height: "38px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#4f46e5",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
          >
            <Plus size={16} />
            <span>New Meeting</span>
          </button>
        ) : (
          <button
            onClick={onNewMeeting}
            title="New Meeting"
            style={{
              width: "40px",
              height: "38px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#4f46e5",
              color: "#FFFFFF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={16} />
          </button>
        )}

        <button
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            color: "#334155",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background-color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {!collapsed ? (
        <>
          <div
            style={{
              padding: "16px 16px 8px",
              fontSize: "11px",
              fontWeight: "700",
              color: "#94a3b8",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <History size={12} />
            <span>Meeting History</span>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "4px 8px 16px 8px",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {activeBotId && (
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#10b981",
                    animation: "pulse 1.5s infinite ease-in-out",
                    flexShrink: 0,
                  }}
                />
                <div style={{ overflow: "hidden" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#10b981",
                      lineHeight: "1.2",
                    }}
                  >
                    Live Recording
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#334155",
                      fontFamily: "monospace",
                      marginTop: "2px",
                    }}
                  >
                    {activeBotId.slice(0, 8)}...
                  </div>
                </div>
              </div>
            )}

            {safeMeetings.length === 0 ? (
              <div
                style={{
                  padding: "32px 16px",
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                No meetings yet.
                <br />
                <span style={{ fontSize: "11px" }}>Start by clicking New Meeting.</span>
              </div>
            ) : (
              safeMeetings.map((meeting, index) => (
                <MeetingCard
                  key={meeting.bot_id || index}
                  meeting={meeting}
                  isSelected={selectedMeeting?.bot_id === meeting.bot_id}
                  onClick={() => onSelectMeeting(meeting)}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <div style={{ flex: 1, display: "flex", justifyContent: "center", paddingTop: "16px" }}>
          {activeBotId && (
            <div
              title="Live Meeting Active"
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                animation: "pulse 1.5s infinite ease-in-out",
              }}
            />
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.9); }
        }
      `}</style>
    </aside>
  );
}

export default Sidebar;