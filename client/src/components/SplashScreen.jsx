import { useState, useEffect } from 'react';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('in'); // 'in' | 'visible' | 'out' | 'done'

  useEffect(() => {
    // Fade in → hold → fade out
    const t1 = setTimeout(() => setPhase('visible'), 100);   // start visible
    const t2 = setTimeout(() => setPhase('out'), 2400);       // start fade-out
    const t3 = setTimeout(() => { setPhase('done'); onDone(); }, 3200); // done

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  if (phase === 'done') return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'white',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: phase === 'out' ? 0 : 1,
      transition: phase === 'out' ? 'opacity 0.8s ease' : 'opacity 0.4s ease',
      pointerEvents: phase === 'out' ? 'none' : 'all',
    }}>

      {/* Logo image — full logo with pets */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        transform: phase === 'visible' ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(12px)',
        opacity: phase === 'visible' ? 1 : 0,
        transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease',
      }}>
        {/* Full logo with pets */}
        <img
          src="/logo-full.png"
          alt="VetDoze"
          style={{
            width: 'min(420px, 80vw)',
            height: 'auto',
            objectFit: 'contain',
            marginBottom: '8px',
          }}
          onError={e => { e.target.style.display = 'none'; }}
        />

        {/* Tagline */}
        <p style={{
          fontSize: '14px', color: '#999', fontWeight: '500',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          letterSpacing: '0.06em', marginTop: '8px',
          opacity: phase === 'visible' ? 1 : 0,
          transition: 'opacity 0.4s ease 0.3s',
        }}>
          Precision Veterinary Dosage Platform
        </p>
      </div>

      {/* Loading dots */}
      <div style={{
        display: 'flex', gap: '6px', marginTop: '36px',
        opacity: phase === 'visible' ? 1 : 0,
        transition: 'opacity 0.4s ease 0.5s',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#F5C300',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}/>
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}