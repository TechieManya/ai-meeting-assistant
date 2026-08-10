import { Link } from "react-router-dom";
import {
  Mic,
  FileText,
  Users,
  ListChecks,
  Search,
  PlayCircle,
  ArrowRight,
  Menu,
  X,
  Video,
  AudioLines,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import theme from "../theme";
import dashboardPreview from "../assets/dashboard-preview.png";

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
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "24px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box",
      background: `radial-gradient(circle at 50% 0%, ${theme.accentSoft} 0%, transparent 60%)`,
    }}>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        padding: "5px 13px",
        borderRadius: "999px",
        border: `1px solid ${theme.border}`,
        backgroundColor: "rgba(255,255,255,0.6)",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.08em",
        color: theme.accent,
        marginBottom: "28px",
      }}>
        <Sparkles size={12} strokeWidth={2} />
        MEETINGS, MADE CLEAR
      </div>

      <h1 style={{
        fontSize: "clamp(40px, 7vw, 68px)",
        fontWeight: 800,
        color: theme.textPrimary,
        margin: "0 0 24px",
        lineHeight: 1.08,
        letterSpacing: "-0.02em",
      }}>
        Your{" "}
        <span style={{
          background: `linear-gradient(135deg, ${theme.accent}, #7c3aed)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Pensieve</span>{" "}
        for meetings
      </h1>
      <p style={{
        fontSize: "18px",
        color: theme.textSecondary,
        maxWidth: "600px",
        margin: "0 auto 40px",
        lineHeight: 1.7,
      }}>
        Conferio joins your calls, records them, transcribes every speaker separately,
        and hands you a clean summary with key points and action items the moment it ends.
      </p>
      <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "56px" }}>
        <Link to="/app" style={{
          padding: "15px 30px", borderRadius: "10px", fontSize: "16px", fontWeight: 600,
          color: "#ffffff", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px",
          background: `linear-gradient(135deg, ${theme.accent}, #7c3aed)`,
          boxShadow: "0 8px 24px rgba(79,70,229,0.25)",
        }}>
          Get Started <ArrowRight size={18} />
        </Link>
        <a href="#features" style={{
          padding: "15px 30px", borderRadius: "10px", fontSize: "16px", fontWeight: 600,
          color: theme.textPrimary, textDecoration: "none",
          border: `1px solid ${theme.border}`, backgroundColor: theme.surface,
        }}>
          See how it works
        </a>
      </div>

      <div style={{
        display: "flex",
        gap: "36px",
        flexWrap: "wrap",
        justifyContent: "center",
        color: theme.textMuted,
        fontSize: "13.5px",
        fontWeight: 450,
      }}>
        {[
          { icon: Video, label: "Google Meet" },
          { icon: AudioLines, label: "Speaker-aware transcripts" },
          { icon: Sparkles, label: "Instant AI summaries" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon size={14} strokeWidth={1.75} color={theme.accent} />
            {label}
          </div>
        ))}
      </div>

      <div style={{
        position: "absolute",
        bottom: "32px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "12px",
        color: theme.textMuted,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
      }}>
        <span>See it in action</span>
        <div style={{ fontSize: "16px" }}>↓</div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <section
      style={{
        padding: "20px 24px 80px",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          borderRadius: "14px",
          overflow: "hidden",
          border: `1px solid ${theme.border}`,
          boxShadow: "0 24px 64px rgba(79,70,229,0.14)",
          backgroundColor: theme.surface,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 14px",
            borderBottom: `1px solid ${theme.border}`,
            backgroundColor: theme.surfaceHover,
          }}
        >
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#f87171" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#fbbf24" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#34d399" }} />
          <div
            style={{
              marginLeft: "10px",
              flex: 1,
              maxWidth: "260px",
              fontSize: "11px",
              color: theme.textMuted,
              backgroundColor: theme.surface,
              borderRadius: "6px",
              padding: "3px 10px",
              border: `1px solid ${theme.border}`,
            }}
          >
            conferio.vercel.app
          </div>
        </div>

        <img
          src={dashboardPreview}
          alt="Conferio dashboard showing meeting transcript, AI summary, and audio playback"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
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