import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer style={{
      background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      color: "white",
      padding: "3rem 2rem 1.5rem",
      marginTop: "4rem",
      borderTop: "2px solid rgba(251,191,36,0.2)"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem"
        }}>
          {/* Brand Section */}
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem"
            }}>
              <img src="/om.png" alt="Om" style={{ width: "2.5rem", height: "2.5rem" }} />
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                margin: 0
              }}>
                Eternal Veda
              </h3>
            </div>
            <p style={{
              fontSize: "0.95rem",
              lineHeight: "1.6",
              opacity: 0.9
            }}>
              Exploring the world's oldest scripture with modern technology.
              Preserving ancient wisdom for future generations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              marginBottom: "1rem"
            }}>
              Quick Links
            </h4>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem"
            }}>
              {[
                { label: "Home", path: "/" },
                { label: "Veda Explorer", path: "/explorer" },
                { label: "AI Guide", path: "/chat" },
                { label: "Semantic Search", path: "/search" }
              ].map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(link.path)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: "0.25rem 0",
                    opacity: 0.8,
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => e.target.style.opacity = "1"}
                  onMouseOut={(e) => e.target.style.opacity = "0.8"}
                >
                  {link.label} →
                </button>
              ))}
            </div>
          </div>

          
          

          {/* Contact & Legal */}
          <div>
            <h4 style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              marginBottom: "1rem"
            }}>
              Legal & Info
            </h4>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem"
            }}>
              <button
                onClick={() => navigate("/privacy")}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: "0.25rem 0",
                  opacity: 0.8,
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => e.target.style.opacity = "1"}
                onMouseOut={(e) => e.target.style.opacity = "0.8"}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => navigate("/credits")}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: "0.25rem 0",
                  opacity: 0.8,
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => e.target.style.opacity = "1"}
                onMouseOut={(e) => e.target.style.opacity = "0.8"}
              >
                Credits & Acknowledgments
              </button>
              <p style={{
                fontSize: "0.95rem",
                opacity: 0.8,
                margin: "0.5rem 0 0"
              }}>
                Made with ❤️ by saikesav.me
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.2)",
          margin: "2rem 0 1.5rem"
        }}></div>

        

        {/* Sacred Symbol */}
        <div style={{
          textAlign: "center",
          marginTop: "1.5rem",
          opacity: 0.6
        }}>
          <p style={{
            fontSize: "0.85rem",
            margin: 0,
            fontStyle: "italic"
          }}>
            ॐ सर्वे भवन्तु सुखिनः | May all beings be happy
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
