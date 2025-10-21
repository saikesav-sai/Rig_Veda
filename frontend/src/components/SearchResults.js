import { useRef, useState } from "react";
import { FaArrowLeft, FaPause, FaPlay } from "react-icons/fa";
import { API_BASE } from "../config";

// Mandala Background
const MandalaBackground = () => (
  <div style={{ position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)", width: "800px", height: "800px",
    opacity: "0.15", pointerEvents: "none", zIndex: 0 }}>
    <svg viewBox="0 0 600 600" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="mandala-gradient-results" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="140" fill="url(#mandala-gradient-results)" />
      {[...Array(12)].map((_, i) => (
        <ellipse key={i} cx="300" cy="120" rx="40" ry="14" fill="rgba(251,191,36,0.1)"
          transform={`rotate(${(i / 12) * 360} 300 300)`} />
      ))}
    </svg>
  </div>
);

// Intent configuration
const getIntentConfig = (intent) => {
  const configs = {
    semantic_search: { color: '#fbbf24', bg: '#1e293b', border: '#14b8a6',
      icon: '🔍', title: 'Semantic Search Results' },
    verse_lookup: { color: '#14b8a6', bg: '#1e293b', border: '#fbbf24',
      icon: '📖', title: 'Verse Lookup' },
    explanation: { color: '#f59e0b', bg: '#1e293b', border: '#14b8a6',
      icon: '💡', title: 'Explanation' },
    default: { color: '#fbbf24', bg: '#1e293b', border: '#14b8a6',
      icon: '💬', title: 'Search Results' }
  };
  return configs[intent] || configs.default;
};

// Audio Button Component
const AudioButton = ({ verse, playingAudio, audioLoading, toggleAudio }) => {
  const isLoading = audioLoading === verse.location;
  const isPlaying = playingAudio === verse.location;
  
  return (
    <button onClick={() => toggleAudio(verse)} disabled={isLoading}
      style={{ display: "flex", alignItems: "center", gap: "0.75rem",
        background: isPlaying 
          ? "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)" 
          : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        color: isPlaying ? "#f8fafc" : "#0f172a", border: "none", padding: "1rem 1.75rem", borderRadius: "50px",
        fontWeight: "700", cursor: isLoading ? "not-allowed" : "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", fontSize: "1rem",
        minWidth: "120px", justifyContent: "center",
        boxShadow: isPlaying ? "0 10px 30px rgba(220,38,38,0.4)" 
          : "0 10px 30px rgba(251,191,36,0.4)" }}>
      {isLoading ? (
        <>
          <div style={{ width: "14px", height: "14px", border: "2px solid #ffffff40",
            borderTop: "2px solid white", borderRadius: "50%",
            animation: "spin 1s linear infinite" }} />
          Loading...
        </>
      ) : isPlaying ? (
        <><FaPause size={14} />Pause</>
      ) : (
        <><FaPlay size={14} />Play</>
      )}
    </button>
  );
};

// Verse Card Component
const VerseCard = ({ verse, index, playingAudio, audioLoading, toggleAudio }) => (
  <div key={verse.location || index}
    style={{ background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", borderRadius: "24px", padding: "2.5rem",
      boxShadow: "0 15px 50px rgba(0,0,0,0.3)", border: "2px solid rgba(251,191,36,0.2)",
      position: "relative", transition: "all 0.3s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
      <h4 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "800",
        background: "linear-gradient(135deg, #fbbf24 0%, #14b8a6 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        display: "flex", alignItems: "center", gap: "0.5rem" }}>
        📍 {verse.location}
        {verse.confidence && verse.confidence >= 0.15 && (
          <span style={{
            background: verse.confidence >= 0.35 
              ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" 
              : verse.confidence >= 0.25 
              ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" 
              : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            color: "white", padding: "0.4rem 1rem", borderRadius: "50px",
            fontSize: "0.75rem", fontWeight: "700", display: "inline-flex",
            alignItems: "center", gap: "0.4rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            {verse.confidence >= 0.35 ? "🎯 Highly Relevant" : 
             verse.confidence >= 0.25 ? "⭐ Very Relevant" : "✨ Relevant"}
          </span>
        )}
      </h4>
      <AudioButton verse={verse} playingAudio={playingAudio} audioLoading={audioLoading}
        toggleAudio={toggleAudio} />
    </div>

    {verse.sanskrit && (
      <div style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(20,184,166,0.1))",
        border: "3px solid rgba(251,191,36,0.3)", borderRadius: "20px", padding: "2rem",
        marginBottom: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1rem", color: "#fbbf24",
          fontWeight: "700", fontSize: "0.9rem", letterSpacing: "1px" }}>
          🕉️ SANSKRIT TEXT 🕉️
        </div>
        <p style={{ fontSize: "1.5rem", textAlign: "center", color: "#f8fafc",
          lineHeight: "2", fontFamily: "'Noto Serif Devanagari', serif",
          fontWeight: "600", margin: 0 }}>{verse.sanskrit}</p>
      </div>
    )}

    {verse.transliteration && (
      <div style={{ background: "rgba(15,23,42,0.6)", borderRadius: "12px", padding: "1.5rem",
        marginBottom: "2rem", border: "1px solid rgba(251,191,36,0.2)" }}>
        <span style={{ color: "#fbbf24", fontSize: "0.9rem", fontWeight: "700",
          letterSpacing: "0.5px" }}>Transliteration</span>
        <p style={{ fontSize: "1.1rem", color: "#cbd5e1", fontStyle: "italic",
          marginTop: "0.8rem", lineHeight: "1.6", margin: "0.8rem 0 0 0" }}>
          {verse.transliteration}
        </p>
      </div>
    )}

    {verse.translation && (
      <div style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(13,148,136,0.15))",
        border: "3px solid rgba(20,184,166,0.4)", borderRadius: "20px", padding: "2rem" }}>
        <span style={{ color: "#14b8a6", fontSize: "1rem", fontWeight: "700",
          letterSpacing: "0.5px" }}>ENGLISH TRANSLATION</span>
        <p style={{ fontSize: "1.2rem", color: "#f8fafc", lineHeight: "1.8",
          fontStyle: "italic", marginTop: "1rem", margin: "1rem 0 0 0" }}>
          "{verse.translation}"
        </p>
      </div>
    )}

    {verse.translations && Object.keys(verse.translations).filter(key => key.toLowerCase() !== 'griffith').length > 0 && (
      <div style={{ borderTop: "2px solid rgba(251,191,36,0.3)", paddingTop: "2rem", marginTop: "2rem" }}>
        <div style={{ fontSize: "1rem", fontWeight: "700", color: "#fbbf24",
          marginBottom: "1rem", letterSpacing: "0.5px" }}>📖 Alternative Translations</div>
        {Object.entries(verse.translations)
          .filter(([key]) => key.toLowerCase() !== 'griffith')
          .map(([translator, translation]) => (
          <div key={translator}
            style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.6))",
              borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem",
              border: "1px solid rgba(20,184,166,0.3)" }}>
            <div style={{ fontWeight: "700", color: "#14b8a6", marginBottom: "0.75rem",
              textTransform: "capitalize", fontSize: "0.95rem" }}>{translator}:</div>
            <div style={{ color: "#cbd5e1", fontStyle: "italic", lineHeight: "1.6",
              fontSize: "1.05rem" }}>"{translation}"</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Summary Section Component
const SummarySection = ({ answer, summary, config }) => {
  if (!answer && !summary) return null;
  
  return (
    <div style={{ background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
      borderRadius: "24px", padding: "2.5rem", marginBottom: "3rem",
      boxShadow: "0 15px 50px rgba(0,0,0,0.4)",
      border: `2px solid ${config.border}`, backdropFilter: "blur(10px)" }}>
      <h3 style={{ color: config.color, marginBottom: "1.5rem", fontSize: "1.8rem",
        fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        🤖 {answer ? 'AI Analysis' : 'Search Summary'}
      </h3>

      {(answer?.summary || summary) && (
        <div style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(20,184,166,0.1))",
          border: `2px solid ${config.border}`, borderRadius: "16px", padding: "1.75rem",
          marginBottom: answer?.interpretation || answer?.reflection ? "1.5rem" : "0" }}>
          <div style={{ fontWeight: "700", color: config.color, marginBottom: "0.75rem",
            fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            📝 Summary
          </div>
          <div style={{ lineHeight: "1.8", fontSize: "1.1rem", color: "#f8fafc" }}>
            {answer?.summary || summary}
          </div>
        </div>
      )}

      {answer?.interpretation && (
        <div style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(13,148,136,0.15))",
          border: "2px solid rgba(20,184,166,0.4)", borderRadius: "16px", padding: "1.75rem",
          marginBottom: answer?.reflection ? "1.5rem" : "0" }}>
          <div style={{ fontWeight: "700", color: "#14b8a6", marginBottom: "0.75rem",
            fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            🎯 Interpretation
          </div>
          <div style={{ lineHeight: "1.8", fontSize: "1.1rem", color: "#f8fafc" }}>
            {answer.interpretation}
          </div>
        </div>
      )}

      {answer?.reflection && (
        <div style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.15))",
          border: "2px solid rgba(245,158,11,0.4)", borderRadius: "16px", padding: "1.75rem" }}>
          <div style={{ fontWeight: "700", color: "#f59e0b", marginBottom: "0.75rem",
            fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            🔮 Reflection
          </div>
          <div style={{ lineHeight: "1.8", fontSize: "1.1rem", color: "#f8fafc" }}>
            {answer.reflection}
          </div>
        </div>
      )}
    </div>
  );
};

export default function SearchResults({ results, onBack }) {
  const [playingAudio, setPlayingAudio] = useState(null);
  const [audioLoading, setAudioLoading] = useState(null);
  const [audioError, setAudioError] = useState(null);
  const audioRefs = useRef({});

  if (!results) return null;

  const { answer, slokas, verses, summary } = results;
  const displayVerses = slokas || verses || [];
  const intentUsed = answer?.intent_used || results.intent || "semantic_search";
  const config = getIntentConfig(intentUsed);

  const getAudioUrl = (location) => {
    if (!location) return null;
    const parts = location.split('.');
    if (parts.length !== 3) return null;
    return `${API_BASE}/audio/${parseInt(parts[0])}/${parseInt(parts[1])}/${parseInt(parts[2])}`;
  };

  const toggleAudio = async (verse) => {
    const audioId = verse.location;
    const audioUrl = getAudioUrl(verse.location);
    
    if (!audioUrl) {
      setAudioError(`Audio not available for ${verse.location}`);
      return;
    }

    if (playingAudio === audioId) {
      audioRefs.current[audioId]?.pause();
      setPlayingAudio(null);
      return;
    }

    if (playingAudio && audioRefs.current[playingAudio]) {
      audioRefs.current[playingAudio].pause();
    }

    setAudioLoading(audioId);
    setAudioError(null);

    try {
      if (!audioRefs.current[audioId]) {
        const audio = new Audio(audioUrl);
        audioRefs.current[audioId] = audio;
        audio.addEventListener('ended', () => { setPlayingAudio(null); setAudioLoading(null); });
        audio.addEventListener('error', () => {
          setAudioError(`Failed to load audio for ${verse.location}`);
          setAudioLoading(null);
          setPlayingAudio(null);
        });
      }
      await audioRefs.current[audioId].play();
      setPlayingAudio(audioId);
      setAudioLoading(null);
    } catch (error) {
      setAudioError(`Failed to play audio for ${verse.location}`);
      setAudioLoading(null);
      setPlayingAudio(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      padding: "2rem 0", position: "relative", overflow: "hidden" }}>
      <MandalaBackground />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem",
        position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem",
          gap: "1rem", flexWrap: "wrap" }}>
          <button onClick={onBack}
            style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
              color: "#0f172a", border: "none", borderRadius: "50px", padding: "1rem 2rem",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem",
              fontWeight: "700", fontSize: "1.05rem",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 10px 30px rgba(251,191,36,0.4)" }}>
            <FaArrowLeft /> Back to Search
          </button>
          <div>
            <h2 style={{ margin: 0, color: "#fbbf24", fontSize: "2rem", fontWeight: "700" }}>
              {config.icon} {config.title}
            </h2>
          </div>
        </div>

        {audioError && (
          <div style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.2), rgba(153,27,27,0.15))",
            border: "2px solid rgba(220,38,38,0.5)", borderRadius: "16px",
            padding: "1.25rem 1.5rem", marginBottom: "2rem", display: "flex",
            alignItems: "center", gap: "0.75rem", color: "#fca5a5", fontWeight: "600",
            boxShadow: "0 4px 12px rgba(220,38,38,0.3)" }}>
            <span style={{ fontSize: "1.5rem" }}>⚠️</span>
            <span style={{ flex: 1 }}>{audioError}</span>
            <button onClick={() => setAudioError(null)}
              style={{ background: "none", border: "none", color: "#fca5a5",
                cursor: "pointer", fontSize: "1.5rem", padding: "0.2rem",
                fontWeight: "bold", transition: "transform 0.2s" }}>×</button>
          </div>
        )}

        <SummarySection answer={answer} summary={summary} config={config} />

        {displayVerses && displayVerses.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
              <h3 style={{ color: "#fbbf24", margin: 0, fontSize: "1.8rem", fontWeight: "700" }}>
                📚 Found {displayVerses.length} {displayVerses.length === 1 ? 'Verse' : 'Verses'}
              </h3>
            </div>
            <div style={{ display: "grid", gap: "2rem" }}>
              {displayVerses.map((verse, index) => (
                <VerseCard key={verse.location || index} verse={verse} index={index}
                  playingAudio={playingAudio} audioLoading={audioLoading}
                  toggleAudio={toggleAudio} />
              ))}
            </div>
          </div>
        )}

        {(!displayVerses || displayVerses.length === 0) && !answer && !summary && (
          <div style={{ textAlign: "center",
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            padding: "4rem 2rem", borderRadius: "24px",
            boxShadow: "0 15px 50px rgba(0,0,0,0.4)",
            border: "2px solid rgba(251,191,36,0.3)", backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🔍</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.75rem",
              color: "#fbbf24" }}>No results found</div>
            <div style={{ fontSize: "1.1rem", color: "#cbd5e1", lineHeight: "1.6" }}>
              Try different keywords or explore our suggested themes!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
