import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      padding: "2rem 1rem"
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        background: "rgba(30,41,59,0.95)",
        borderRadius: "24px",
        padding: "3rem",
        boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
        border: "2px solid rgba(251,191,36,0.2)"
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
            boxShadow: "0 4px 15px rgba(251, 191, 36, 0.3)",
            transition: "all 0.3s ease"
          }}
        >
          ← Back to Home
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <img src="/om.png" alt="Om" style={{ width: "4rem", height: "4rem", marginBottom: "1rem" }} />
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#fbbf24",
            marginBottom: "0.5rem"
          }}>
            Privacy Policy
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: "1rem" }}>
            Last updated: October 19, 2025
          </p>
        </div>

        {/* Content */}
        <div style={{ color: "#cbd5e1", lineHeight: "1.8", fontSize: "1.05rem" }}>
          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "600", color: "#fbbf24", marginBottom: "1rem" }}>
              Introduction
            </h2>
            <p>
              Welcome to Eternal Veda. We are committed to protecting your privacy and ensuring you have a safe
              and enriching experience while exploring the sacred texts of the Rig Veda. This Privacy Policy
              explains how we collect and safeguard your information.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "600", color: "#fbbf24", marginBottom: "1rem" }}>
              Information We Collect
            </h2>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#14b8a6", marginBottom: "0.5rem" }}>
              1. Usage Data
            </h3>
            <ul style={{ marginLeft: "1.5rem", marginBottom: "1rem" }}>
              <li>Interaction with features (verse selections, search queries)</li>
            </ul>

            <h3 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#14b8a6", marginBottom: "0.5rem" }}>
              2. Chat Interactions
            </h3>
            <ul style={{ marginLeft: "1.5rem", marginBottom: "1rem" }}>
              <li>Questions asked to the AI Sacred Guide</li>
            </ul>

            <h3 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#14b8a6", marginBottom: "0.5rem" }}>
              3. Technical Information
            </h3>
            <ul style={{ marginLeft: "1.5rem" }}>
              <li>IP address (anonymized)</li>
              <li>Operating system</li>
            </ul>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "600", color: "#fbbf24", marginBottom: "1rem" }}>
              How We Use Your Information
            </h2>
            <ul style={{ marginLeft: "1.5rem" }}>
              <li><strong>Improve User Experience:</strong> Understanding how you interact with the platform to enhance features</li>
              <li><strong>Technical Improvements:</strong> Fixing bugs, optimizing performance, and ensuring compatibility</li>
            </ul>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "600", color: "#fbbf24", marginBottom: "1rem" }}>
              Third-Party Services
            </h2>
            <p>
              We may use third-party services for:
            </p>
            <ul style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
              <li><strong>AI Processing:</strong> Chat interactions processed through secure AI services</li>
              <li><strong>Audio Hosting:</strong> Verse recitations hosted on secure CDN services</li>
            </ul>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "600", color: "#fbbf24", marginBottom: "1rem" }}>
              Cookies and Local Storage
            </h2>
            <p>
              We don't use cookies or local storage to collect personal data.
            </p>
          </section>

          <section style={{
            background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
            color: "#0f172a",
            padding: "2rem",
            borderRadius: "16px",
            marginTop: "3rem"
          }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "1rem" }}>
              Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices,
              please contact us at:
            </p>
            <p style={{ marginTop: "1rem" }}>
              <strong>Email:</strong> admin@saikesav.me<br />
              <strong>Website:</strong> www.saikesav.me
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
