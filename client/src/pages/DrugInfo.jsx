import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function DrugInfo() {
  const [drugs, setDrugs]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail]   = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/drugs').then(r => setDrugs(r.data)).catch(() => {});
  }, []);

  const loadDrug = async (id) => {
    setSelected(id);
    setLoading(true);
    try {
      const res = await api.get(`/drugs/${id}`);
      setDetail(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth:'860px', margin:'0 auto', padding:'40px 32px' }}>

      {/* Header */}
      <div style={{ marginBottom:'32px' }}>
        <h1 style={{ fontSize:'28px', fontWeight:'800', color:'#1A1A2E', margin:'0 0 6px' }}>
          Drug Information
        </h1>
        <p style={{ fontSize:'14px', color:'#6B6B80', margin:0 }}>
          Quick-access descriptions, usage guidelines, and breed-specific warnings.
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:'20px', alignItems:'start' }}>

        {/* Drug list */}
        <div style={{
          background:'white', border:'1px solid #E2E4D0',
          borderRadius:'16px', overflow:'hidden',
        }}>
          <div style={{
            padding:'14px 16px', borderBottom:'1px solid #E2E4D0',
            background:'#F7F8F3',
          }}>
            <p style={{ fontSize:'11px', fontWeight:'700', color:'#8B9D00',
              textTransform:'uppercase', letterSpacing:'0.08em', margin:0 }}>
              Select a drug
            </p>
          </div>
          <ul style={{ listStyle:'none', padding:'8px', margin:0 }}>
            {drugs.map(d => (
              <li key={d.id}>
                <button onClick={() => loadDrug(d.id)} style={{
                  width:'100%', textAlign:'left', padding:'10px 12px',
                  borderRadius:'10px', cursor:'pointer', fontFamily:'inherit',
                  background: selected === d.id ? '#F4F6DC' : 'transparent',
                  border: selected === d.id ? '1px solid #C8D800' : '1px solid transparent',
                  transition:'all 0.15s',
                }}
                  onMouseEnter={e => { if (selected !== d.id) e.currentTarget.style.background = '#F7F8F3'; }}
                  onMouseLeave={e => { if (selected !== d.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <p style={{ fontSize:'13px', fontWeight:'700',
                    color: selected === d.id ? '#5A6600' : '#1A1A2E', margin:'0 0 2px' }}>
                    {d.name}
                  </p>
                  <p style={{ fontSize:'11px', color:'#8B9D00', margin:0,
                    background:'#F4F6DC', display:'inline-block', padding:'1px 7px',
                    borderRadius:'8px', fontWeight:'600' }}>
                    {d.drug_class}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Detail panel */}
        <div>
          {loading && (
            <div style={{
              background:'white', border:'1px solid #E2E4D0',
              borderRadius:'16px', padding:'48px', textAlign:'center',
            }}>
              <p style={{ color:'#6B6B80', fontSize:'14px' }}>Loading...</p>
            </div>
          )}

          {!loading && !detail && (
            <div style={{
              background:'white', border:'2px dashed #E2E4D0',
              borderRadius:'16px', padding:'48px', textAlign:'center',
            }}>
              <div style={{
                width:'56px', height:'56px', borderRadius:'16px', background:'#F4F6DC',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'24px', margin:'0 auto 16px',
              }}>📖</div>
              <p style={{ fontSize:'14px', color:'#6B6B80', margin:0 }}>
                Select a drug from the list to view details
              </p>
            </div>
          )}

          {!loading && detail && (
            <div style={{
              background:'white', border:'1px solid #E2E4D0',
              borderRadius:'16px', overflow:'hidden',
            }}>
              {/* Drug header */}
              <div style={{
                padding:'24px', borderBottom:'1px solid #E2E4D0',
                background:'linear-gradient(135deg,#3B2F8F,#5A4DB8)',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize:'22px', fontWeight:'800', color:'white', margin:'0 0 4px' }}>
                      {detail.name}
                    </h2>
                    <span style={{
                      fontSize:'11px', fontWeight:'700', color:'#C8D96A',
                      background:'rgba(139,157,0,0.25)', padding:'2px 10px',
                      borderRadius:'10px', textTransform:'uppercase', letterSpacing:'0.06em',
                    }}>
                      {detail.drug_class}
                    </span>
                  </div>
                  {detail.generic_name && (
                    <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)', margin:0 }}>
                      Generic: {detail.generic_name}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ padding:'24px' }}>

                {/* Description */}
                {detail.description && (
                  <div style={{ marginBottom:'20px' }}>
                    <p style={{ fontSize:'11px', fontWeight:'700', color:'#8B9D00',
                      textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 8px' }}>
                      Description
                    </p>
                    <p style={{ fontSize:'14px', color:'#4A4A5A', lineHeight:'1.7', margin:0 }}>
                      {detail.description}
                    </p>
                  </div>
                )}

                {/* Mechanism */}
                {detail.mechanism && (
                  <div style={{ marginBottom:'20px' }}>
                    <p style={{ fontSize:'11px', fontWeight:'700', color:'#8B9D00',
                      textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 8px' }}>
                      Mechanism of Action
                    </p>
                    <p style={{ fontSize:'14px', color:'#4A4A5A', lineHeight:'1.7', margin:0 }}>
                      {detail.mechanism}
                    </p>
                  </div>
                )}

                {/* Contraindications */}
                {detail.contraindications && (
                  <div style={{
                    background:'#FCEBEB', border:'1px solid #F7C1C1',
                    borderRadius:'12px', padding:'16px', marginBottom:'20px',
                  }}>
                    <p style={{ fontSize:'11px', fontWeight:'700', color:'#A32D2D',
                      textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 6px' }}>
                      Contraindications
                    </p>
                    <p style={{ fontSize:'13px', color:'#791F1F', lineHeight:'1.6', margin:0 }}>
                      {detail.contraindications}
                    </p>
                  </div>
                )}

                {/* Dosage ranges */}
                {detail.dosage_ranges?.length > 0 && (
                  <div style={{ marginBottom:'20px' }}>
                    <p style={{ fontSize:'11px', fontWeight:'700', color:'#8B9D00',
                      textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 10px' }}>
                      Dosage Ranges
                    </p>
                    <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                      {detail.dosage_ranges.map((d,i) => (
                        <div key={i} style={{
                          background:'#F7F8F3', borderRadius:'10px',
                          padding:'12px 16px', display:'flex',
                          justifyContent:'space-between', alignItems:'center',
                          border:'1px solid #E2E4D0',
                        }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                            <span style={{
                              fontSize:'12px', fontWeight:'700', color:'#3B2F8F',
                              background:'#EEEDFE', padding:'2px 10px', borderRadius:'10px',
                              textTransform:'capitalize',
                            }}>{d.species}</span>
                            <span style={{ fontSize:'13px', color:'#6B6B80' }}>
                              via <strong style={{ color:'#1A1A2E' }}>{d.route}</strong> · {d.frequency}
                            </span>
                          </div>
                          <span style={{ fontSize:'14px', fontWeight:'700', color:'#1A1A2E' }}>
                            {d.min_dose_mg_per_kg}–{d.max_dose_mg_per_kg} mg/kg
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formulations */}
                {detail.formulations?.length > 0 && (
                  <div>
                    <p style={{ fontSize:'11px', fontWeight:'700', color:'#8B9D00',
                      textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 10px' }}>
                      Available Formulations
                    </p>
                    <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                      {detail.formulations.map((f,i) => (
                        <div key={i} style={{
                          background:'#F4F6DC', borderRadius:'10px',
                          padding:'8px 14px', border:'1px solid #C8D800',
                        }}>
                          <p style={{ fontSize:'12px', fontWeight:'700', color:'#5A6600', margin:'0 0 2px', textTransform:'capitalize' }}>
                            {f.form}
                          </p>
                          <p style={{ fontSize:'13px', color:'#6B7A00', margin:0, fontWeight:'600' }}>
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
  );
}