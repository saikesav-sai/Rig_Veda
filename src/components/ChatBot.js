import { useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { API_BASE } from "../config";

// 🪷 Vedic Color Palette & Sacred Styling
const VEDIC_COLORS = {
  deepIndigo: '#1e1b4b',     // Primary sacred color
  softGold: '#f59e0b',       // Divine accent
  ivoryWhite: '#fefce8',     // Pure background
  mutedViolet: '#8b5cf6',    // Gentle accent
  cosmicBlue: '#3730a3',     // Depth and wisdom
  sacredOrange: '#fb923c',   // Fire of knowledge
  etherealPurple: '#a855f7', // Spiritual elevation
  earthyBeige: '#fef3c7',    // Grounding
  divineGlow: 'rgba(245, 158, 11, 0.1)' // Subtle radiance
};

const SACRED_GRADIENTS = {
  cosmic: `linear-gradient(135deg, ${VEDIC_COLORS.deepIndigo} 0%, ${VEDIC_COLORS.cosmicBlue} 50%, ${VEDIC_COLORS.mutedViolet} 100%)`,
  divine: `linear-gradient(135deg, ${VEDIC_COLORS.softGold} 0%, ${VEDIC_COLORS.sacredOrange} 100%)`,
  pure: `linear-gradient(135deg, ${VEDIC_COLORS.ivoryWhite} 0%, #ffffff 100%)`,
  wisdom: `linear-gradient(135deg, ${VEDIC_COLORS.etherealPurple} 0%, ${VEDIC_COLORS.mutedViolet} 100%)`
};

export default function ChatBot() {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [audioLoading, setAudioLoading] = useState(null);
  const audioRefs = useRef({});

  // Audio control functions
  const getAudioUrl = (location) => {
    if (!location) return null;
    // Parse location format: "01.001.01" -> mandala=1, hymn=1, stanza=1
    const parts = location.split('.');
    if (parts.length !== 3) return null;
    
    const mandala = parseInt(parts[0]);
    const hymn = parseInt(parts[1]);
    const stanza = parseInt(parts[2]);
    
    return `${API_BASE}/audio/${mandala}/${hymn}/${stanza}`;
  };

  const toggleAudio = async (location) => {
    const audioUrl = getAudioUrl(location);
    
    if (!audioUrl) {
      return;
    }

    // If this audio is currently playing, pause it
    if (playingAudio === location) {
      if (audioRefs.current[location]) {
        audioRefs.current[location].pause();
        setPlayingAudio(null);
      }
      return;
    }

    // Stop any currently playing audio
    if (playingAudio && audioRefs.current[playingAudio]) {
      audioRefs.current[playingAudio].pause();
    }

    setAudioLoading(location);

    try {
      // Create audio element if it doesn't exist
      if (!audioRefs.current[location]) {
        const audio = new Audio(audioUrl);
        audioRefs.current[location] = audio;

        audio.addEventListener('ended', () => {
          setPlayingAudio(null);
          setAudioLoading(null);
        });

        audio.addEventListener('error', () => {
          setAudioLoading(null);
          setPlayingAudio(null);
        });
      }

      // Play the audio
      await audioRefs.current[location].play();
      setPlayingAudio(location);
      setAudioLoading(null);

    } catch (error) {
      setAudioLoading(null);
      setPlayingAudio(null);
    }
  };

  // 🪷 Sacred Response Renderer
  const renderChatResponse = (data) => {
    if (typeof data === "string") {
      return (
        <div style={{ 
          fontFamily: "'Crimson Pro', 'Noto Serif', serif",
          lineHeight: "1.7",
          color: VEDIC_COLORS.deepIndigo
        }}>
          {data}
        </div>
      );
    }

  const { answer, slokas } = data;
    const intentUsed = answer?.intent_used || "general";
    const config = getIntentConfig(intentUsed);

    return (
      <div style={{ 
        maxWidth: "100%",
        fontFamily: "'Inter', sans-serif"
      }}>
        {/* Sacred Intent Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: SACRED_GRADIENTS.divine,
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "20px",
          fontSize: "0.8rem",
          fontWeight: "600",
          marginBottom: "1rem",
          boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
          border: `1px solid ${VEDIC_COLORS.softGold}30`
        }}>
          <span>{config.symbol}</span>
          <span>{config.title}</span>
        </div>


        {/* Sacred Verses */}
        {slokas && slokas.length > 0 && (
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ 
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
              justifyContent: "center"
            }}>
              <div style={{
                width: "30px",
                height: "2px",
                background: SACRED_GRADIENTS.divine
              }} />
              <span style={{
                fontSize: "1.1rem", 
                fontWeight: "600", 
                color: VEDIC_COLORS.deepIndigo,
                fontFamily: "'Crimson Pro', serif"
              }}>
                🪷 Sacred Verses ({slokas.length})
              </span>
              <div style={{
                width: "30px",
                height: "2px",
                background: SACRED_GRADIENTS.divine
              }} />
            </div>
            {slokas.slice(0, 2).map((sloka, idx) => (
              <div key={idx} style={{
                background: SACRED_GRADIENTS.pure,
                border: `1px solid ${VEDIC_COLORS.softGold}30`,
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "0.75rem",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "40px",
                  height: "40px",
                  background: `${VEDIC_COLORS.softGold}10`,
                  borderRadius: "0 12px 0 40px"
                }} />
                <div style={{ 
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                  gap: "0.5rem"
                }}>
                  <div style={{ 
                    fontWeight: "600", 
                    color: VEDIC_COLORS.cosmicBlue, 
                    fontSize: "0.9rem"
                  }}>
                    🕉️ {sloka.location}
                  </div>
                  <button
                    onClick={() => toggleAudio(sloka.location)}
                    disabled={audioLoading === sloka.location}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      background: playingAudio === sloka.location 
                        ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" 
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      cursor: audioLoading === sloka.location ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: playingAudio === sloka.location
                        ? "0 4px 12px rgba(239,68,68,0.3)"
                        : "0 4px 12px rgba(102,126,234,0.3)",
                      opacity: audioLoading === sloka.location ? 0.7 : 1
                    }}
                  >
                    {audioLoading === sloka.location ? (
                      <>
                        <div style={{
                          width: "10px",
                          height: "10px",
                          border: "2px solid #ffffff40",
                          borderTop: "2px solid white",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite"
                        }} />
                        <span>Loading...</span>
                      </>
                    ) : playingAudio === sloka.location ? (
                      <>
                        <FaPause size={10} />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <FaPlay size={10} />
                        <span>Play</span>
                      </>
                    )}
                  </button>
                </div>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                <div className="sanskrit-text" style={{
                  fontSize: "1rem",
                  fontStyle: "italic",
                  color: VEDIC_COLORS.mutedViolet,
                  marginBottom: "0.5rem",
                  fontFamily: "'Noto Serif Devanagari', serif",
                  lineHeight: "1.8",
                  textAlign: "center",
                  padding: "0.5rem 0"
                }}>
                  {sloka.sanskrit}
                </div>
                <div style={{ 
                  lineHeight: "1.6",
                  color: VEDIC_COLORS.deepIndigo,
                  fontSize: "0.95rem",
                  fontFamily: "'Crimson Pro', serif"
                }}>
                  {sloka.meaning}
                </div>
              </div>
            ))}
            {slokas.length > 2 && (
              <div style={{ 
                fontSize: "0.85rem", 
                color: VEDIC_COLORS.mutedViolet, 
                fontStyle: "italic",
                textAlign: "center",
                marginTop: "0.5rem"
              }}>
                ✨ ... and {slokas.length - 2} more sacred verses await
              </div>
            )}
          </div>
        )}
        {/* Sacred Summary */}
        {answer?.summary && (
          <div style={{
            background: SACRED_GRADIENTS.pure,
            border: `2px solid ${VEDIC_COLORS.softGold}40`,
            borderRadius: "16px",
            padding: "1.25rem",
            marginBottom: "1rem",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Divine Glow Effect */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: SACRED_GRADIENTS.divine
            }} />
            <div style={{ 
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem"
            }}>
              <span style={{ fontSize: "1.2rem" }}>📜</span>
              <strong style={{ 
                color: VEDIC_COLORS.cosmicBlue,
                fontFamily: "'Crimson Pro', serif",
                fontSize: "1.1rem"
              }}>Sacred Summary</strong>
            </div>
            <div style={{ 
              lineHeight: "1.7", 
              color: VEDIC_COLORS.deepIndigo,
              fontFamily: "'Crimson Pro', serif",
              fontSize: "1.05rem"
            }}>
              {answer.summary}
            </div>
          </div>
        )}

        {/* Divine Interpretation */}
        {answer?.interpretation && (
          <div style={{
            background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)",
            border: `2px solid ${VEDIC_COLORS.mutedViolet}40`,
            borderRadius: "16px",
            padding: "1.25rem",
            marginBottom: "1rem",
            position: "relative"
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: SACRED_GRADIENTS.wisdom
            }} />
            <div style={{ 
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem"
            }}>
              <span style={{ fontSize: "1.2rem" }}>🔮</span>
              <strong style={{ 
                color: VEDIC_COLORS.mutedViolet,
                fontFamily: "'Crimson Pro', serif",
                fontSize: "1.1rem"
              }}>Divine Interpretation</strong>
            </div>
            <div style={{ 
              lineHeight: "1.7", 
              color: VEDIC_COLORS.deepIndigo,
              fontFamily: "'Crimson Pro', serif",
              fontSize: "1.05rem"
            }}>
              {answer.interpretation}
            </div>
          </div>
        )}

        {/* Cosmic Reflection */}
        {answer?.reflection && (
          <div style={{
            background: "linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)",
            border: `2px solid ${VEDIC_COLORS.sacredOrange}40`,
            borderRadius: "16px",
            padding: "1.25rem",
            marginBottom: "1rem",
            position: "relative"
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: SACRED_GRADIENTS.divine
            }} />
            <div style={{ 
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem"
            }}>
              <span style={{ fontSize: "1.2rem" }}>🌟</span>
              <strong style={{ 
                color: VEDIC_COLORS.sacredOrange,
                fontFamily: "'Crimson Pro', serif",
                fontSize: "1.1rem"
              }}>Cosmic Reflection</strong>
            </div>
            <div style={{ 
              lineHeight: "1.7", 
              color: VEDIC_COLORS.deepIndigo,
              fontFamily: "'Crimson Pro', serif",
              fontSize: "1.05rem",
              fontStyle: "italic"
            }}>
              {answer.reflection}
            </div>
          </div>
        )}

        
      </div>
    );
  };

  // 🕉️ Sacred Intent Styling
  const getIntentConfig = (intent) => {
    switch (intent) {
      case 'semantic_search': 
        return { 
          color: VEDIC_COLORS.cosmicBlue, 
          bg: VEDIC_COLORS.divineGlow,
          icon: '🔍', 
          symbol: '🌌',
          title: 'Cosmic Search'
        };
      case 'verse_lookup': 
        return { 
          color: VEDIC_COLORS.sacredOrange, 
          bg: VEDIC_COLORS.earthyBeige,
          icon: '📿', 
          symbol: '🪷',
          title: 'Sacred Verse'
        };
      case 'explanation': 
        return { 
          color: VEDIC_COLORS.etherealPurple, 
          bg: '#f3e8ff',
          icon: '💫', 
          symbol: '🕉️',
          title: 'Divine Wisdom'
        };
      case 'general': 
        return { 
          color: VEDIC_COLORS.mutedViolet, 
          bg: VEDIC_COLORS.ivoryWhite,
          icon: '🙏', 
          symbol: '✨',
          title: 'Sacred Dialogue'
        };
      default: 
        return { 
          color: VEDIC_COLORS.deepIndigo, 
          bg: VEDIC_COLORS.ivoryWhite,
          icon: '🙏', 
          symbol: '✨',
          title: 'Sacred Dialogue'
        };
    }
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage }),
      });
      const data = await resp.json();
      if (!resp.ok || data.error) {
        const errorMessage = data.Message || data.error || "Chat request failed";
        throw new Error(errorMessage);
      }

      setChatMessages((prev) => [
        ...prev,
        { type: "assistant", data: data },
      ]);
    } catch (err) {
      setError(err.message || "Failed to get response from chat API. Please try again.");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #fefce8 0%, #fff7ed 50%, #fef3c7 100%)", 
      padding: ".5rem 0",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Static Mandala Background */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "800px",
        height: "800px",
        opacity: "0.15",
        pointerEvents: "none",
        zIndex: 0
      }}>
        <svg viewBox="0 0 600 600" style={{
          width: "100%",
          height: "100%"
        }}>
          <defs>
            <radialGradient id="mandala-gradient-chat" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#764ba2" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f093fb" stopOpacity="0.05" />
            </radialGradient>
          </defs>
          <circle cx="300" cy="300" r="140" fill="url(#mandala-gradient-chat)" />
          {[...Array(12)].map((_, i) => (
            <ellipse 
              key={i} 
              cx="300" 
              cy="120" 
              rx="40" 
              ry="14" 
              fill="rgba(118,75,162,0.1)" 
              transform={`rotate(${(i / 12) * 360} 300 300)`} 
            />
          ))}
        </svg>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 .5rem", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <div style={{
            fontSize: "1rem",
            marginBottom: "0.5rem",
            filter: "drop-shadow(0 0 10px rgba(245, 158, 11, 0.5))"
          }}></div>
          <h2 style={{ 
            fontSize: "3.5rem", 
            fontWeight: "700", 
            color: "#1e1b4b",
            marginBottom: "1rem"
            
          }}>
            Sacred Wisdom Guide
          </h2>
          <p style={{ color: "#475569", fontSize: "1.2rem", lineHeight: "1", fontWeight: "400", maxWidth: "500px", margin: "0 auto" }}>
            Discover the Eternal Wisdom of the Rig Veda through intelligent conversation
          </p>
        </div>

        {/* Chat Container */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(254,252,232,0.95))",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 15px 50px rgba(102,126,234,0.15)",
          border: "2px solid rgba(102,126,234,0.15)",
          backdropFilter: "blur(10px)"
        }}>
          {/* 🪷 Sacred Chat Area */}
          <div style={{
            padding: "1rem",
            minHeight: "500px",
            maxHeight: "600px",
            display: "flex",
            flexDirection: "column",
            gap: ".5rem"
          }}>
            <div style={{ 
              flex: 1, 
              overflowY: "auto", 
              padding: "0.5rem",
              scrollbarWidth: "thin",
              scrollbarColor: `${VEDIC_COLORS.softGold} transparent`
            }}>
              {chatMessages.length === 0 && (
                <div style={{ 
                  textAlign: "center", 
                  marginTop: "1rem",
                  padding: "3rem 2rem",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(254,252,232,0.9))",
                  borderRadius: "20px",
                  border: `2px dashed rgba(102,126,234,0.3)`,
                  position: "relative",
                  overflow: "hidden"
                }}>
                 
                  
                  
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ 
                      fontSize: "3rem", 
                      marginBottom: "1rem",
                      filter: "drop-shadow(0 0 20px rgba(245, 158, 11, 0.3))"
                    }}>🪷</div>
                    <div style={{ 
                      fontWeight: "700", 
                      marginBottom: "1rem",
                      color: VEDIC_COLORS.deepIndigo,
                      fontSize: "1.5rem",
                      fontFamily: "'Crimson Pro', serif"
                    }}>
                      Welcome, Seeker of Wisdom
                    </div>
                    <div style={{ 
                      fontSize: "1.1rem",
                      color: VEDIC_COLORS.mutedViolet,
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: "1.8"
                    }}>
                      Ask about sacred hymns, cosmic themes, or divine concepts...
                      <br />
                      <span style={{ fontSize: "1rem", fontStyle: "italic", color: "#6b7280" }}>
                        "What is Agni's cosmic role?" • "Explain the creation hymn 10.12.9"
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: m.type === "user" ? "flex-end" : "flex-start",
                    marginBottom: "1.5rem",
                    animation: "messageAppear 0.5s ease-out"
                  }}
                >
                  <div
                    style={{
                      background: m.type === "user" 
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : "white",
                      color: m.type === "user" ? "white" : VEDIC_COLORS.deepIndigo,
                      border: m.type === "user" 
                        ? "2px solid rgba(102,126,234,0.3)"
                        : "2px solid rgba(102,126,234,0.15)",
                      padding: "1.25rem 1.75rem",
                      borderRadius: m.type === "user" 
                        ? "24px 24px 6px 24px" 
                        : "24px 24px 24px 6px",
                      maxWidth: "85%",
                      whiteSpace: "pre-wrap",
                      boxShadow: m.type === "user"
                        ? "0 10px 30px rgba(102,126,234,0.3)"
                        : "0 10px 30px rgba(0,0,0,0.08)",
                      fontFamily: m.type === "user" 
                        ? "'Inter', sans-serif" 
                        : "'Crimson Pro', serif",
                      fontSize: m.type === "user" ? "1.05rem" : "1.05rem",
                      lineHeight: "1.7",
                      position: "relative",
                      overflow: "hidden",
                      fontWeight: m.type === "user" ? "500" : "400"
                    }}
                  >
                    {/* Message Glow Effect */}
                    {m.type === "assistant" && (
                      <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      }} />
                    )}
                    
                    <div style={{ position: "relative", zIndex: 2 }}>
                      {m.type === "user" ? m.text : renderChatResponse(m.data || m.text)}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {chatLoading && (
                <div style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginBottom: "1.5rem"
                }}>
                  <div style={{
                    background: "white",
                    border: "2px solid rgba(102,126,234,0.15)",
                    padding: "1.25rem 1.75rem",
                    borderRadius: "24px 24px 24px 6px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem"
                  }}>
                    <div style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: VEDIC_COLORS.softGold,
                      animation: "sacredPulse 1.5s ease-in-out infinite"
                    }} />
                    <div style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: VEDIC_COLORS.mutedViolet,
                      animation: "sacredPulse 1.5s ease-in-out infinite 0.2s"
                    }} />
                    <div style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: VEDIC_COLORS.sacredOrange,
                      animation: "sacredPulse 1.5s ease-in-out infinite 0.4s"
                    }} />
                    <span style={{
                      color: VEDIC_COLORS.mutedViolet,
                      fontStyle: "italic",
                      fontSize: "1rem",
                      fontWeight: "500"
                    }}>
                      Channeling wisdom...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div style={{ 
                color: "#dc2626",
                textAlign: "center",
                background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(220,38,38,0.05))",
                border: "2px solid rgba(239,68,68,0.3)",
                borderRadius: "16px",
                padding: "1.25rem",
                fontFamily: "'Inter', sans-serif",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}>
                <span style={{ fontSize: "1.2rem" }}>⚠️</span>
                {error}
              </div>
            )}

            {/* 🙏 Sacred Input Area */}
            <div style={{ 
              display: "flex", 
              gap: "1rem",
              padding: "1.25rem",
              background: "white",
              borderRadius: "20px",
              border: "2px solid rgba(102,126,234,0.2)",
              boxShadow: "0 8px 32px rgba(102,126,234,0.1)",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Input Glow Effect */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                opacity: chatInput.trim() ? 1 : 0,
                transition: "opacity 0.3s ease"
              }} />
              
              <div style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}>
                <span style={{
                  fontSize: "1.3rem",
                  filter: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.3))"
                }}>
                  🙏
                </span>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleChatSend()}
                  placeholder="Ask about hymns, themes, or cosmic concepts..."
                  style={{ 
                    flex: 1,
                    padding: "0.75rem 0",
                    border: "none",
                    outline: "none",
                    fontSize: "1.05rem",
                    fontFamily: "'Inter', sans-serif",
                    color: VEDIC_COLORS.deepIndigo,
                    background: "transparent",
                    fontWeight: "500"
                  }}
                />
              </div>
              
              <button
                onClick={handleChatSend}
                disabled={chatLoading || !chatInput.trim()}
                style={{
                  background: (chatLoading || !chatInput.trim()) 
                    ? "#9ca3af" 
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "50px",
                  padding: "1rem 2rem",
                  cursor: (chatLoading || !chatInput.trim()) ? "not-allowed" : "pointer",
                  fontWeight: "700",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: (chatLoading || !chatInput.trim()) 
                    ? "none" 
                    : "0 10px 30px rgba(102,126,234,0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "1rem",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  if (!chatLoading && chatInput.trim()) {
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow = "0 15px 40px rgba(102,126,234,0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = (chatLoading || !chatInput.trim()) 
                    ? "none" 
                    : "0 10px 30px rgba(102,126,234,0.3)";
                }}
              >
                {chatLoading ? (
                  <>
                    <span>🔄</span>
                    <span>Seeking...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
