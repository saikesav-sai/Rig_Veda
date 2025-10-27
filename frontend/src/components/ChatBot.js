import { memo, useCallback, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { API_BASE, API_KEY } from "../config";

const VEDIC_COLORS = {
  deepIndigo: '#1e293b', softGold: '#fbbf24', ivoryWhite: '#f8fafc',
  mutedViolet: '#14b8a6', cosmicBlue: '#334155', sacredOrange: '#f59e0b',
  etherealPurple: '#0d9488', earthyBeige: '#cbd5e1', divineGlow: 'rgba(251, 191, 36, 0.2)'
};

const SACRED_GRADIENTS = {
  cosmic: `linear-gradient(135deg, ${VEDIC_COLORS.deepIndigo} 0%, ${VEDIC_COLORS.cosmicBlue} 50%, #0f172a 100%)`,
  divine: `linear-gradient(135deg, ${VEDIC_COLORS.softGold} 0%, ${VEDIC_COLORS.sacredOrange} 100%)`,
  pure: `linear-gradient(135deg, ${VEDIC_COLORS.deepIndigo} 0%, ${VEDIC_COLORS.cosmicBlue} 100%)`,
  wisdom: `linear-gradient(135deg, ${VEDIC_COLORS.mutedViolet} 0%, ${VEDIC_COLORS.etherealPurple} 100%)`
};

const getIntentConfig = (intent) => {
  const configs = {
    semantic_search: { color: VEDIC_COLORS.cosmicBlue, bg: VEDIC_COLORS.divineGlow,
      icon: <img src="/search2.png" alt="Search" style={{ width: "1.2rem", height: "1.2rem", display: "inline-block", verticalAlign: "middle" }} />, symbol: '🌌', title: 'Cosmic Search' },
    verse_lookup: { color: VEDIC_COLORS.sacredOrange, bg: VEDIC_COLORS.earthyBeige,
      icon: <img src="/mantra.png" alt="Mantra" style={{ width: "1.2rem", height: "1.2rem", display: "inline-block", verticalAlign: "middle" }} />, symbol: '🪷', title: 'Sacred Verse' },
    explanation: { color: VEDIC_COLORS.etherealPurple, bg: 'rgba(20, 184, 166, 0.1)',
      icon: '💫', symbol: <img src="/om.png" alt="Om" style={{ width: "1.2rem", height: "1.2rem", display: "inline-block", verticalAlign: "middle" }} />, title: 'Divine Wisdom' },
    general: { color: VEDIC_COLORS.mutedViolet, bg: 'rgba(248, 250, 252, 0.05)',
      icon: <img src="/namaste.png" alt="Namaste" style={{ width: "1.2rem", height: "1.2rem", display: "inline-block", verticalAlign: "middle" }} />, symbol: '✨', title: 'Sacred Dialogue' }
  };
  return configs[intent] || configs.general;
};

const SlokaCard = memo(({ sloka, idx, playingAudio, audioLoading, toggleAudio }) => (
  <div key={idx} style={{ background: SACRED_GRADIENTS.pure,
    border: `1px solid ${VEDIC_COLORS.softGold}30`, borderRadius: "12px",
    padding: "1rem", marginBottom: "0.75rem", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, right: 0, width: "40px", height: "40px",
      background: `${VEDIC_COLORS.softGold}10`, borderRadius: "0 12px 0 40px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: "0.5rem", gap: "0.5rem" }}>
      <div style={{ fontWeight: "600", color: VEDIC_COLORS.softGold,
        fontSize: "0.9rem" }}><img src="/om.png" alt="Om" style={{ width: "1rem", height: "1rem", display: "inline-block", verticalAlign: "middle", marginRight: "0.3rem" }} /> {sloka.location}</div>
      <button onClick={() => toggleAudio(sloka.location)}
        disabled={audioLoading === sloka.location}
        style={{ display: "flex", alignItems: "center", gap: "0.4rem",
          background: playingAudio === sloka.location 
            ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" 
            : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
          color: playingAudio === sloka.location ? "white" : "#0f172a", border: "none", padding: "0.4rem 0.8rem", borderRadius: "20px",
          fontSize: "0.75rem", fontWeight: "600",
          cursor: audioLoading === sloka.location ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          boxShadow: playingAudio === sloka.location
            ? "0 4px 12px rgba(239,68,68,0.3)" : "0 4px 12px rgba(102,126,234,0.3)",
          opacity: audioLoading === sloka.location ? 0.7 : 1 }}>
        {audioLoading === sloka.location ? (
          <>
            <div style={{ width: "10px", height: "10px", border: "2px solid #ffffff40",
              borderTop: "2px solid white", borderRadius: "50%",
              animation: "spin 1s linear infinite" }} />
            <span>Loading...</span>
          </>
        ) : playingAudio === sloka.location ? (
          <><FaPause size={10} /><span>Pause</span></>
        ) : (
          <><FaPlay size={10} /><span>Play</span></>
        )}
      </button>
    </div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    <div className="sanskrit-text" style={{ fontSize: "1.5rem", fontStyle: "italic",
      color: VEDIC_COLORS.mutedViolet, marginBottom: "0.5rem",
      fontFamily: "'Noto Serif Devanagari', serif", lineHeight: "1.8",
      textAlign: "center", padding: "0.5rem 0" }}>{sloka.sanskrit}</div>
    <div style={{ lineHeight: "1.6", color: VEDIC_COLORS.ivoryWhite,
      fontSize: "0.95rem", fontFamily: "'Crimson Pro', serif" }}>{sloka.meaning}</div>
  </div>
));

// Section wrapper component
const Section = memo(({ title, content, gradient, borderColor }) => (
  <div style={{ background: gradient, border: `2px solid ${borderColor}`,
    borderRadius: "16px", padding: "1.25rem", marginBottom: "1rem",
    position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px",
      background: SACRED_GRADIENTS.divine }} />
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem",
      marginBottom: "0.75rem" }}>
      <span style={{ fontSize: "1.2rem" }}>{typeof title.icon === 'string' ? title.icon : title.icon}</span>
      <strong style={{ color: title.color, fontFamily: "'Crimson Pro', serif",
        fontSize: "1.1rem" }}>{title.text}</strong>
    </div>
    <div style={{ lineHeight: "1.7", color: VEDIC_COLORS.earthyBeige,
      fontFamily: "'Crimson Pro', serif", fontSize: "1.05rem" }}>{content}</div>
  </div>
));

export default function ChatBot() {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [audioLoading, setAudioLoading] = useState(null);
  const audioRefs = useRef({});

  const getAudioUrl = useCallback((location) => {
    if (!location) return null;
    const parts = location.split('.');
    if (parts.length !== 3) return null;
    return `${API_BASE}/audio/${parseInt(parts[0])}/${parseInt(parts[1])}/${parseInt(parts[2])}`;
  }, []);

  const toggleAudio = useCallback(async (location) => {
    const audioUrl = getAudioUrl(location);
    if (!audioUrl) return;

    if (playingAudio === location) {
      audioRefs.current[location]?.pause();
      setPlayingAudio(null);
      return;
    }

    if (playingAudio && audioRefs.current[playingAudio]) {
      audioRefs.current[playingAudio].pause();
    }

    setAudioLoading(location);
    try {
      if (!audioRefs.current[location]) {
        const audio = new Audio(audioUrl);
        audioRefs.current[location] = audio;
        audio.addEventListener('ended', () => { setPlayingAudio(null); setAudioLoading(null); });
        audio.addEventListener('error', () => { setAudioLoading(null); setPlayingAudio(null); });
      }
      await audioRefs.current[location].play();
      setPlayingAudio(location);
      setAudioLoading(null);
    } catch (error) {
      setAudioLoading(null);
      setPlayingAudio(null);
    }
  }, [playingAudio, getAudioUrl]);

  const renderChatResponse = (data) => {
    if (typeof data === "string") {
      return <div style={{ fontFamily: "'Crimson Pro', 'Noto Serif', serif",
        lineHeight: "1.7", color: VEDIC_COLORS.earthyBeige }}>{data}</div>;
    }

    const { answer, slokas } = data;
    const intentUsed = answer?.intent_used || "general";
    const config = getIntentConfig(intentUsed);

    return (
      <div style={{ maxWidth: "100%", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: SACRED_GRADIENTS.divine, color: "white", padding: "0.5rem 1rem",
          borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600", marginBottom: "1rem",
          boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
          border: `1px solid ${VEDIC_COLORS.softGold}30` }}>
          <span>{config.symbol}</span><span>{config.title}</span>
        </div>

        {slokas && slokas.length > 0 && (
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem",
              marginBottom: "1rem", justifyContent: "center" }}>
              <div style={{ width: "30px", height: "2px", background: SACRED_GRADIENTS.divine }} />
              <span style={{ fontSize: "1.1rem", fontWeight: "600",
                color: VEDIC_COLORS.softGold, fontFamily: "'Crimson Pro', serif" }}>
                🪷 Sacred Verses ({slokas.length})
              </span>
              <div style={{ width: "30px", height: "2px", background: SACRED_GRADIENTS.divine }} />
            </div>
            {slokas.slice(0, 2).map((sloka, idx) => (
              <SlokaCard key={idx} sloka={sloka} idx={idx} playingAudio={playingAudio}
                audioLoading={audioLoading} toggleAudio={toggleAudio} />
            ))}
            {slokas.length > 2 && (
              <div style={{ fontSize: "0.85rem", color: VEDIC_COLORS.mutedViolet,
                fontStyle: "italic", textAlign: "center", marginTop: "0.5rem" }}>
                ✨ ... and {slokas.length - 2} more sacred verses await
              </div>
            )}
          </div>
        )}

        {answer?.summary && (
          <Section title={{ icon: <img src="/book.png" alt="Book" style={{ width: "1.5rem", height: "1.5rem", display: "inline-block", verticalAlign: "middle" }} />, text: "Sacred Summary", color: VEDIC_COLORS.softGold }}
            content={answer.summary} gradient={SACRED_GRADIENTS.pure}
            borderColor={`${VEDIC_COLORS.softGold}40`} />
        )}

        {answer?.interpretation && (
          <Section
            title={{ icon: '🔮', text: "Divine Interpretation", color: VEDIC_COLORS.mutedViolet }}
            content={answer.interpretation}
            gradient={SACRED_GRADIENTS.pure}
            borderColor={`${VEDIC_COLORS.mutedViolet}40`} />
        )}

        {answer?.reflection && (
          <Section title={{ icon: '🌟', text: "Cosmic Reflection", color: VEDIC_COLORS.sacredOrange }}
            content={<div style={{ fontStyle: "italic" }}>{answer.reflection}</div>}
            gradient={SACRED_GRADIENTS.pure}
            borderColor={`${VEDIC_COLORS.sacredOrange}40`} />
        )}
      </div>
    );
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setChatLoading(true);
    setError(null);

    try {
      const resp = await fetch(`${API_BASE.replace(/\/$/, "")}/chat/intent`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-API-Key": API_KEY
        },
        body: JSON.stringify({ query: userMessage }),
      });
      const data = await resp.json();
      if (!resp.ok || data.error) {
        throw new Error(data.Message || data.error || "Chat request failed");
      }
      setChatMessages((prev) => [...prev, { type: "assistant", data: data }]);
    } catch (err) {
      setError(err.message || "Failed to get response from chat API. Please try again.");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      padding: ".5rem 0", position: "relative", overflow: "hidden" }}>
      {/* Static Mandala Background */}
      <div style={{ position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", width: "800px", height: "800px",
        opacity: "0.15", pointerEvents: "none", zIndex: 0 }}>
        <svg viewBox="0 0 600 600" style={{ width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id="mandala-gradient-chat" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
            </radialGradient>
          </defs>
          <circle cx="300" cy="300" r="140" fill="url(#mandala-gradient-chat)" />
          {[...Array(12)].map((_, i) => (
            <ellipse key={i} cx="300" cy="120" rx="40" ry="14"
              fill="rgba(251,191,36,0.1)"
              transform={`rotate(${(i / 12) * 360} 300 300)`} />
          ))}
        </svg>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 .5rem",
        position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "3.5rem", fontWeight: "700", color: "#fbbf24",
            marginBottom: "1rem" }}>Sacred Wisdom Guide</h2>
          <p style={{ color: "#cbd5e1", fontSize: "1.2rem", lineHeight: "1",
            fontWeight: "400", maxWidth: "500px", margin: "0 auto" }}>
            Discover the Eternal Wisdom of the Rig Veda through intelligent conversation
          </p>
        </div>

        <div style={{ background: "linear-gradient(135deg, rgba(30,41,59,0.98), rgba(51,65,85,0.95))",
          borderRadius: "24px", overflow: "hidden",
          boxShadow: "0 15px 50px rgba(251,191,36,0.15)",
          border: "2px solid rgba(251,191,36,0.15)", backdropFilter: "blur(10px)" }}>
          <div style={{ padding: "1rem", minHeight: "500px", maxHeight: "600px",
            display: "flex", flexDirection: "column", gap: ".5rem" }}>
            <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem",
              scrollbarWidth: "thin", scrollbarColor: `${VEDIC_COLORS.softGold} transparent` }}>
              {chatMessages.length === 0 && (
                <div style={{ textAlign: "center", marginTop: "1rem", padding: "3rem 2rem",
                  background: "linear-gradient(135deg, rgba(30,41,59,0.9), rgba(51,65,85,0.9))",
                  borderRadius: "20px", border: "2px dashed rgba(251,191,36,0.3)",
                  position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem",
                      filter: "drop-shadow(0 0 20px rgba(251, 191, 36, 0.3))" }}>🪷</div>
                    <div style={{ fontWeight: "700", marginBottom: "1rem",
                      color: "#fbbf24", fontSize: "1.5rem",
                      fontFamily: "'Crimson Pro', serif" }}>Welcome, Seeker of Wisdom</div>
                    <div style={{ fontSize: "1.1rem", color: "#14b8a6",
                      fontFamily: "'Inter', sans-serif", lineHeight: "1.8" }}>
                      Ask about sacred hymns, cosmic themes, or divine concepts...
                      <br />
                      <span style={{ fontSize: "1rem", fontStyle: "italic", color: "#94a3b8" }}>
                        "Give me slokas about life" • "Explain the hymn 10.12.9"
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {chatMessages.map((m, idx) => (
                <div key={idx}
                  style={{ display: "flex", justifyContent: m.type === "user" ? "flex-end" : "flex-start",
                    marginBottom: "1.5rem", animation: "messageAppear 0.5s ease-out" }}>
                  <div style={{
                    background: m.type === "user" 
                      ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" : "rgba(30,41,59,0.6)",
                    color: m.type === "user" ? "#0f172a" : "#f8fafc",
                    border: m.type === "user" 
                      ? "2px solid rgba(251,191,36,0.3)" : "2px solid rgba(251,191,36,0.15)",
                    padding: "1.25rem 1.75rem",
                    borderRadius: m.type === "user" ? "24px 24px 6px 24px" : "24px 24px 24px 6px",
                    maxWidth: "85%", whiteSpace: "pre-wrap",
                    boxShadow: m.type === "user"
                      ? "0 10px 30px rgba(251,191,36,0.3)" : "0 10px 30px rgba(0,0,0,0.3)",
                    fontFamily: m.type === "user" ? "'Inter', sans-serif" : "'Crimson Pro', serif",
                    fontSize: "1.05rem", lineHeight: "1.7", position: "relative",
                    overflow: "hidden", fontWeight: m.type === "user" ? "500" : "400" }}>
                    {m.type === "assistant" && (
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0,
                        height: "3px",
                        background: "linear-gradient(135deg, #fbbf24 0%, #14b8a6 100%)" }} />
                    )}
                    <div style={{ position: "relative", zIndex: 2 }}>
                      {m.type === "user" ? m.text : renderChatResponse(m.data || m.text)}
                    </div>
                  </div>
                </div>
              ))}
              
              {chatLoading && (
                <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "1.5rem" }}>
                  <div style={{ background: "rgba(30,41,59,0.6)",
                    border: "2px solid rgba(251,191,36,0.15)", padding: "1.25rem 1.75rem",
                    borderRadius: "24px 24px 24px 6px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)", display: "flex",
                    alignItems: "center", gap: "0.75rem" }}>
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%",
                        background: [VEDIC_COLORS.softGold, VEDIC_COLORS.mutedViolet,
                          VEDIC_COLORS.sacredOrange][i],
                        animation: `sacredPulse 1.5s ease-in-out infinite ${delay}s` }} />
                    ))}
                    <span style={{ color: "#14b8a6", fontStyle: "italic",
                      fontSize: "1rem", fontWeight: "500" }}>Channeling wisdom...</span>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div style={{ color: "#ef4444", textAlign: "center",
                background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.1))",
                border: "2px solid rgba(239,68,68,0.3)", borderRadius: "16px",
                padding: "1.25rem", fontFamily: "'Inter', sans-serif", fontWeight: "600",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.2rem" }}>⚠️</span>{error}
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem", padding: "1.25rem",
              background: "rgba(30,41,59,0.6)", borderRadius: "20px",
              border: "2px solid rgba(251,191,36,0.2)",
              boxShadow: "0 8px 32px rgba(251,191,36,0.1)", position: "relative",
              overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                background: "linear-gradient(135deg, #fbbf24 0%, #14b8a6 100%)",
                opacity: chatInput.trim() ? 1 : 0, transition: "opacity 0.3s ease" }} />
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <img src="/namaste.png" alt="Namaste" style={{ fontSize: "1.3rem", width: "1.5rem", height: "1.5rem",
                  filter: "drop-shadow(0 0 8px rgba(251, 191, 36, 0.3))" }} />
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleChatSend()}
                  placeholder="Ask about hymns, themes, or cosmic concepts..."
                  style={{ flex: 1, padding: "0.75rem 0", border: "none", outline: "none",
                    fontSize: "1.05rem", fontFamily: "'Inter', sans-serif",
                    color: "#f8fafc", background: "transparent", fontWeight: "500" }} />
              </div>
              <button onClick={handleChatSend} disabled={chatLoading || !chatInput.trim()}
                style={{ background: (chatLoading || !chatInput.trim()) ? "#64748b" 
                    : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                  color: (chatLoading || !chatInput.trim()) ? "#cbd5e1" : "#0f172a", border: "none", borderRadius: "50px", padding: "1rem 2rem",
                  cursor: (chatLoading || !chatInput.trim()) ? "not-allowed" : "pointer",
                  fontWeight: "700", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: (chatLoading || !chatInput.trim()) ? "none" 
                    : "0 10px 30px rgba(251,191,36,0.3)",
                  display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1rem",
                  whiteSpace: "nowrap" }}
                onMouseEnter={(e) => {
                  if (!chatLoading && chatInput.trim()) {
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow = "0 15px 40px rgba(251,191,36,0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = (chatLoading || !chatInput.trim()) 
                    ? "none" : "0 10px 30px rgba(251,191,36,0.3)";
                }}>
                {chatLoading ? <><span>🔄</span><span>Seeking...</span></> 
                  : <><span>✨</span><span>Send</span></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
