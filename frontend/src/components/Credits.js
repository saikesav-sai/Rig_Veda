import { useNavigate } from "react-router-dom";

const Credits = () => {
  const navigate = useNavigate();

  const creditSections = [
    {
      title: "Sacred Texts & Audio",
      icon: "📖",
      items: [
        {
          name: "Veda Web",
          description: "Original Sanskrit texts from ancient Vedic manuscripts. Citation: Kölligan, Daniel, Claes Neuefeind, Uta Reinöhl, Patrick Sahle, Antje Casaretto, Anna Fischer, Börge Kiss, Natalie Korobzow, Jürgen Rolshoven, Jakob Halfmann, Francisco Mondaca. VedaWeb. Online Research Platform for Old Indic Texts. University of Cologne. https://vedaweb.uni-koeln.de, accessed 2 October 2025.",
          link: "https://vedaweb.uni-koeln.de/rigveda/"
        },
        {
          name: "Vedic Audio Recordings",
          description: "Authentic recitations by traditional Vedic scholars",
          link: "https://github.com/aasi-archive/rv-audio"
        }
        
      ]
    },
    
    
    
    
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      padding: "2rem 1rem"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
            color: "#0f172a",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            marginBottom: "2rem",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
            transition: "all 0.3s ease"
          }}
        >
          ← Back to Home
        </button>

        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "3rem",
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          borderRadius: "24px",
          padding: "2rem 1rem",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
        }}>
          <img src="/om.png" alt="Om" style={{ width: "5rem", height: "5rem", marginBottom: "1rem" }} />
          <h1 style={{
            fontSize: "3rem",
            fontWeight: "700",
            color: "#fbbf24",
            marginBottom: "1rem"
          }}>
            Credits & Acknowledgments
          </h1>
          <p style={{
            color: "#cbd5e1",
            fontSize: "1.2rem",
            maxWidth: "700px",
            margin: "0 auto"
          }}>
            I am deeply grateful to all the individuals, organizations, and communities
            who have contributed to making the Rig Veda accessible to the world.
          </p>
        </div>

        {/* Credit Sections */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          marginBottom: "3rem"
        }}>
          {creditSections.map((section, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(30,41,59,0.95)",
                borderRadius: "20px",
                padding: "2rem",
                boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                transition: "all 0.3s ease"
              }}
            >
              <div style={{
                fontSize: "3rem",
                marginBottom: "1rem",
                textAlign: "center"
              }}>
                {section.icon}
              </div>
              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#fbbf24",
                marginBottom: "1.5rem",
                textAlign: "center"
              }}>
                {section.title}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {section.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    style={{
                      padding: "1rem",
                      background: "linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(245,158,11,0.1) 100%)",
                      borderRadius: "12px",
                      borderLeft: "4px solid #fbbf24"
                    }}
                  >
                    <h3 style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#fbbf24",
                      marginBottom: "0.5rem"
                    }}>
                      {item.name}
                    </h3>
                    <p style={{
                      fontSize: "0.95rem",
                      color: "#cbd5e1",
                      marginBottom: item.link ? "0.5rem" : "0"
                    }}>
                      {item.description}
                    </p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "0.9rem",
                          color: "#14b8a6",
                          textDecoration: "none",
                          fontWeight: "600"
                        }}
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Special Thanks Section */}
        <div style={{
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          borderRadius: "24px",
          padding: "3rem 2rem",
          textAlign: "center",
          color: "white",
          boxShadow: "0 15px 50px rgba(0,0,0,0.6)",
          border: "2px solid rgba(251,191,36,0.3)"
        }}>
          <h2 style={{
            fontSize: "2rem",
            fontWeight: "700",
            marginBottom: "1rem",
            color: "#fbbf24"
          }}>
            🙏 Special Thanks
          </h2>
          <p style={{
            fontSize: "1.1rem",
            lineHeight: "1.8",
            maxWidth: "800px",
            margin: "0 auto 1.5rem",
            opacity: 0.9,
            color: "#cbd5e1"
          }}>
            This project would not have been possible without the tireless efforts of Vedic scholars,
            translators, and technologists who have dedicated their lives to preserving and sharing
            ancient wisdom. We honor the rishis (sages) who originally composed these sacred hymns
            thousands of years ago, and all those who have kept this knowledge alive through generations.
          </p>
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            marginTop: "2rem"
          }}>
            <div style={{
              padding: "1rem 2rem",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📚</div>
              <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>10,552 Verses</div>
            </div>
            <div style={{
              padding: "1rem 2rem",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎵</div>
              <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Audio Recordings</div>
            </div>
            <div style={{
              padding: "1rem 2rem",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌏</div>
              <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Open to All</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Credits;
