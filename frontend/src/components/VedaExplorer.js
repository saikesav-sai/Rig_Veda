import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaBolt, FaBookOpen, FaCheck, FaChevronDown, FaChevronUp, FaCompress, FaExpand, FaGripHorizontal, FaQuoteLeft, FaSearch } from "react-icons/fa";
import { API_BASE, API_KEY } from "../config";

// Cache for index data to avoid refetching
const indexCache = new Map();

// Common styles
const STYLES = {
  card: { background: "linear-gradient(135deg, rgba(30,41,59,0.98), rgba(51,65,85,0.95))",
    borderRadius: "24px", padding: "2.5rem", boxShadow: "0 15px 50px rgba(251,191,36,0.15)",
    border: "2px solid rgba(251,191,36,0.15)", marginBottom: "3rem", backdropFilter: "blur(10px)" },
  btn: { padding: "1rem 2rem", background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
    color: "#0f172a", border: "none", borderRadius: "16px", fontWeight: "700", cursor: "pointer",
    fontSize: "1.1rem", boxShadow: "0 8px 20px rgba(251, 191, 36, 0.4)", transition: "all 0.3s" },
  input: { flex: 1, padding: "1rem 1.5rem", border: "2px solid rgba(251,191,36,0.3)", borderRadius: "16px",
    fontSize: "1.1rem", fontWeight: "600", outline: "none", transition: "all 0.3s", background: "rgba(15,23,42,0.6)", color: "#f8fafc" }
};

// Searchable Dropdown
const SearchableDropdown = ({ label, value, placeholder, options, onSelect, searchValue,
  onSearchChange, isOpen, setIsOpen, disabled, dropdownRef, renderOption, helpText }) => (
  <div style={{ flex: "1 1 250px" }} ref={dropdownRef}>
    {label && <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600",
      color: "#cbd5e1", fontSize: "0.9rem" }}>{label}</label>}
    <div style={{ position: "relative" }}>
      <div onClick={() => !disabled && setIsOpen(!isOpen)} style={{
        width: "100%", padding: "0.75rem", border: `2px solid ${disabled ? '#64748b' : isOpen ? '#fbbf24' : 'rgba(251,191,36,0.3)'}`,
        borderRadius: "12px", cursor: disabled ? "not-allowed" : "pointer", display: "flex",
        justifyContent: "space-between", alignItems: "center", transition: "all 0.2s", background: "rgba(15,23,42,0.6)" }}>
        <span style={{ color: value ? "#f8fafc" : "#94a3b8" }}>{value || placeholder}</span>
        {!disabled && (isOpen ? <FaChevronUp color="#cbd5e1" /> : <FaChevronDown color="#cbd5e1" />)}
      </div>
      {isOpen && !disabled && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "rgba(30,41,59,0.98)",
          border: "2px solid #fbbf24", borderTop: "none", borderRadius: "0 0 12px 12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)", zIndex: 1000, maxHeight: "200px", overflow: "hidden" }}>
          <div style={{ padding: "0.75rem", borderBottom: "1px solid rgba(251,191,36,0.3)", background: "rgba(15,23,42,0.8)" }}>
            <FaSearch style={{ position: "absolute", left: "1.5rem", top: "1.25rem", color: "#fbbf24" }} />
            <input type="text" placeholder="Search..." value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)} autoFocus
              style={{ width: "100%", padding: "0.5rem 0.5rem 0.5rem 2.5rem", border: "1px solid rgba(251,191,36,0.3)",
                borderRadius: "8px", fontSize: "0.9rem", outline: "none", background: "rgba(15,23,42,0.6)", color: "#f8fafc" }} />
          </div>
          <div style={{ maxHeight: "150px", overflowY: "auto", padding: "0.25rem" }}>
            {options.length === 0 ? (
              <div style={{ padding: "1rem", textAlign: "center", color: "#94a3b8" }}>No matches</div>
            ) : (
              // Only render first 100 items for performance
              options.slice(0, 100).map((option, i) => (
                <div key={i} onClick={() => onSelect(option)} style={{
                  padding: "0.5rem", cursor: "pointer", borderRadius: "8px", transition: "background 0.15s", color: "#f8fafc" }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(251,191,36,0.1)"}
                  onMouseLeave={(e) => e.target.style.background = "transparent"}>
                  {renderOption ? renderOption(option) : option}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
    {helpText && <small style={{ color: disabled ? "#94a3b8" : "#14b8a6", fontSize: "0.8rem",
      display: "block", marginTop: "0.25rem" }}>{helpText}</small>}
  </div>
);

// Verse Card
const VerseCard = ({ sloka, playing, toggleAudio }) => (
  <div style={{ background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", borderRadius: "24px", padding: "3rem",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)", marginBottom: "2rem", border: "2px solid rgba(251,191,36,0.2)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
      <h3 style={{ fontSize: "1.8rem", fontWeight: "800", margin: 0,
        background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        <img src="/mantra.png" alt="Location" style={{ width: "1.5rem", height: "1.5rem", display: "inline-block", verticalAlign: "middle", marginRight: "0.5rem" }} /> {sloka.location}
      </h3>
      <button onClick={toggleAudio} style={{ display: "flex", alignItems: "center", gap: "0.75rem",
        background: playing ? "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)" 
          : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        color: playing ? "#f8fafc" : "#0f172a", border: "none", padding: "1rem 1.75rem", borderRadius: "50px",
        fontWeight: "700", cursor: "pointer", transition: "all 0.3s",
        boxShadow: playing ? "0 10px 30px rgba(220,38,38,0.4)" : "0 10px 30px rgba(251,191,36,0.4)" }}>
        🔊 {playing ? "Pause" : "Play"}
      </button>
    </div>
    <div style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(20,184,166,0.1))",
      border: "3px solid rgba(251,191,36,0.3)", borderRadius: "24px", padding: "2rem", marginBottom: "2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "1rem", color: "#fbbf24", fontWeight: "700" }}>
        <img src="/om.png" alt="Om" style={{ width: "1.5rem", height: "1.5rem", display: "inline-block", verticalAlign: "middle", marginRight: "0.3rem" }} /> SANSKRIT TEXT <img src="/om.png" alt="Om" style={{ width: "1.5rem", height: "1.5rem", display: "inline-block", verticalAlign: "middle", marginLeft: "0.3rem" }} />
      </div>
      <p style={{ fontSize: "1.6rem", textAlign: "center", color: "#f8fafc", lineHeight: "2",
        fontFamily: "'Noto Serif Devanagari', serif" }}>{sloka.sanskrit}</p>
    </div>
    <div style={{ background: "rgba(15,23,42,0.6)", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem", border: "1px solid rgba(251,191,36,0.2)" }}>
      <span style={{ color: "#fbbf24", fontSize: "0.9rem", fontWeight: "600" }}>Transliteration</span>
      <p style={{ fontSize: "1.1rem", color: "#cbd5e1", fontStyle: "italic", marginTop: "0.8rem" }}>
        {sloka.transliteration}
      </p>
    </div>
    <div style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(13,148,136,0.15))",
        border: "3px solid rgba(20,184,166,0.4)", borderRadius: "24px", padding: "2rem" }}>
        <span style={{ color: "#14b8a6", fontSize: "1rem", fontWeight: "700" }}>ENGLISH TRANSLATION</span>
        <p style={{ fontSize: "1.2rem", color: "#f8fafc", lineHeight: "1.8", fontStyle: "italic",
          marginTop: "1rem" }}>"{sloka.translation}"</p>
      </div>
    </div>
  
);

// Step indicator
const StepIndicator = ({ steps, currentStep }) => (
  <div style={{ position: "sticky", top: "5rem", width: "50%", zIndex: 99,
    background: "rgba(30, 41, 59, 0.9)", backdropFilter: "blur(20px)",
    borderRadius: "16px", padding: "2rem 1.5rem", margin: "2rem auto",
    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.6)", marginBottom: "2rem",
    border: "1px solid rgba(251, 191, 36, 0.2)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
      {steps.map((step, idx) => (
        <div key={step.num} style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", display: "flex",
              alignItems: "center", justifyContent: "center",
              background: currentStep > step.num ? "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" 
                : currentStep === step.num ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" : "#64748b",
              color: currentStep >= step.num ? (currentStep === step.num ? "#0f172a" : "white") : "#94a3b8", fontSize: "1.2rem",
              fontWeight: "700", transition: "all 0.3s",
              boxShadow: currentStep === step.num ? "0 4px 15px rgba(251, 191, 36, 0.4)" : "none",
              flexShrink: 0 }}>
              {currentStep > step.num ? <FaCheck /> : step.icon}
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: "600",
              color: currentStep >= step.num ? "#fbbf24" : "#94a3b8" }}>{step.label}</span>
          </div>
          {idx < steps.length - 1 && (
            <div style={{ height: "3px", width: "60px",
              background: currentStep > step.num ? "#14b8a6" : "#64748b",
              transition: "all 0.3s", flexShrink: 0, margin: "0 0.5rem" }} />
          )}
        </div>
      ))}
    </div>
  </div>
);

// Mandala Background SVG
const MandalaBackground = () => (
  <div style={{ position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)", width: "800px", height: "800px",
    opacity: "0.15", pointerEvents: "none", zIndex: 0 }}>
    <svg viewBox="0 0 600 600" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="mandala-gradient-explorer" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="140" fill="url(#mandala-gradient-explorer)" />
      {[...Array(12)].map((_, i) => (
        <ellipse key={i} cx="300" cy="120" rx="40" ry="14" fill="rgba(251,191,36,0.1)"
          transform={`rotate(${(i / 12) * 360} 300 300)`} />
      ))}
    </svg>
  </div>
);

export default function VedaExplorer() {
  const [mandalaNum, setMandalaNum] = useState("");
  const [indexData, setIndexData] = useState(null);
  const [hymnNum, setHymnNum] = useState("");
  const [stanzaNum, setStanzaNum] = useState("");
  const [sloka, setSloka] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hymnSearch, setHymnSearch] = useState("");
  const [stanzaSearch, setStanzaSearch] = useState("");
  const [isHymnDropdownOpen, setIsHymnDropdownOpen] = useState(false);
  const [isStanzaDropdownOpen, setIsStanzaDropdownOpen] = useState(false);
  const [showPadasAnalysis, setShowPadasAnalysis] = useState(false);
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  const [inputMode, setInputMode] = useState("guided");
  const [quickInput, setQuickInput] = useState("");
  
  const audioRef = useRef(null);
  const hymnDropdownRef = useRef(null);
  const stanzaDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (hymnDropdownRef.current && !hymnDropdownRef.current.contains(e.target)) setIsHymnDropdownOpen(false);
      if (stanzaDropdownRef.current && !stanzaDropdownRef.current.contains(e.target)) setIsStanzaDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mandalaNum) return;
    
    // Check cache first
    if (indexCache.has(mandalaNum)) {
      setIndexData(indexCache.get(mandalaNum));
      setError(null);
      return;
    }
    
    setLoading(true);
    fetch(`${API_BASE}/index/${mandalaNum}`, {
      headers: { "X-API-Key": API_KEY }
    })
      .then(r => r.json())
      .then(data => {
        if (!data.error) {
          indexCache.set(mandalaNum, data); // Cache the result
          setIndexData(data);
          setError(null);
        } else {
          setIndexData(null);
          setError(data.error);
        }
      })
      .catch(() => setError("Could not load data"))
      .finally(() => setLoading(false));
  }, [mandalaNum]);

  const handleSearch = useCallback(() => {
    if (!mandalaNum || !hymnNum || !stanzaNum) return setError("Please fill all fields");
    setLoading(true);
    fetch(`${API_BASE}/sloka/${mandalaNum}/${hymnNum}/${stanzaNum}`, {
      headers: { "X-API-Key": API_KEY }
    })
      .then(r => r.json())
      .then(data => {
        setSloka(data.error ? null : data);
        setError(data.error || null);
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        setPlaying(false);
      })
      .catch(() => setError("Failed to fetch"))
      .finally(() => setLoading(false));
  }, [mandalaNum, hymnNum, stanzaNum]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    playing ? audioRef.current.pause() : audioRef.current.play();
    setPlaying(!playing);
  };

  // Memoize filtered hymns to avoid recalculation on every render
  const getFilteredHymns = useMemo(() => {
    if (!indexData?.hymns) return [];
    if (!hymnSearch) return indexData.hymns;
    return indexData.hymns.filter(h => h.hymn_number.toString().includes(hymnSearch));
  }, [indexData, hymnSearch]);

  // Memoize filtered stanzas to avoid recalculation on every render
  const getFilteredStanzas = useMemo(() => {
    if (!indexData || !hymnNum) return [];
    const hymn = indexData.hymns.find(h => h.hymn_number === Number(hymnNum));
    const all = Array.from({length: hymn?.total_stanzas || 1}, (_, i) => i + 1);
    if (!stanzaSearch) return all;
    return all.filter(n => n.toString().includes(stanzaSearch));
  }, [indexData, hymnNum, stanzaSearch]);

  const handleQuickInput = () => {
    const match = quickInput.match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (!match) return setError("Invalid format. Use: Mandala.Sukta.Mantra (e.g., 1.10.129)");
    const [, m, h, s] = match;
    if (Number(m) < 1 || Number(m) > 10) return setError("Mandala must be between 1-10");
    setMandalaNum(m);
    setHymnNum(h);
    setStanzaNum(s);
    setError(null);
    setTimeout(() => handleSearch(), 200);
  };

  const handleNextSloka = () => {
    if (!mandalaNum || !hymnNum || !stanzaNum) return;
    
    const currentStanza = Number(stanzaNum);
    const hymn = indexData?.hymns?.find(h => h.hymn_number === Number(hymnNum));
    const totalStanzas = hymn?.total_stanzas || 0;
    
    if (currentStanza < totalStanzas) {
      // Next stanza in same hymn
      setStanzaNum((currentStanza + 1).toString());
      setSloka(null);
      setError(null);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
      setPlaying(false);
      
      setLoading(true);
      fetch(`${API_BASE}/sloka/${mandalaNum}/${hymnNum}/${currentStanza + 1}`, {
        headers: { "X-API-Key": API_KEY }
      })
        .then(r => r.json())
        .then(data => {
          setSloka(data.error ? null : data);
          setError(data.error || null);
        })
        .catch(() => setError("Failed to fetch"))
        .finally(() => setLoading(false));
    } else {
      setError("This is the last mantra in this sukta");
    }
  };

  const handlePreviousSloka = () => {
    if (!mandalaNum || !hymnNum || !stanzaNum) return;
    
    const currentStanza = Number(stanzaNum);
    
    if (currentStanza > 1) {
      // Previous stanza in same hymn
      setStanzaNum((currentStanza - 1).toString());
      setSloka(null);
      setError(null);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
      setPlaying(false);
      
      setLoading(true);
      fetch(`${API_BASE}/sloka/${mandalaNum}/${hymnNum}/${currentStanza - 1}`, {
        headers: { "X-API-Key": API_KEY }
      })
        .then(r => r.json())
        .then(data => {
          setSloka(data.error ? null : data);
          setError(data.error || null);
        })
        .catch(() => setError("Failed to fetch"))
        .finally(() => setLoading(false));
    } else {
      setError("This is the first mantra in this sukta");
    }
  };

  const getCurrentStep = () => {
    if (!mandalaNum) return 1;
    if (!hymnNum) return 2;
    if (!stanzaNum) return 3;
    return 4;
  };

  const steps = [
    { num: 1, label: "Mandala", icon: <img src="/book.png" alt="Book" style={{ width: "1.2rem", height: "1.2rem" }} /> },
    { num: 2, label: "Sukta", icon: <img src="/sukta.png" alt="Sukta" style={{ width: "1.2rem", height: "1.2rem" }} /> },
    { num: 3, label: "Mantra", icon: <img src="/mantra.png" alt="Mantra" style={{ width: "1.2rem", height: "1.2rem" }} /> }
  ];

  return (
    <div style={{ minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      padding: "2rem 0", position: "relative", overflow: "hidden" }}>
      <MandalaBackground />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem",
        position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "3.5rem", fontWeight: "700", color: "#fbbf24",
            marginBottom: "1rem", letterSpacing: "-1px", lineHeight: "1.2" }}>
            <img src="/book.png" alt="Book" style={{ width: "3rem", height: "3rem", display: "inline-block", verticalAlign: "middle", marginRight: "0.5rem" }} />
            Rig Veda Explorer
          </h2>
          <p style={{ color: "#cbd5e1", fontSize: "1.2rem", lineHeight: "1.6", fontWeight: "400" }}>
            Navigate through sacred verses using traditional indexing
          </p>
        </div>

        {/* Input Mode Toggle */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "2rem" }}>
          {[
            { mode: "guided", icon: <FaGripHorizontal />, label: "Guided Selection" },
            { mode: "quick", icon: <FaBolt />, label: "Quick Input" }
          ].map(btn => (
            <button key={btn.mode} onClick={() => setInputMode(btn.mode)}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem 2rem",
                borderRadius: "50px", border: inputMode === btn.mode ? "none" : "2px solid rgba(251,191,36,0.3)",
                background: inputMode === btn.mode ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" : "rgba(30,41,59,0.6)",
                color: inputMode === btn.mode ? "#0f172a" : "#cbd5e1", fontWeight: "700", fontSize: "1.05rem",
                cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: inputMode === btn.mode ? "0 10px 30px rgba(251,191,36,0.3)" : "none" }}>
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>

        {inputMode === "guided" ? (
          <>
            <StepIndicator steps={steps} currentStep={getCurrentStep()} />

            <div style={STYLES.card}>
              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", marginBottom: "1rem", fontWeight: "700",
                  color: "#fbbf24", fontSize: "1.1rem" }}>
                  <img src="/book.png" alt="Book" style={{ width: "1.3rem", height: "1.3rem", display: "inline-block", verticalAlign: "middle", marginRight: "0.3rem" }} /> Step 1: Choose Mandala (Book)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                  gap: "1rem" }}>
                  {Array.from({length: 10}, (_, i) => i + 1).map(n => (
                    <div key={n} onClick={() => { setMandalaNum(n.toString()); setHymnNum("");
                      setStanzaNum(""); setSloka(null); setError(null); }}
                      style={{ padding: "1.5rem 1rem", borderRadius: "16px", textAlign: "center",
                        cursor: "pointer", border: mandalaNum === n.toString() ? "3px solid #fbbf24" : "2px solid rgba(251,191,36,0.3)",
                        background: mandalaNum === n.toString() ? "linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(245,158,11,0.2) 100%)" : "rgba(30,41,59,0.6)",
                        transform: mandalaNum === n.toString() ? "scale(1.05)" : "scale(1)",
                        transition: "all 0.3s",
                        boxShadow: mandalaNum === n.toString() ? "0 8px 20px rgba(251, 191, 36, 0.3)" : "0 2px 8px rgba(0,0,0,0.3)" }}>
                      <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem",
                        color: mandalaNum === n.toString() ? "#fbbf24" : "#94a3b8" }}>{n}</div>
                      <div style={{ fontSize: "0.75rem", color: "#cbd5e1", fontWeight: "600" }}>
                        Mandala {n}
                      </div>
                    </div>
                  ))}
                </div>
                {mandalaNum && indexData && (
                  <p style={{ fontSize: "0.9rem", color: "#14b8a6", marginTop: "1rem",
                    fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FaCheck /> Contains {indexData.total_hymns} hymns
                  </p>
                )}
              </div>

              {mandalaNum && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", color: "black" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "1rem", fontWeight: "700",
                      color: "#fbbf24", fontSize: "1.1rem" }}>
                      <img src="/sukta.png" alt="Sukta" style={{ width: "1.3rem", height: "1.3rem", display: "inline-block", verticalAlign: "middle", marginRight: "0.3rem" }} /> Step 2: Select Sukta (Hymn)
                    </label>
                    <SearchableDropdown value={hymnNum ? `Sukta ${hymnNum} (${indexData?.hymns?.find(h => h.hymn_number === Number(hymnNum))?.total_stanzas || 0} stanzas)` : ""}
                      placeholder="Search or select sukta..." options={getFilteredHymns}
                      onSelect={(h) => { setHymnNum(h.hymn_number); setStanzaNum(""); setSloka(null);
                        setIsHymnDropdownOpen(false); }}
                      searchValue={hymnSearch} onSearchChange={setHymnSearch}
                      isOpen={isHymnDropdownOpen} setIsOpen={setIsHymnDropdownOpen}
                      disabled={!indexData || loading} dropdownRef={hymnDropdownRef}
                      renderOption={(h) => `Sukta ${h.hymn_number} (${h.total_stanzas} stanzas)`}
                      helpText={indexData ? `${indexData.total_hymns} suktas available` : null} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "1rem", fontWeight: "700",
                      color: "#fbbf24", fontSize: "1.1rem" }}>
                      <img src="/mantra.png" alt="Mantra" style={{ width: "1.3rem", height: "1.3rem", display: "inline-block", verticalAlign: "middle", marginRight: "0.3rem" }} /> Step 3: Select Mantra (Stanza)
                    </label>
                    <SearchableDropdown value={stanzaNum ? `Mantra ${stanzaNum}` : ""}
                      placeholder="Search or select mantra..." options={getFilteredStanzas}
                      onSelect={(s) => { setStanzaNum(s); setSloka(null); setIsStanzaDropdownOpen(false); }}
                      searchValue={stanzaSearch} onSearchChange={setStanzaSearch}
                      isOpen={isStanzaDropdownOpen} setIsOpen={setIsStanzaDropdownOpen}
                      disabled={!indexData || !hymnNum || loading} dropdownRef={stanzaDropdownRef}
                      renderOption={(s) => `Mantra ${s}`}
                      helpText={(() => {
                        if (!indexData || !hymnNum) return "Select sukta first";
                        const h = indexData.hymns.find(h => h.hymn_number === Number(hymnNum));
                        return h ? `${h.total_stanzas} mantras available` : null;
                      })()} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ textAlign: "center", margin : "10rem auto 3rem auto", display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              {sloka && (
                <button onClick={handlePreviousSloka} 
                  style={{ 
                    ...STYLES.btn, 
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    boxShadow: "0 8px 20px rgba(59, 130, 246, 0.4)",
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "0.75rem",
                    fontSize: "1.1rem"
                  }}>
                  ← Previous Mantra
                </button>
              )}
              
              <button onClick={handleSearch} disabled={loading || !mandalaNum || !hymnNum || !stanzaNum}
                style={{ ...STYLES.btn, background: (!mandalaNum || !hymnNum || !stanzaNum) ? "#9ca3af" 
                  : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                  cursor: (!mandalaNum || !hymnNum || !stanzaNum) ? "not-allowed" : "pointer",
                  boxShadow: (!mandalaNum || !hymnNum || !stanzaNum) ? "none" : "0 10px 30px rgba(251,191,36,0.4)",
                  display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <img src="/search1.png" alt="Search" style={{ width: "1.2rem", height: "1.2rem", filter: "brightness(0) invert(1)" }} />
                {loading ? "Searching..." : "Retrieve Sacred Verse"}
              </button>
              
              {sloka && (
                <button onClick={handleNextSloka} 
                  style={{ 
                    ...STYLES.btn, 
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.4)",
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "0.75rem",
                    fontSize: "1.1rem"
                  }}>
                  Next Mantra →
                </button>
              )}
            </div>
          </>
        ) : (
          <div style={STYLES.card}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#fbbf24",
              marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FaBolt style={{ color: "#f59e0b" }} /> Quick Reference Input
            </h3>
            <p style={{ color: "#cbd5e1", marginBottom: "1.5rem", fontSize: "1.05rem" }}>
              Enter reference in format: <strong>Mandala.Sukta.Mantra</strong> (e.g., 1.10.129)
            </p>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <input type="text" value={quickInput} onChange={(e) => setQuickInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleQuickInput()}
                placeholder="e.g., 1.10.129" style={STYLES.input}
                onFocus={(e) => e.target.style.borderColor = "#fbbf24"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
              <button onClick={handleQuickInput} style={STYLES.btn}>Go →</button>
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ color: "#cbd5e1", fontWeight: "600" }}>Examples:</span>
              {["1.1.1", "2.5.3", "10.129.1"].map(ex => (
                <button key={ex} onClick={() => setQuickInput(ex)}
                  style={{ padding: "0.5rem 1rem", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)",
                    borderRadius: "8px", cursor: "pointer", color: "#fbbf24", fontWeight: "600",
                    fontSize: "0.9rem" }}>{ex}</button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "2px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "16px", padding: "1rem", color: "#dc2626", textAlign: "center",
            marginBottom: "2rem", fontWeight: "600" }}>⚠️ {error}</div>
        )}

        {sloka && (
          <div>
            <VerseCard sloka={sloka} playing={playing} toggleAudio={toggleAudio} />

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
              {sloka.padas?.length > 0 && (
                <div style={{ background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", borderRadius: "24px", padding: "0",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.3)", border: "2px solid rgba(251,191,36,0.2)" }}>
                  <button onClick={() => setShowPadasAnalysis(!showPadasAnalysis)}
                    style={{ width: "100%", background: "rgba(15,23,42,0.6)", border: "none", padding: "1.5rem",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      cursor: "pointer", borderRadius: "24px", borderBottom: showPadasAnalysis ? "1px solid rgba(251,191,36,0.2)" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                      <FaBookOpen color="#fbbf24" />
                      <span style={{ fontWeight: "600", color: "#fbbf24" }}>Word-by-Word Analysis ({sloka.padas.length} padas)</span>
                    </div>
                    {showPadasAnalysis ? <FaCompress color="#fbbf24" /> : <FaExpand color="#fbbf24" />}
                  </button>
                  {showPadasAnalysis && (
                    <div style={{ padding: "1.5rem", display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
                      {sloka.padas.map((p, i) => (
                        <div key={i} style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(20,184,166,0.3)",
                          borderRadius: "12px", padding: "1.2rem" }}>
                          <div style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.8rem",
                            fontFamily: "'Noto Serif Devanagari', serif", color: "#f8fafc" }}>{p.form}</div>
                          <div style={{ fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.8rem" }}>
                            <strong>Lemma:</strong> {p.lemma}
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                            {Object.entries(p).filter(([k]) => !['form', 'lemma'].includes(k)).map(([k, v]) => (
                              <span key={k} style={{ background: "#fbbf24", color: "#0f172a",
                                padding: "0.2rem 0.6rem", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "600" }}>
                                {k}: {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {sloka.translations && Object.keys(sloka.translations).filter(k => k.toLowerCase() !== 'griffith').length > 0 && (
                <div style={{ background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", borderRadius: "24px", padding: "0",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.3)", border: "2px solid rgba(20,184,166,0.2)" }}>
                  <button onClick={() => setShowAllTranslations(!showAllTranslations)}
                    style={{ width: "100%", background: "rgba(15,23,42,0.6)", border: "none", padding: "1.5rem",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      cursor: "pointer", borderRadius: "24px", borderBottom: showAllTranslations ? "1px solid rgba(20,184,166,0.2)" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                      <FaQuoteLeft color="#14b8a6" />
                      <span style={{ fontWeight: "600", color: "#14b8a6" }}>
                        Alternative Translations ({Object.keys(sloka.translations).filter(k => k.toLowerCase() !== 'griffith').length})
                      </span>
                    </div>
                    {showAllTranslations ? <FaCompress color="#14b8a6" /> : <FaExpand color="#14b8a6" />}
                  </button>
                  {showAllTranslations && (
                    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      {Object.entries(sloka.translations).filter(([t]) => t.toLowerCase() !== 'griffith')
                        .map(([translator, translation]) => (
                        <div key={translator} style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(20,184,166,0.3)",
                          borderRadius: "12px", padding: "1.5rem", borderLeft: "4px solid #14b8a6" }}>
                          <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#14b8a6",
                            marginBottom: "0.8rem" }}>{translator.toUpperCase()}</div>
                          <p style={{ fontSize: "1.05rem", color: "#cbd5e1", lineHeight: "1.6",
                            fontStyle: "italic", margin: 0 }}>"{translation}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <audio ref={audioRef} src={`${API_BASE}/audio/${mandalaNum}/${hymnNum}/${stanzaNum}`}
              onEnded={() => setPlaying(false)}
              onError={() => { setPlaying(false); setError("Audio not found"); }} />
          </div>
        )}
      </div>
    </div>
  );
}
