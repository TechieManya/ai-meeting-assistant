import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../AuthContext";

const inputStyle = {
  padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0",
  fontSize: "13px", outline: "none", color: "#0f172a", width: "100%", boxSizing: "border-box",
};

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, error } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [mismatchError, setMismatchError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMismatchError("");

    if (password !== confirmPassword) {
      setMismatchError("Passwords don't match");
      return;
    }

    setLoading(true);
    const ok = await resetPassword(token, password);
    setLoading(false);
    if (ok) setDone(true);
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

        {done ? (
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
              Password updated
            </h2>
            <div style={{
              fontSize: "13px", color: "#166534", backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0", borderRadius: "8px", padding: "12px", marginBottom: "16px",
            }}>
              Your password has been changed. You can now log in with your new password.
            </div>
            <button
              onClick={() => navigate("/app")}
              style={{
                width: "100%", padding: "10px", borderRadius: "8px", border: "none",
                backgroundColor: "#4f46e5", color: "#ffffff", fontSize: "14px", fontWeight: 600, cursor: "pointer",
              }}
            >
              Go to log in
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>
              Choose a new password
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  required
                  minLength={8}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: "38px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  style={{
                    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", padding: 0, cursor: "pointer",
                    display: "flex", alignItems: "center", color: "#94a3b8",
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
              />

              {(mismatchError || error) && (
                <div style={{
                  fontSize: "12px", color: "#dc2626", backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca", borderRadius: "8px", padding: "8px 12px",
                }}>{mismatchError || error}</div>
              )}

              <button type="submit" disabled={loading} style={{
                padding: "10px", borderRadius: "8px", border: "none",
                backgroundColor: "#4f46e5", color: "#ffffff", fontSize: "14px", fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer", marginTop: "4px",
              }}>
                {loading ? "Please wait..." : "Reset password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;