import { useState, useEffect } from 'react';
import api from '../utils/api';

const QUICK_TIPS = [
  { icon: '🐕', tip: 'MDR1 gene mutation in Collies & Australian Shepherds causes heightened sensitivity to ivermectin, loperamide, and certain chemotherapy agents.' },
  { icon: '🐈', tip: 'Cats lack glucuronyl transferase — making them highly susceptible to NSAID and acetaminophen toxicity. Always verify feline-safe dosing.' },
  { icon: '⚖️', tip: 'Always convert patient weight to kg before calculating. 1 lb = 0.4536 kg. Errors here directly affect dose safety.' },
  { icon: '💊', tip: 'When in doubt between min and max dose, start at the lower range and titrate up based on clinical response and tolerance.' },
];

const Badge = ({ children, color = 'green' }) => {
  const colors = {
    green:  { bg: '#F4F6DC', text: '#5A6600', border: '#C8D800' },
    purple: { bg: '#EEEDFE', text: '#3B2F8F', border: '#C8C4F0' },
    red:    { bg: '#FCEBEB', text: '#A32D2D', border: '#F7C1C1' },
  };
  const c = colors[color] || colors.green;
  return (
    <span style={{
      fontSize: '11px', fontWeight: '700', padding: '3px 10px',
      borderRadius: '20px', display: 'inline-block',
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      letterSpacing: '0.04em',
    }}>{children}</span>
  );
};

export default function DrugInfo() {
  const [drugs, setDrugs]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch]   = useState('');
  const [recentIds, setRecentIds] = useState([]);

  useEffect(() => {
    api.get('/drugs').then(r => setDrugs(r.data)).catch(() => {});
    const stored = JSON.parse(localStorage.getItem('vetdoze_recent_drugs') || '[]');
    setRecentIds(stored);
  }, []);

  const loadDrug = async (id) => {
    setSelected(id);
    setLoading(true);
    try {
      const res = await api.get(`/drugs/${id}`);
      setDetail(res.data);
      // Track recently viewed
      const updated = [id, ...recentIds.filter(r => r !== id)].slice(0, 3);
      setRecentIds(updated);
      localStorage.setItem('vetdoze_recent_drugs', JSON.stringify(updated));
    } finally {
      setLoading(false);
    }
  };

  const filtered = drugs.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.drug_class?.toLowerCase().includes(search.toLowerCase())
  );

  const recentDrugs = recentIds.map(id => drugs.find(d => d.id === id)).filter(Boolean);

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .drug-detail-enter { animation: fadeIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
        .drug-list-btn:hover { background: #F7F8F3 !important; }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#1A1A2E', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Drug Information
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0 }}>
            Descriptions, dosage guidelines, and breed-specific warnings.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: '20px', alignItems: 'start' }}>

          {/* ── Drug list panel ── */}
          <div style={{
            background: 'white', borderRadius: '16px', overflow: 'hidden',
            boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)',
            position: 'sticky', top: '20px',
          }}>
            {/* Search */}
            <div style={{ padding: '12px', borderBottom: '1px solid #F0F2F5' }}>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '14px', pointerEvents: 'none',
                }}>🔍</span>
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search drugs..."
                  style={{
                    width: '100%', border: '1.5px solid #E8EAF0', borderRadius: '8px',
                    padding: '9px 12px 9px 34px', fontSize: '13px', fontFamily: 'inherit',
                    color: '#1A1A2E', background: '#FAFAFA', outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#8B9D00'}
                  onBlur={e => e.target.style.borderColor = '#E8EAF0'}
                />
              </div>
            </div>

            <ul style={{ listStyle: 'none', padding: '8px', margin: 0, maxHeight: '60vh', overflowY: 'auto' }}>
              {filtered.length === 0 && (
                <li style={{ padding: '16px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                  No drugs found
                </li>
              )}
              {filtered.map(d => (
                <li key={d.id}>
                  <button className="drug-list-btn" onClick={() => loadDrug(d.id)} style={{
                    width: '100%', textAlign: 'left', padding: '10px 12px',
                    borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit',
                    background: selected === d.id ? '#F4F6DC' : 'transparent',
                    border: selected === d.id ? '1px solid #C8D800' : '1px solid transparent',
                    transition: 'all 0.15s',
                    boxShadow: selected === d.id ? '0 2px 8px rgba(139,157,0,0.1)' : 'none',
                  }}>
                    <p style={{
                      fontSize: '13px', fontWeight: '700',
                      color: selected === d.id ? '#5A6600' : '#1A1A2E',
                      margin: '0 0 4px',
                    }}>{d.name}</p>
                    <span style={{
                      fontSize: '10px', fontWeight: '700', color: '#8B9D00',
                      background: '#F4F6DC', padding: '2px 8px',
                      borderRadius: '6px', display: 'inline-block',
                      letterSpacing: '0.04em',
                    }}>{d.drug_class}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Detail panel ── */}
          <div>
            {loading && (
              <div style={{
                background: 'white', borderRadius: '16px', padding: '60px',
                textAlign: 'center', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'spin 1s linear infinite' }}>⏳</div>
                <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Loading drug info...</p>
              </div>
            )}

            {/* ── Enhanced empty state ── */}
            {!loading && !detail && (
              <div>
                {/* Recently viewed */}
                {recentDrugs.length > 0 && (
                  <div style={{
                    background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px',
                    boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.04)',
                  }}>
                    <p style={{ fontSize: '10px', fontWeight: '800', color: '#8B9D00', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>
                      Recently Viewed
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {recentDrugs.map(d => (
                        <button key={d.id} onClick={() => loadDrug(d.id)} style={{
                          padding: '8px 16px', borderRadius: '10px', cursor: 'pointer',
                          fontFamily: 'inherit', fontSize: '13px', fontWeight: '700',
                          background: '#F4F6DC', color: '#5A6600',
                          border: '1px solid #C8D800', transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#E8EC9A'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(139,157,0,0.15)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#F4F6DC'; e.currentTarget.style.boxShadow = 'none'; }}
                        >💊 {d.name}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick tips */}
                <div style={{
                  background: 'white', borderRadius: '16px', padding: '24px',
                  boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.04)',
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '16px', background: '#F4F6DC',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '24px', margin: '0 auto 12px',
                      boxShadow: '0 4px 12px rgba(139,157,0,0.15)',
                    }}>📖</div>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#1A1A2E', margin: '0 0 4px' }}>
                      Select a drug to view details
                    </p>
                    <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
                      Or get started with a quick tip below
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ fontSize: '10px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>
                      Clinical Quick Tips
                    </p>
                    {QUICK_TIPS.map((tip, i) => (
                      <div key={i} style={{
                        background: '#F7F8F3', borderRadius: '12px', padding: '14px 16px',
                        display: 'flex', gap: '12px', alignItems: 'flex-start',
                        border: '1px solid #F0F2F5',
                      }}>
                        <span style={{
                          width: '36px', height: '36px', borderRadius: '10px',
                          background: 'white', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '18px', flexShrink: 0,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                        }}>{tip.icon}</span>
                        <p style={{ fontSize: '13px', color: '#4A4A5A', lineHeight: '1.65', margin: 0 }}>
                          {tip.tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Drug detail ── */}
            {!loading && detail && (
              <div className="drug-detail-enter" style={{
                background: 'white', borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 4px 24px -4px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.04)',
              }}>
                {/* Drug header */}
                <div style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg,#3B2F8F,#5A4DB8)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                        {detail.name}
                      </h2>
                      <span style={{
                        fontSize: '10px', fontWeight: '700', color: '#C8D96A',
                        background: 'rgba(139,157,0,0.25)', padding: '3px 12px',
                        borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.07em',
                        display: 'inline-block',
                      }}>{detail.drug_class}</span>
                    </div>
                    {detail.generic_name && (
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', margin: 0, textAlign: 'right' }}>
                        Generic<br/><span style={{ fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>{detail.generic_name}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ padding: '24px' }}>

                  {/* Description */}
                  {detail.description && (
                    <div style={{ marginBottom: '22px' }}>
                      <p style={{ fontSize: '10px', fontWeight: '800', color: '#8B9D00', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>
                        Description
                      </p>
                      <p style={{ fontSize: '14px', color: '#4A4A5A', lineHeight: '1.75', margin: 0 }}>
                        {detail.description}
                      </p>
                    </div>
                  )}

                  {/* Mechanism */}
                  {detail.mechanism && (
                    <div style={{ marginBottom: '22px' }}>
                      <p style={{ fontSize: '10px', fontWeight: '800', color: '#8B9D00', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>
                        Mechanism of Action
                      </p>
                      <p style={{ fontSize: '14px', color: '#4A4A5A', lineHeight: '1.75', margin: 0 }}>
                        {detail.mechanism}
                      </p>
                    </div>
                  )}

                  {/* Contraindications */}
                  {detail.contraindications && (
                    <div style={{
                      background: '#FCEBEB', border: '1.5px solid #F7C1C1',
                      borderRadius: '14px', padding: '18px', marginBottom: '22px',
                      boxShadow: '0 2px 8px rgba(163,45,45,0.06)',
                    }}>
                      <p style={{ fontSize: '10px', fontWeight: '800', color: '#A32D2D', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        ⚠️ Contraindications
                      </p>
                      <p style={{ fontSize: '13px', color: '#791F1F', lineHeight: '1.7', margin: 0 }}>
                        {detail.contraindications}
                      </p>
                    </div>
                  )}

                  {/* Dosage ranges */}
                  {detail.dosage_ranges?.length > 0 && (
                    <div style={{ marginBottom: '22px' }}>
                      <p style={{ fontSize: '10px', fontWeight: '800', color: '#8B9D00', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>
                        Dosage Ranges
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {detail.dosage_ranges.map((d, i) => (
                          <div key={i} style={{
                            background: '#F7F8F3', borderRadius: '12px',
                            padding: '14px 18px', display: 'flex',
                            justifyContent: 'space-between', alignItems: 'center',
                            border: '1px solid #ECEEF2',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <Badge color="purple">{d.species}</Badge>
                              <Badge color="green">{d.route}</Badge>
                              <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>{d.frequency}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '16px', fontWeight: '800', color: '#1A1A2E' }}>
                                {d.min_dose_mg_per_kg}–{d.max_dose_mg_per_kg}
                              </span>
                              <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '4px' }}>mg/kg</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Formulations */}
                  {detail.formulations?.length > 0 && (
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: '800', color: '#8B9D00', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>
                        Available Formulations
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {detail.formulations.map((f, i) => (
                          <div key={i} style={{
                            background: '#F4F6DC', borderRadius: '12px',
                            padding: '10px 16px', border: '1px solid #C8D800',
                            boxShadow: '0 2px 6px rgba(139,157,0,0.08)',
                          }}>
                            <p style={{ fontSize: '11px', fontWeight: '700', color: '#5A6600', margin: '0 0 3px', textTransform: 'capitalize', letterSpacing: '0.04em' }}>
                              {f.form}
                            </p>
                            <p style={{ fontSize: '14px', color: '#6B7A00', margin: 0, fontWeight: '800' }}>
                              {f.concentration}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}