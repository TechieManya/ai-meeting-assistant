import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import MeetingJoinForm from "./components/MeetingJoinForm";
import AuthScreen from "./components/AuthScreen";
import Home from "./pages/Home";
import MeetingPage from "./pages/MeetingPage";
import ResetPassword from "./pages/ResetPassword";

import { getAllMeetings } from "./services/api";
import { AuthProvider, useAuth } from "./AuthContext";
import theme from "./theme";

function AppShell() {
  const { user, logout } = useAuth();

  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [activeBotId, setActiveBotId] = useState(null);
  const [mode, setMode] = useState("welcome");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const fetchHistory = async () => {
    try {
      const data = await getAllMeetings();
      const meetingsList = Array.isArray(data)
        ? data
        : data?.meetings || data?.data || [];
      setMeetings(meetingsList);
    } catch (err) {
      console.error("Failed to fetch meeting history:", err);
      setMeetings([]);
    }
  };

  const handleSelectMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setMode("history");
    setShowJoinForm(false);
  };

  const handleNewMeeting = () => {
    setShowJoinForm(true);
    setSelectedMeeting(null);
    setMode("new");
  };

  const handleBotJoined = (botId) => {
    setActiveBotId(botId);
    setMode("live");
    setShowJoinForm(false);
  };

  const handleTranscriptReady = () => {
    fetchHistory();
  };

  if (!user) return <AuthScreen />;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        backgroundColor: theme.bg,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        overflow: "hidden",
      }}
    >
      <header
        style={{
          padding: "14px 32px",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#eeeffd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              padding: "8px",
              boxSizing: "border-box",
            }}
          >
            🤖
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "17px",
                fontWeight: 700,
                color: "#4f46e5",
                lineHeight: 1.2,
              }}
            >
              Conferio
            </h1>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "11px",
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              Your Pensieve for Meetings
            </p>
          </div>
        </div>

        <div
          ref={dropdownRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            position: "relative",
            paddingRight: "4px",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              color: "#0f172a",
              fontWeight: 700,
            }}
          >
            Welcome, {user.name?.split(" ")[0]}
          </span>

          <button
            onClick={() => setProfileOpen((o) => !o)}
            title={user.name}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              border: "2px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {initials}
          </button>

          {profileOpen && (
            <div
              style={{
                position: "absolute",
                right: "4px",
                top: "50px",
                width: "240px",
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                padding: "16px",
                zIndex: 50,
                boxSizing: "border-box",
              }}
            >
              <div style={{ marginBottom: "14px" }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#0f172a",
                    marginBottom: "3px",
                    lineHeight: 1.3,
                  }}
                >
                  {user.name}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.email}
                </div>
              </div>

              <div
                style={{
                  height: "1px",
                  backgroundColor: "#e2e8f0",
                  margin: "0 0 14px",
                }}
              />

              <button
                onClick={logout}
                style={{
                  width: "100%",
                  padding: "10px 0",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "0.2px",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fee2e2")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fef2f2")
                }
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar
          meetings={meetings}
          selectedMeeting={selectedMeeting}
          activeBotId={activeBotId}
          onSelectMeeting={handleSelectMeeting}
          onNewMeeting={handleNewMeeting}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main
          style={{
            flex: 1,
            height: "100%",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {showJoinForm ? (
            <div
              style={{
                padding: "32px 40px",
                maxWidth: "1000px",
                margin: "0 auto",
                overflowY: "auto",
                height: "100%",
              }}
            >
              <MeetingJoinForm onBotJoined={handleBotJoined} />
            </div>
          ) : (
            <Dashboard
              mode={mode}
              selectedMeeting={selectedMeeting}
              activeBotId={activeBotId}
              onTranscriptReady={handleTranscriptReady}
              userName={user.name}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app" element={<AppShell />} />
          <Route path="/meeting/:meetingId" element={<MeetingPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;