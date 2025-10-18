import { useState } from "react";
import { FaDice, FaSearch } from "react-icons/fa";
import { API_BASE } from "../config";
import SearchResults from "./SearchResults";

// Example searches
const EXAMPLE_SEARCHES = [
  { text: "Fire & Sacred Rituals", query: "fire sacrifice agni sacred ritual offerings", icon: <img src="/mantra.png" alt="Fire" style={{ width: "2rem", height: "2rem" }} /> },
  { text: "Dawn Goddess & Light", query: "dawn goddess ushas light morning radiance", icon: "🌅" },
  { text: "Thunder God Indra", query: "indra thunder storm lightning vajra warrior", icon: "⚡" },
  { text: "Cosmic Creation & Universe", query: "creation universe cosmic order rita primordial", icon: "🌌" },
  { text: "Divine Wisdom & Knowledge", query: "wisdom knowledge divine truth enlightenment", icon: <img src="/book.png" alt="Wisdom" style={{ width: "2rem", height: "2rem" }} /> },
  { text: "Water & Purification", query: "water purification sacred rivers streams flowing", icon: "💧" }
];

// Mandala Background
const MandalaBackground = () => (
  <div style={{ position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)", width: "800px", height: "800px",
    opacity: "0.15", pointerEvents: "none", zIndex: 0 }}>
    <svg viewBox="0 0 600 600" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="mandala-gradient-search" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#764ba2" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f093fb" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="140" fill="url(#mandala-gradient-search)" />
      {[...Array(12)].map((_, i) => (
        <ellipse key={i} cx="300" cy="120" rx="40" ry="14" fill="rgba(118,75,162,0.1)"
          transform={`rotate(${(i / 12) * 360} 300 300)`} />
      ))}
    </svg>
  </div>
);

export default function SemanticSearch({ onResults }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const analyzeConfidenceDistribution = (scores) => {
    if (scores.length === 0) return { threshold: 0.65, maxResults: 15 };
    const sortedScores = [...scores].sort((a, b) => b - a);
    const q1 = sortedScores[Math.floor(sortedScores.length * 0.25)];
    const q2 = sortedScores[Math.floor(sortedScores.length * 0.5)];
    const q3 = sortedScores[Math.floor(sortedScores.length * 0.75)];
    const gaps = [];
    for (let i = 0; i < Math.min(20, sortedScores.length - 1); i++) {
      gaps.push({ position: i, gap: sortedScores[i] - sortedScores[i + 1], score: sortedScores[i + 1] });
    }
    gaps.sort((a, b) => b.gap - a.gap);
    const topScore = sortedScores[0];
    const scoreRange = topScore - sortedScores[sortedScores.length - 1];
    
    let threshold, maxResults;
    if (topScore >= 0.5 && gaps[0]?.gap > 0.05) {
      threshold = Math.max(0.2, gaps[0].score);
      maxResults = Math.min(15, gaps[0].position + 5);
    } else if (gaps[0]?.gap > 0.04 && gaps[0].position < 25) {
      threshold = Math.max(0.15, gaps[0].score);
      maxResults = Math.min(20, gaps[0].position + 8);
    } else if (q1 >= 0.35 && (q1 - q3) < 0.15) {
      threshold = Math.max(0.18, q3 - 0.02);
      maxResults = Math.min(18, Math.floor(sortedScores.length * 0.75) + 5);
    } else if (scoreRange > 0.15) {
      threshold = Math.max(0.15, q2);
      maxResults = Math.min(25, Math.floor(sortedScores.length * 0.5) + 10);
    } else {
      threshold = Math.max(0.1, q3);
      maxResults = Math.min(30, sortedScores.length);
    }
    return { threshold, maxResults };
  };

  const filterAndRankResults = (results, query) => {
    const resultsWithConfidence = results.map(verse => ({
      ...verse,
      confidence: verse.similarity_score || 0.5
    }));
    resultsWithConfidence.sort((a, b) => b.confidence - a.confidence);
    const confidenceScores = resultsWithConfidence.map(v => v.confidence);
    const { threshold: distributionThreshold, maxResults: distributionMaxResults } = 
      analyzeConfidenceDistribution(confidenceScores);
    
    const queryWords = query.trim().split(/\s+/).length;
    let complexityAdjustment = queryWords <= 2 ? 0.02 : queryWords >= 6 ? -0.02 : 0;
    let maxResultsAdjustment = queryWords <= 2 ? -3 : queryWords >= 6 ? 5 : 0;
    
    const minConfidence = Math.max(0.1, Math.min(0.5, distributionThreshold + complexityAdjustment));
    const maxResults = Math.max(8, Math.min(30, distributionMaxResults + maxResultsAdjustment));

    let filteredResults = resultsWithConfidence
      .filter(verse => verse.confidence >= minConfidence)
      .slice(0, maxResults);

    if (filteredResults.length < 5 && resultsWithConfidence.length >= 5) {
      const fallbackThreshold = Math.max(0.08, minConfidence - 0.1);
      filteredResults = resultsWithConfidence
        .filter(verse => verse.confidence >= fallbackThreshold)
        .slice(0, Math.max(8, maxResults));
    }

    return {
      filteredResults,
      totalFetched: results.length,
      highConfidenceCount: filteredResults.filter(v => v.confidence >= 0.75).length,
      averageConfidence: filteredResults.length > 0 
        ? filteredResults.reduce((sum, v) => sum + v.confidence, 0) / filteredResults.length : 0
    };
  };

  const handleSurpriseMe = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/semantic/random`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setSearchResults(null);
      } else {
        const transformedData = {
          intent: 'random_exploration',
          query: 'Random Vedic Wisdom',
          summary: `Discover ${data.total_results} randomly selected verses from the Rig Veda`,
          verses: data.results.map(verse => ({ ...verse, confidence: 1.0 }))
        };
        setSearchQuery("Random Vedic Wisdom");
        setSearchResults(transformedData);
        setShowResults(true);
        if (onResults) onResults(transformedData);
      }
    } catch (err) {
      setError("Failed to fetch random verses. Please try again.");
      setSearchResults(null);
      if (onResults) onResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSemanticSearch = async (query = searchQuery) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching from:', `${API_BASE}/semantic/search`);
      console.log('Request body:', { query, top_k: 50 });
      
      const response = await fetch(`${API_BASE}/semantic/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_k: 50 }),
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.error) {
        setError(data.error);
        setSearchResults(null);
        if (onResults) onResults(null);
      } else {
        console.log('Raw results count:', data.results?.length);
        const { filteredResults, totalFetched, highConfidenceCount, averageConfidence } = 
          filterAndRankResults(data.results, query);
        console.log('Filtered results count:', filteredResults.length);
        
        const transformedData = {
          intent: 'semantic_search',
          query: data.query,
          summary: `Found ${filteredResults.length} relevant verses related to "${query}"`,
          verses: filteredResults,
          searchMetadata: { totalFetched, displayCount: filteredResults.length,
            highConfidenceCount, averageConfidence }
        };
        console.log('Transformed data:', transformedData);
        setSearchResults(transformedData);
        setShowResults(true);
        if (onResults) onResults(transformedData);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError("Failed to search. Please try again.");
      setSearchResults(null);
      if (onResults) onResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSearch = () => {
    setShowResults(false);
    setSearchResults(null);
    setError(null);
  };

  return (
    <div style={{ minHeight: "100vh",
      background: "linear-gradient(135deg, #fefce8 0%, #fff7ed 50%, #fef3c7 100%)",
      padding: "2rem 0", position: "relative", overflow: "hidden" }}>
      <MandalaBackground />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem",
        position: "relative", zIndex: 1 }}>
        {showResults && searchResults ? (
          <SearchResults results={searchResults} onBack={handleBackToSearch} />
        ) : (
          <div>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{ fontSize: "3.5rem", fontWeight: "700", color: "#1e1b4b",
                marginBottom: "1rem", letterSpacing: "-1px", lineHeight: "1.2" }}>
                <img src="/search2.png" alt="Search" style={{ width: "3rem", height: "3rem", display: "inline-block", verticalAlign: "middle", marginRight: "0.5rem" }} />
                Semantic Search
              </h2>
              <p style={{ color: "#475569", fontSize: "1.2rem", lineHeight: "1.6",
                fontWeight: "400", maxWidth: "700px", margin: "0 auto" }}>
                Discover the wisdom of the Rig Veda through intelligent semantic search. 
                Find verses by meaning, theme, and concept.
              </p>
            </div>

            <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(254,252,232,0.95))",
              borderRadius: "24px", padding: "2.5rem",
              boxShadow: "0 15px 50px rgba(102,126,234,0.15)",
              border: "2px solid rgba(102,126,234,0.15)", marginBottom: "3rem",
              backdropFilter: "blur(10px)" }}>
              <div style={{ display: "flex", maxWidth: "800px", margin: "0 auto 1.5rem",
                gap: "1rem", flexWrap: "wrap" }}>
                <input type="text"
                  placeholder="Search for wisdom: 'fire sacrifice', 'dawn goddess', 'cosmic creation'..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSemanticSearch()}
                  style={{ flex: 1, minWidth: "300px", padding: "1.25rem 1.5rem",
                    fontSize: "1.1rem", border: "2px solid #e5e7eb", borderRadius: "16px",
                    outline: "none", transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)", fontWeight: "500" }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
                <button onClick={() => handleSemanticSearch()} disabled={loading}
                  style={{ background: loading ? "#9ca3af" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white", border: "none", padding: "1.25rem 2.5rem",
                    borderRadius: "16px", fontSize: "1.1rem",
                    cursor: loading ? "not-allowed" : "pointer", display: "flex",
                    alignItems: "center", gap: "0.5rem", fontWeight: "700",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: loading ? "none" : "0 10px 30px rgba(102,126,234,0.3)",
                    whiteSpace: "nowrap" }}>
                  <FaSearch /> {loading ? "Searching..." : "Search"}
                </button>
              </div>
              
              <div style={{ textAlign: "center" }}>
                <button onClick={handleSurpriseMe} disabled={loading}
                  style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: "white", border: "none", padding: "1rem 2rem", borderRadius: "50px",
                    fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer",
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    fontWeight: "700", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: loading ? "none" : "0 10px 30px rgba(245,158,11,0.3)" }}>
                  <FaDice /> Surprise Me!
                </button>
              </div>

              {error && (
                <div style={{ background: "rgba(239, 68, 68, 0.1)",
                  border: "2px solid rgba(239, 68, 68, 0.3)", borderRadius: "16px",
                  padding: "1rem", color: "#dc2626", textAlign: "center", marginTop: "1.5rem",
                  fontWeight: "600", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.2rem" }}>⚠️</span>{error}
                </div>
              )}
            </div>
            
            <div style={{ marginBottom: "3rem" }}>
              <h3 style={{ textAlign: "center", marginBottom: "2rem", color: "#1e1b4b",
                fontSize: "1.8rem", fontWeight: "700" }}>Explore by Theme</h3>
              <div style={{ display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}
                className="responsive-grid">
                {EXAMPLE_SEARCHES.map(({ text, query, icon }, index) => (
                  <button key={index} onClick={() => {
                      setSearchQuery(query);
                      handleSemanticSearch(query);
                    }} disabled={loading}
                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(254,252,232,0.95))",
                      border: "2px solid rgba(102,126,234,0.15)", borderRadius: "20px",
                      padding: "2.5rem 2rem", cursor: loading ? "not-allowed" : "pointer",
                      textAlign: "center", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontWeight: "600",
                      fontSize: "1.15rem", color: "#1e1b4b", opacity: loading ? 0.6 : 1,
                      backdropFilter: "blur(10px)" }} className="card-hover mobile-padding">
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{typeof icon === 'string' ? icon : icon}</div>
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
