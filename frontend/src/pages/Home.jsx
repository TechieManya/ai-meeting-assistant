import { Link } from "react-router-dom";
import {
  Mic, FileText, Users, ListChecks, Search, PlayCircle,
  ArrowRight, Menu, X, CheckSquare, Square, Play
} from "lucide-react";
import { useState } from "react";
import theme from "../theme";

const features = [
  { icon: Mic, title: "Auto Transcription", desc: "Every word captured automatically the moment your meeting starts." },
  { icon: Users, title: "Per-Speaker Detection", desc: "Know exactly who said what, with speakers separated automatically." },
  { icon: FileText, title: "AI Summaries", desc: "A clear executive summary generated the moment your meeting ends." },
  { icon: ListChecks, title: "Key Points & Actions", desc: "The important parts pulled out, so nothing gets lost in the transcript." },
  { icon: Search, title: "Searchable History", desc: "Every past meeting, organized and easy to find again." },
  { icon: PlayCircle, title: "Recording Replay", desc: "Play back the audio synced to the transcript, right where you left off." },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      backdropFilter: "blur(12px)", backgroundColor: "rgba(255,255,255,0.85)",
      borderBottom: `1px solid ${theme.border}`,
      padding: "14px 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: `linear-gradient(135deg, ${theme.accent}, #7c3aed)`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
        }}>🤖</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "16px", color: theme.textPrimary }}>Conferio</div>
          <div style={{ fontSize: "10px", color: theme.textMuted }}>Your Pensieve for Meetings</div>
        </div>
      </div>

      <nav style={{ display: "flex", gap: "28px" }} className="desktop-nav">
        <a href="#features" style={{ fontSize: "14px", color: theme.textSecondary, textDecoration: "none" }}>Features</a>
        <a href="#how-it-works" style={{ fontSize: "14px", color: theme.textSecondary, textDecoration: "none" }}>How it works</a>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link to="/app" style={{
          padding: "9px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
          color: "#ffffff", textDecoration: "none",
          background: `linear-gradient(135deg, ${theme.accent}, #7c3aed)`,
        }}>
          Get Started
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer" }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section style={{
      padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden",
      background: `radial-gradient(circle at 50% 0%, ${theme.accentSoft} 0%, transparent 60%)`,
    }}>
      <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 800, color: theme.textPrimary, margin: "0 0 20px", lineHeight: 1.1 }}>
        Your{" "}
        <span style={{
          background: `linear-gradient(135deg, ${theme.accent}, #7c3aed)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Pensieve</span>{" "}
        for meetings
      </h1>
      <p style={{ fontSize: "17px", color: theme.textSecondary, maxWidth: "560px", margin: "0 auto 32px", lineHeight: 1.7 }}>
        Conferio joins your calls, records them, transcribes every speaker separately,
        and hands you a clean summary with key points and action items the moment it ends.
      </p>
      <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link to="/app" style={{
          padding: "13px 26px", borderRadius: "10px", fontSize: "15px", fontWeight: 600,
          color: "#ffffff", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px",
          background: `linear-gradient(135deg, ${theme.accent}, #7c3aed)`,
          boxShadow: "0 8px 24px rgba(79,70,229,0.25)",
        }}>
          Get Started <ArrowRight size={16} />
        </Link>
        <a href="#features" style={{
          padding: "13px 26px", borderRadius: "10px", fontSize: "15px", fontWeight: 600,
          color: theme.textPrimary, textDecoration: "none",
          border: `1px solid ${theme.border}`, backgroundColor: theme.surface,
        }}>
          See how it works
        </a>
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <section style={{ padding: "20px 24px 80px", display: "flex", justifyContent: "center" }}>
      <div style={{
        maxWidth: "1000px", width: "100%", borderRadius: "16px", overflow: "hidden",
        border: `1px solid ${theme.border}`, boxShadow: "0 24px 64px rgba(79,70,229,0.12)",
        display: "flex", backgroundColor: theme.surface,
      }}>
        {/* Sidebar */}
        <div style={{ width: "180px", borderRight: `1px solid ${theme.border}`, padding: "14px" }}>
          <div style={{
            padding: "9px", borderRadius: "8px", backgroundColor: theme.accent, color: "#fff",
            fontSize: "12px", fontWeight: 600, textAlign: "center", marginBottom: "14px",
          }}>+ New Meeting</div>
          {["ept-hbbu-spf", "kta-vfde-gyr", "yxj-cptz-vbs"].map((id, i) => (
            <div key={id} style={{
              padding: "8px", borderRadius: "6px", marginBottom: "4px",
              backgroundColor: i === 0 ? theme.accentSoft : "transparent",
            }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: theme.textPrimary }}>Meeting · {id}</div>
              <div style={{ fontSize: "9px", color: theme.textMuted }}>Manya, Vedika</div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ flex: 1, padding: "16px", borderRight: `1px solid ${theme.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: theme.accent, textTransform: "uppercase" }}>AI Summary</span>
            <span style={{ fontSize: "10px", padding: "4px 10px", borderRadius: "999px", border: `1px solid ${theme.border}` }}>Regenerate</span>
          </div>
          <div style={{ backgroundColor: theme.accentSoft, borderRadius: "8px", padding: "10px", marginBottom: "10px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: theme.accent, marginBottom: "4px" }}>EXECUTIVE SUMMARY</div>
            <div style={{ fontSize: "10px", color: theme.textPrimary, lineHeight: 1.5 }}>Team reviewed launch progress and finalized next milestones.</div>
          </div>
          <div style={{ fontSize: "10px", fontWeight: 700, color: theme.accent, marginBottom: "6px" }}>KEY POINTS</div>
          <div style={{ fontSize: "10px", color: theme.textSecondary, marginBottom: "10px" }}>• Bot integration complete<br />• Transcript quality improved</div>
          <div style={{ fontSize: "10px", fontWeight: 700, color: theme.accent, marginBottom: "6px" }}>ACTION ITEMS</div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: theme.textPrimary, marginBottom: "4px" }}>
            <CheckSquare size={11} color={theme.success} /> Ship landing page
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: theme.textPrimary }}>
            <Square size={11} color={theme.textMuted} /> Review transcript edge cases
          </div>
        </div>

        {/* Transcript */}
        <div style={{ width: "260px", padding: "16px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", marginBottom: "10px" }}>Transcript</div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
            <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: theme.accent, color: "#fff", fontSize: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>MP</div>
            <div>
              <div style={{ fontSize: "9px", fontWeight: 700, color: theme.accent }}>Manya · 0:27</div>
              <div style={{ fontSize: "9px", color: theme.textSecondary }}>Let's review this week's launch.</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
            <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#0d9488", color: "#fff", fontSize: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>VV</div>
            <div>
              <div style={{ fontSize: "9px", fontWeight: 700, color: "#0d9488" }}>Vedika · 0:35</div>
              <div style={{ fontSize: "9px", color: theme.textSecondary }}>Sounds good, status looks solid.</div>
            </div>
          </div>
          <div style={{ marginTop: "auto", borderTop: `1px solid ${theme.border}`, paddingTop: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Play size={14} color={theme.accent} />
            <div style={{ flex: 1, height: "3px", backgroundColor: theme.border, borderRadius: "2px" }}>
              <div style={{ width: "40%", height: "100%", backgroundColor: theme.accent, borderRadius: "2px" }} />
            </div>
            <span style={{ fontSize: "9px", color: theme.textMuted }}>1:12</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" style={{ padding: "60px 24px", maxWidth: "1100px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", fontSize: "28px", fontWeight: 700, color: theme.textPrimary, marginBottom: "40px" }}>
        Everything a meeting leaves behind, organized
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} style={{
            padding: "24px", borderRadius: "12px", border: `1px solid ${theme.border}`,
            backgroundColor: theme.surface, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px", marginBottom: "14px",
              background: `linear-gradient(135deg, ${theme.accent}, #7c3aed)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon size={19} color="#fff" />
            </div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: theme.textPrimary, marginBottom: "6px" }}>{title}</div>
            <div style={{ fontSize: "13px", color: theme.textSecondary, lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { title: "Record", desc: "Send Conferio's bot into any Google Meet call — it joins and records automatically." },
    { title: "Transcribe", desc: "Every speaker is separated and transcribed the moment the meeting ends." },
    { title: "Summarize", desc: "An AI summary, key points, and action items land in your inbox instantly." },
  ];
  return (
    <section id="how-it-works" style={{ padding: "60px 24px", backgroundColor: theme.surfaceHover }}>
      <h2 style={{ textAlign: "center", fontSize: "28px", fontWeight: 700, color: theme.textPrimary, marginBottom: "40px" }}>
        How it works
      </h2>
      <div style={{ display: "flex", gap: "24px", maxWidth: "900px", margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
        {steps.map((step, i) => (
          <div key={step.title} style={{ flex: "1 1 240px", textAlign: "center" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "50%", margin: "0 auto 14px",
              backgroundColor: theme.accent, color: "#fff", display: "flex",
              alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "16px",
            }}>{i + 1}</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: theme.textPrimary, marginBottom: "6px" }}>{step.title}</div>
            <div style={{ fontSize: "13px", color: theme.textSecondary, lineHeight: 1.6 }}>{step.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section style={{
      margin: "60px 24px", padding: "50px 24px", borderRadius: "20px", textAlign: "center",
      background: `linear-gradient(135deg, ${theme.accent}, #7c3aed)`,
    }}>
      <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>
        Stop taking meeting notes by hand
      </h2>
      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", marginBottom: "24px" }}>
        Let Conferio remember it for you.
      </p>
      <Link to="/app" style={{
        padding: "13px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: 700,
        color: theme.accent, backgroundColor: "#fff", textDecoration: "none", display: "inline-block",
      }}>
        Get Started Free
      </Link>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "32px 24px", textAlign: "center", borderTop: `1px solid ${theme.border}` }}>
      <div style={{ fontSize: "13px", color: theme.textSecondary, marginBottom: "6px" }}>
        Conferio — Your Pensieve for Meetings
      </div>
      <div style={{ fontSize: "12px", color: theme.textMuted }}>
        An internship project by Manya &amp; Vedika.
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div style={{ backgroundColor: theme.bg, minHeight: "100vh" }}>
      <Header />
      <Hero />
      <DashboardMockup />
      <Features />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
}

export default Home;