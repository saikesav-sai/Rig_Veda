import styles from './Hero.module.css';
import OmModel3D from './OmModel3D';

export default function Hero({ navigateToPage }) {
  return (
    <section className={styles.heroRoot} aria-label="Rig Veda Explorer hero">
      {/* 3D Om Model on the Left - Simple mode with transparent background */}
      <div style={{ 
        flex: '0 0 600px', 
        height: '650px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <OmModel3D simple={true} scale={0.33} />
      </div>
      
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Eternal Veda (Rig Veda)
        </h1>
        <p className={styles.heroSubtitle}>Discover the ancient wisdom, hear sacred recitations, and explore timeless verses from the world's oldest scripture</p>

        <div className={styles.heroActions}>
          <button className={`${styles.ctaPrimary} ${styles.btnShine}`} onClick={() => navigateToPage('explorer')}>
            <img src="/mandala.png" alt="Browse" className={styles.btnIcon} style={{ width: "1.3rem", height: "1.3rem",filter: "brightness(0) invert(1)" }} />
            Browse Mandalas
          </button>
          <button className={`${styles.ctaGhost} ${styles.btnHover}`} onClick={() => navigateToPage('search')}>
            <img src="/search2.png" alt="Search" className={styles.btnIcon} style={{ width: "1.3rem", height: "1.3rem" }} />
            Search the Veda
          </button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        right: '.1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        animation: 'bounce 2s infinite',
        cursor: 'pointer',
        zIndex: 10
      }}
      onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
      >
        <span style={{
          fontSize: '0.5rem',
          fontWeight: '600',
          color: '#fbbf24',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Scroll to Explore
        </span>
        <div style={{
          width: '20px',
          height: '40px',
          border: '2px solid #fbbf24',
          borderRadius: '20px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '8px'
        }}>
          <div style={{
            width: '6px',
            height: '10px',
            background: '#fbbf24',
            borderRadius: '3px',
            animation: 'scroll 1.5s infinite'
          }} />
        </div>
        <span style={{
          fontSize: '1.2rem',
          color: '#fbbf24'
        }}>
          ↓
        </span>
      </div>
    </section>
  );
}
