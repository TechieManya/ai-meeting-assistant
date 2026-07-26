import { useState } from "react";
import { useAuth } from "../AuthContext";

const inputStyle = {
  padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0",
  fontSize: "13px", outline: "none", color: "#0f172a",
};

function AuthScreen() {
  const { login, register, error } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "login") await login(email, password);
    else await register(email, password, name);
    setLoading(false);
  };

  return (
    <div style={{
      height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: "#f8fafc", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      <div style={{
        width: "360px", backgroundColor: "#ffffff", borderRadius: "16px",
        border: "1px solid #e2e8f0", padding: "32px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#eeeffd",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
          }}>🤖</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "17px", color: "#4f46e5", lineHeight: 1.2 }}>Conferio</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>Your Pensieve for Meetings</div>
          </div>
        </div>

        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>
          {mode === "login" ? "Log in to your account" : "Create your account"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {mode === "signup" && (
            <input type="text" placeholder="Full name" value={name} required
              onChange={(e) => setName(e.target.value)} style={inputStyle} />
          )}
          <input type="email" placeholder="Email" value={email} required
            onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          <input type="password" placeholder="Password" value={password} required
            onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

          {error && (
            <div style={{
              fontSize: "12px", color: "#dc2626", backgroundColor: "#fef2f2",
              border: "1px solid #fecaca", borderRadius: "8px", padding: "8px 12px",
            }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            padding: "10px", borderRadius: "8px", border: "none",
            backgroundColor: "#4f46e5", color: "#ffffff", fontSize: "14px", fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer", marginTop: "4px",
          }}>
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div style={{ marginTop: "16px", textAlign: "center", fontSize: "13px", color: "#64748b" }}>
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            style={{ background: "none", border: "none", color: "#4f46e5", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;