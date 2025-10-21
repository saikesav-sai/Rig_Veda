import { useCallback, useEffect, useState } from 'react';
import styles from './Hero.module.css';

const VEDIC_QUOTES = [
  {
    id: 1,
    sanskrit: 'एकं सद्विप्रा बहुधा वदन्ति',
    transliteration: 'Ekam sad vipra bahudha vadanti',
    meaning: 'Truth is one, the wise call it by many names',
    source: 'Rig Veda 1.164.46'
  },
  {
    id: 2,
    sanskrit: 'असतो मा सद्गमय',
    transliteration: 'Asato ma sadgamaya',
    meaning: 'Lead me from the unreal to the real',
    source: 'Rig Veda 1.89.16'
  },
  {
    id: 3,
    sanskrit: 'यत्र विश्वं भवत्येकनीडम्',
    transliteration: 'Yatra visvam bhavatyeka nidam',
    meaning: 'Where the entire universe becomes one nest',
    source: 'Rig Veda 10.121.1'
  },
  {
    id: 4,
    sanskrit: 'अग्निमीळे पुरोहितं',
    transliteration: 'Agnim ile purohitam',
    meaning: 'I praise Agni, the chosen priest, god, minister of sacrifice',
    source: 'Rig Veda 1.1.1'
  },
  {
    id: 5,
    sanskrit: 'सं गच्छध्वं सं वदध्वम्',
    transliteration: 'Sam gacchadhvam sam vadadhvam',
    meaning: 'Move together, speak together, let your minds be in harmony',
    source: 'Rig Veda 10.191.2'
  },
  {
    id: 6,
    sanskrit: 'सत्यं वद धर्मं चर',
    transliteration: 'Satyam vada dharmam chara',
    meaning: 'Speak the truth, practice righteousness',
    source: 'Rig Veda 4.33.11'
  }
];

export default function QuoteCarousel() {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Function to handle quote changes with animation
  const changeQuote = useCallback((newIndex) => {
    console.log('changeQuote called with index:', newIndex, 'current:', index);
    
    if (isTransitioning) {
      console.log('Already transitioning, skipping');
      return;
    }
    
    if (newIndex === index) {
      console.log('Same index, skipping');
      return;
    }
    
    setIsTransitioning(true);
    
    // Trigger fade out
    const quoteCard = document.querySelector(`.${styles.quoteCard}`);
    if (quoteCard) {
      quoteCard.style.opacity = '0';
      quoteCard.style.transform = 'translateY(-10px)';
    }

    // Change quote and fade in
    setTimeout(() => {
      setIndex(newIndex);
      setTimeout(() => {
        if (quoteCard) {
          quoteCard.style.opacity = '1';
          quoteCard.style.transform = 'translateY(0)';
        }
        setIsTransitioning(false);
      }, 50);
    }, 300);
  }, [index, isTransitioning]);

  // Auto-rotation effect - resets whenever index changes
  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq && mq.matches) return undefined; // Skip if user prefers reduced motion

    const timer = setInterval(() => {
      changeQuote((index + 1) % VEDIC_QUOTES.length);
    }, 30000); // 30 seconds

    return () => clearInterval(timer);
  }, [index, changeQuote]); // Reset timer whenever index changes

  return (
    <div 
      className={styles.quoteCard} 
      aria-live="polite"
      style={{
        opacity: 1,
        transform: 'translateY(0)',
        transition: 'opacity 0.3s ease, transform 0.3s ease'
      }}
    >
      <div className={styles.quoteIcon}>🪷</div>
      <div className={styles.sanskritText}>{VEDIC_QUOTES[index].sanskrit}</div>
      <div className={styles.transliteration}>{VEDIC_QUOTES[index].transliteration}</div>
      <div className={styles.meaning}>"{VEDIC_QUOTES[index].meaning}"</div>
      <div className={styles.source}>— {VEDIC_QUOTES[index].source}</div>
      <div className={styles.quoteIndicators}>
        {VEDIC_QUOTES.map((_, i) => (
          <span 
            key={i} 
            className={`${styles.indicator} ${i === index ? styles.active : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Dot clicked:', i);
              changeQuote(i);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                changeQuote(i);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View quote ${i + 1}`}
            style={{ 
              cursor: 'pointer',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
}
