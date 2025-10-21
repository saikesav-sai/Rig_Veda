import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import ChatBot from "./components/ChatBot";
import Credits from "./components/Credits";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import PrivacyPolicy from "./components/PrivacyPolicy";
import QuoteCarousel from "./components/QuoteCarousel";
import SemanticSearch from "./components/SemanticSearch";
import VedaExplorer from "./components/VedaExplorer";

// 🌙 Midnight Sanskrit - Unique Color Palette
const GRADIENTS = {
  purple: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)", // Sacred Teal
  orange: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)", // Luminous Amber
  green: "linear-gradient(135deg, #0d9488 0%, #115e59 100%)", // Deep Teal
  indigo: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", // Midnight to Twilight
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)" // Deep night gradient
};

// Reusable feature card
const FeatureCard = ({ gradient, title, description, icon, onClick, delay = 0 }) => (
  <div onClick={onClick} className="card-hover"
    style={{ background: gradient, padding: "3rem 2rem", borderRadius: "24px",
      boxShadow: `0 20px 60px ${gradient.match(/#([a-f0-9]{6})/i)?.[0]}4d`, cursor: "pointer",
      position: "relative", overflow: "hidden", color: "white", textAlign: "center",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}>
    <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%",
      background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
      animation: `rotate-slow ${20 + delay * 5}s linear infinite ${delay ? 'reverse' : ''}` }} />
    <div style={{ position: "relative", zIndex: 2 }}>
      <div style={{ fontSize: "4rem", marginBottom: "1.5rem",
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))" }}>{icon}</div>
      <h3 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "1rem", color: "white" }}>{title}</h3>
      <p style={{ fontSize: "1.05rem", lineHeight: "1.6", color: "rgba(255,255,255,0.9)",
        marginBottom: "1.5rem" }}>{description}</p>
      <div style={{ display: "inline-block", padding: "0.75rem 2rem",
        background: "rgba(255,255,255,0.2)", borderRadius: "50px", fontSize: "0.95rem",
        fontWeight: "600", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.3)" }}>
        Try Now →</div>
    </div>
  </div>
);

// Stat item
const StatItem = ({ value, label, sublabel, color }) => (
  <div>
    <div style={{ fontSize: "3rem", fontWeight: "800", color, marginBottom: "0.5rem" }}>{value}</div>
    <div style={{ fontSize: "1.1rem", color: "#cbd5e1", fontWeight: "600" }}>{label}</div>
    <div style={{ fontSize: "0.9rem", color: "#94a3b8", marginTop: "0.25rem" }}>{sublabel}</div>
  </div>
);

// Nav button
const NavButton = ({ page, currentPage, onClick, icon, label }) => (
  <button onClick={() => onClick(page)}
    style={{ padding: "0.6rem 1.2rem", fontSize: "0.95rem", fontWeight: "600",
      background: currentPage === page ? GRADIENTS.orange : "rgba(30, 41, 59, 0.8)",
      color: currentPage === page ? "#0f172a" : "#fbbf24",
      border: currentPage === page ? "none" : "2px solid rgba(251, 191, 36, 0.3)", borderRadius: "50px",
      cursor: "pointer", transition: "all 0.3s ease",
      boxShadow: currentPage === page ? "0 4px 15px rgba(251, 191, 36, 0.4)" : "none" }}>
    {icon} {label}
  </button>
);

function App() {
  const navigate = useNavigate();
  const navigateToPage = (page) => navigate(page === 'home' ? '/' : `/${page}`);
  const goHome = () => navigate('/');
  const location = useLocation();
  const currentPage = location.pathname === '/' ? 'home' : location.pathname.replace(/^\//, '');

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const features = [
    { gradient: GRADIENTS.green, title: "Veda Explorer", icon: <img src="/mandala.png" alt="Explorer" style={{ width: "4rem", height: "4rem", filter: "brightness(0) invert(1)" }} />, page: "explorer",
      description: "Navigate the Rig Veda systematically by Mandala, Hymn, and Verse, complete with rich metadata and accompanying audio." },
      { gradient: GRADIENTS.orange, title: "Sacred AI Guide", icon: "🪷", page: "chat",
      description: "Explore the Rig Veda with AI Chat Bot, uncover verse meanings, historical context, and listen to authentic recitations." },
    { gradient: GRADIENTS.purple, title: "Semantic Search", icon: <img src="/search2.png" alt="Search" style={{ width: "4rem", height: "4rem", filter: "brightness(0) invert(1)" }} />, page: "search",
      description: "Discover Rig Veda slokas through keywords like \"fire sacrifice\" or \"dawn goddess.\"" }
    
    
  ];

  const stats = [
    { value: "10", label: "Mandalas", sublabel: "Sacred Books", color: "#fbbf24" },
    { value: "1,028", label: "Suktas", sublabel: "Hymns", color: "#14b8a6" },
    { value: "10,552", label: "Mantras", sublabel: "Verses", color: "#f59e0b" },
    { value: "3,500+", label: "Years Old", sublabel: "Ancient Wisdom", color: "#0d9488" }
  ];

  const renderHomePage = () => (
    <div style={{ background: GRADIENTS.background, minHeight: "calc(100vh - 120px)" }}>
      <div style={{ position: "relative", overflow: "hidden", paddingTop: ".1rem" }}>
        {[{ top: "-100px", right: "-100px", w: "400px", h: "400px", anim: "8s" },
          { bottom: "-150px", left: "-150px", w: "500px", h: "500px", anim: "10s reverse" }]
          .map((d, i) => (
            <div key={i} style={{ position: "absolute", ...d, width: d.w, height: d.h,
              background: `radial-gradient(circle, rgba(${i ? '102, 126, 234' : '245, 158, 11'}, ${i ? '0.08' : '0.1'}) 0%, transparent 70%)`,
              borderRadius: "50%", animation: `float-gentle ${d.anim} ease-in-out infinite` }} />
          ))}
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1rem",
          position: "relative", zIndex: 10 }}>
          <Hero navigateToPage={navigateToPage} />
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "4rem 2rem 3rem",
        position: "relative", zIndex: 20 }}>
        <h2 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "700",
          color: "#f8fafc", marginBottom: "1rem", letterSpacing: "-0.5px" }}>
          Explore the Sacred Texts
        </h2>
        <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#cbd5e1",
          maxWidth: "700px", margin: "0 auto 3rem" }}>
          Three powerful ways to discover ancient wisdom
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem", marginBottom: "4rem" }}>
          {features.map((feat, i) => (
            <FeatureCard key={i} {...feat} onClick={() => navigateToPage(feat.page)} delay={i} />
          ))}
        </div>

        <div style={{ maxWidth: "900px", margin: "0 auto 4rem", padding: "0 1rem" }}>
          <QuoteCarousel />
        </div>

        <div style={{ background: "rgba(30, 41, 59, 0.6)", borderRadius: "24px", padding: "3rem 2rem",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)", marginBottom: "4rem",
          border: "1px solid rgba(251, 191, 36, 0.2)", backdropFilter: "blur(20px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "3rem", textAlign: "center" }}>
            {stats.map((stat, i) => <StatItem key={i} {...stat} />)}
          </div>
        </div>

        <div style={{ background: GRADIENTS.indigo, borderRadius: "24px", padding: "4rem 3rem",
          textAlign: "center", color: "white", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            background: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            opacity: 0.3 }} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <img src="/om.png" alt="Om" style={{ width: "4rem", height: "4rem", marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem" }}>
              Begin Your Journey
            </h2>
            <p style={{ fontSize: "1.2rem", opacity: 0.9, maxWidth: "600px",
              margin: "0 auto 2rem" }}>
              Dive into the world's oldest scripture and discover timeless wisdom
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              {[{ text: "Start Exploring", page: "search", solid: true },
                { text: "Ask AI Guide", page: "chat", solid: false }].map((btn, i) => (
                <button key={i} onClick={() => navigateToPage(btn.page)} className={btn.solid ? "btn-shimmer" : ""}
                  style={{ padding: "1rem 2.5rem", fontSize: "1.1rem", fontWeight: "700",
                    background: btn.solid ? "#fbbf24" : "rgba(251,191,36,0.1)",
                    color: btn.solid ? "#0f172a" : "#fbbf24",
                    border: btn.solid ? "none" : "2px solid #fbbf24", borderRadius: "50px",
                    cursor: "pointer", transition: "all 0.3s ease",
                    boxShadow: btn.solid ? "0 4px 20px rgba(251,191,36,0.4)" : "none",
                    backdropFilter: btn.solid ? "none" : "blur(10px)" }}>
                  {btn.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <header style={{ background: "rgba(30, 41, 59, 0.8)",
        color: "#f8fafc", padding: "1.5rem 0", boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
        position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(251, 191, 36, 0.2)" }}>
        <div style={{ maxWidth: "1400px", margin: "auto", padding: "0 2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: "1rem" }}>
            <div onClick={goHome}
              style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer",
                transition: "all 0.3s ease" }}>
              <img src="/om.png" alt="Om" style={{ width: "2.5rem", height: "2.5rem", objectFit: "contain" }} />
              <h1 style={{ fontSize: "1.5rem", margin: 0, fontWeight: "700",letterSpacing: "-0.5px" }}>Eternal Veda </h1>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <NavButton page="explorer" currentPage={currentPage} onClick={navigateToPage}
                icon={<img src="/book.png" alt="Explorer" style={{ width: "1.2rem", height: "1.2rem", verticalAlign: "middle", marginRight: "0.3rem" }} />} label="Explorer" />
                <NavButton page="chat" currentPage={currentPage} onClick={navigateToPage}
                icon={<img src="/AI.png" alt="AI Guide" style={{ width: "1.2rem", height: "1.2rem", verticalAlign: "middle", marginRight: "0.3rem" }} />} label="AI Guide" />
              <NavButton page="search" currentPage={currentPage} onClick={navigateToPage}
                icon={<img src="/search3.png" alt="Search" style={{ width: "1.2rem", height: "1.2rem", verticalAlign: "middle", marginRight: "0.3rem" }} />} label="Search" />
              
              
            </div>
          </div>
        </div>
      </header>
      <Routes>
        <Route path="/" element={renderHomePage()} />
        <Route path="/search" element={<SemanticSearch />} />
        <Route path="/chat" element={<ChatBot />} />
        <Route path="/explorer" element={<VedaExplorer />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/credits" element={<Credits />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
