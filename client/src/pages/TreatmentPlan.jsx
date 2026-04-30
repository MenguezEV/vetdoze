import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';

/* ─── shared input styles ─── */
const S = {
  fieldLabel: {
    display: 'block', fontSize: '10px', fontWeight: '800', color: '#94A3B8',
    marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em',
  },
  input: {
    width: '100%', border: '1.5px solid #E8EAF0', borderRadius: '10px',
    padding: '10px 13px', fontSize: '13px', fontFamily: 'inherit',
    color: '#1A1A2E', background: 'white', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
  },
  select: {
    width: '100%', border: '1.5px solid #E8EAF0', borderRadius: '10px',
    padding: '10px 13px', fontSize: '13px', fontFamily: 'inherit',
    color: '#1A1A2E', background: 'white', outline: 'none',
    appearance: 'none', cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '32px',
    transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
  },
};

const focusGreen = e => { e.target.style.borderColor = '#8B9D00'; e.target.style.boxShadow = '0 0 0 3px rgba(139,157,0,0.1)'; };
const focusOff   = e => { e.target.style.borderColor = '#E8EAF0'; e.target.style.boxShadow = 'none'; };

/* ─── blank drug entry ─── */
const blankDrug = () => ({
  _id: Date.now() + Math.random(),
  drug_id: '', calculated_dose_mg: '', volume_ml: '',
  frequency: 'BID', duration_days: 7, route: '', notes: '',
});

export default function TreatmentPlan() {
  const user = JSON.parse(localStorage.getItem('vetdoze_user') || 'null');
  if (!user || user.role !== 'vet') return <Navigate to="/login" />;

  const [allDrugs, setAllDrugs] = useState([]);
  const [breeds,   setBreeds]   = useState([]);
  const [patient,  setPatient]  = useState({
    patient_name: '', species: 'dog', breed_id: '', weight_kg: '',
  });
  const [drugs,   setDrugs]   = useState([blankDrug()]);   // list of prescriptions
  const [planNotes, setPlanNotes] = useState('');

  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied,  setCopied]  = useState(false);

  useEffect(() => { api.get('/drugs').then(r => setAllDrugs(r.data)); }, []);
  useEffect(() => {
    api.get(`/breeds?species=${patient.species}`).then(r => setBreeds(r.data));
  }, [patient.species]);

  /* patient field handler */
  const onPatient = e => setPatient(p => ({ ...p, [e.target.name]: e.target.value }));

  /* drug row handlers */
  const onDrugField = (_id, field, val) =>
    setDrugs(ds => ds.map(d => d._id === _id ? { ...d, [field]: val } : d));

  const addDrug    = () => setDrugs(ds => [...ds, blankDrug()]);
  const removeDrug = _id => setDrugs(ds => ds.filter(d => d._id !== _id));

  /* submit */
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setResult(null);
    try {
      /* Send one plan per drug entry — adjust if your backend supports batch */
      const responses = await Promise.all(
        drugs.map(d =>
          api.post('/treatment/generate', {
            ...patient,
            drug_id:            d.drug_id,
            calculated_dose_mg: d.calculated_dose_mg,
            volume_ml:          d.volume_ml,
            frequency:          d.frequency,
            duration_days:      d.duration_days,
            notes:              [d.notes, planNotes].filter(Boolean).join(' | '),
          })
        )
      );
      setResult(responses.map(r => r.data));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate plan.');
    } finally { setLoading(false); }
  };

  const copyIds = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.map(r => r.plan.id).join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .result-enter { animation: fadeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
        .submit-btn { transition: all 0.18s ease; }
        .submit-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 10px 28px rgba(139,157,0,0.45)!important; }
        .drug-row { transition: box-shadow 0.15s ease; }
        .drug-row:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.09)!important; }
        .remove-btn:hover { background:#FCEBEB!important; border-color:#F7C1C1!important; color:#A32D2D!important; }
        .add-drug-btn:hover { background:#EEEDFE!important; border-color:#9B8FD8!important; }
      `}</style>

      <div style={{
        maxWidth: '760px', margin: '0 auto', padding: '40px 32px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#1A1A2E', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Treatment Plan Generator
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0 }}>
            Fill in patient details and add one or more drugs. Share the generated Plan ID(s) with the owner.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── Patient card ── */}
          <div style={{
            background: 'white', borderRadius: '18px', padding: '24px', marginBottom: '16px',
            boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)',
          }}>
            <p style={{ fontSize: '10px', fontWeight: '800', color: '#8B9D00', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8B9D00', display: 'inline-block' }}/>
              Patient Information
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={S.fieldLabel}>Patient name</label>
                <input name="patient_name" value={patient.patient_name} onChange={onPatient}
                  required placeholder="e.g. Buddy" style={S.input} onFocus={focusGreen} onBlur={focusOff} />
              </div>
              <div>
                <label style={S.fieldLabel}>Species</label>
                <select name="species" value={patient.species} onChange={onPatient} style={S.select} onFocus={focusGreen} onBlur={focusOff}>
                  <option value="dog">🐕 Dog</option>
                  <option value="cat">🐈 Cat</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={S.fieldLabel}>Breed</label>
                <select name="breed_id" value={patient.breed_id} onChange={onPatient} style={S.select} onFocus={focusGreen} onBlur={focusOff}>
                  <option value="">Select breed</option>
                  {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label style={S.fieldLabel}>Weight (kg)</label>
                <input name="weight_kg" value={patient.weight_kg} onChange={onPatient}
                  required type="number" step="0.1" min="0.1" placeholder="e.g. 25"
                  style={S.input} onFocus={focusGreen} onBlur={focusOff} />
              </div>
            </div>
          </div>

          {/* ── Drug rows ── */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <p style={{ fontSize: '10px', fontWeight: '800', color: '#3B2F8F', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B2F8F', display: 'inline-block' }}/>
                Medications
                <span style={{
                  background: '#EEEDFE', color: '#3B2F8F', fontSize: '11px', fontWeight: '800',
                  padding: '2px 10px', borderRadius: '20px', border: '1px solid #C8C4F0',
                  letterSpacing: '0',
                }}>{drugs.length}</span>
              </p>
              <button type="button" className="add-drug-btn" onClick={addDrug} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '10px', cursor: 'pointer',
                background: '#F4F3FE', color: '#3B2F8F',
                border: '1.5px solid #C8C4F0', fontFamily: 'inherit',
                fontSize: '13px', fontWeight: '700', transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: '16px', lineHeight: 1 }}>＋</span> Add Drug
              </button>
            </div>

            {drugs.map((drug, idx) => (
              <div key={drug._id} className="drug-row" style={{
                background: 'white', borderRadius: '16px', marginBottom: '12px',
                boxShadow: '0 4px 16px -4px rgba(0,0,0,0.07)',
                border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden',
              }}>
                {/* Drug row header */}
                <div style={{
                  background: 'linear-gradient(90deg, #F4F3FE, #EEEDFE)',
                  padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderBottom: '1px solid #E8E6FC',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px',
                      background: '#3B2F8F', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: '800',
                    }}>{idx + 1}</div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#3B2F8F' }}>
                      {allDrugs.find(d => String(d.id) === String(drug.drug_id))?.name || `Drug ${idx + 1}`}
                    </span>
                  </div>
                  {drugs.length > 1 && (
                    <button type="button" className="remove-btn" onClick={() => removeDrug(drug._id)} style={{
                      padding: '5px 12px', borderRadius: '8px', cursor: 'pointer',
                      background: '#F7F8F3', color: '#6B6B80',
                      border: '1px solid #E2E4D0', fontFamily: 'inherit',
                      fontSize: '12px', fontWeight: '700', transition: 'all 0.15s',
                    }}>
                      Remove ✕
                    </button>
                  )}
                </div>

                {/* Drug row fields */}
                <div style={{ padding: '18px' }}>
                  {/* Drug selector */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={S.fieldLabel}>Drug</label>
                    <select value={drug.drug_id}
                      onChange={e => onDrugField(drug._id, 'drug_id', e.target.value)}
                      required style={S.select} onFocus={focusGreen} onBlur={focusOff}>
                      <option value="">Select drug</option>
                      {allDrugs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>

                  {/* Dose + Volume */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={S.fieldLabel}>Calculated Dose (mg)</label>
                      <input type="number" step="0.01" placeholder="e.g. 375"
                        value={drug.calculated_dose_mg}
                        onChange={e => onDrugField(drug._id, 'calculated_dose_mg', e.target.value)}
                        style={S.input} onFocus={focusGreen} onBlur={focusOff} />
                    </div>
                    <div>
                      <label style={S.fieldLabel}>Volume (mL)</label>
                      <input type="number" step="0.01" placeholder="e.g. 7.5"
                        value={drug.volume_ml}
                        onChange={e => onDrugField(drug._id, 'volume_ml', e.target.value)}
                        style={S.input} onFocus={focusGreen} onBlur={focusOff} />
                    </div>
                  </div>

                  {/* Frequency + Duration */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={S.fieldLabel}>Frequency</label>
                      <select value={drug.frequency}
                        onChange={e => onDrugField(drug._id, 'frequency', e.target.value)}
                        style={S.select} onFocus={focusGreen} onBlur={focusOff}>
                        <option value="SID">SID — once daily</option>
                        <option value="BID">BID — twice daily</option>
                        <option value="TID">TID — three times daily</option>
                        <option value="QID">QID — four times daily</option>
                        <option value="EOD">EOD — every other day</option>
                        <option value="PRN">PRN — as needed</option>
                      </select>
                    </div>
                    <div>
                      <label style={S.fieldLabel}>Duration (days)</label>
                      <input type="number" min="1" placeholder="7"
                        value={drug.duration_days}
                        onChange={e => onDrugField(drug._id, 'duration_days', e.target.value)}
                        style={S.input} onFocus={focusGreen} onBlur={focusOff} />
                    </div>
                  </div>

                  {/* Per-drug notes */}
                  <div>
                    <label style={S.fieldLabel}>Drug-specific notes <span style={{ fontWeight: '400', textTransform: 'none', fontSize: '10px', color: '#C0C8D8', letterSpacing: 0 }}>(optional)</span></label>
                    <input type="text" placeholder="e.g. Give with food, monitor liver enzymes"
                      value={drug.notes}
                      onChange={e => onDrugField(drug._id, 'notes', e.target.value)}
                      style={S.input} onFocus={focusGreen} onBlur={focusOff} />
                  </div>
                </div>
              </div>
            ))}

            {/* Add drug prompt when only 1 drug */}
            {drugs.length === 1 && (
              <button type="button" className="add-drug-btn" onClick={addDrug} style={{
                width: '100%', padding: '13px', borderRadius: '14px', cursor: 'pointer',
                background: 'transparent', color: '#94A3B8',
                border: '2px dashed #E8EAF0', fontFamily: 'inherit',
                fontSize: '13px', fontWeight: '600', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                <span style={{ fontSize: '18px' }}>＋</span> Add another medication to this plan
              </button>
            )}
          </div>

          {/* ── Plan-wide vet notes ── */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px',
            boxShadow: '0 4px 16px -4px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.04)',
          }}>
            <label style={{ ...S.fieldLabel, color: '#8B9D00' }}>
              General Vet Notes <span style={{ fontWeight: '400', textTransform: 'none', fontSize: '10px', color: '#C0C8D8', letterSpacing: 0 }}>(applies to all drugs)</span>
            </label>
            <textarea value={planNotes} onChange={e => setPlanNotes(e.target.value)} rows={2}
              placeholder="Overall instructions for the owner, follow-up schedule, warnings..."
              style={{ ...S.input, resize: 'vertical', lineHeight: '1.65' }}
              onFocus={focusGreen} onBlur={focusOff} />
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="submit-btn" style={{
            width: '100%', background: 'linear-gradient(135deg, #8B9D00, #6B7A00)',
            color: 'white', border: 'none', borderRadius: '14px',
            padding: '16px', fontSize: '16px', fontWeight: '800',
            cursor: 'pointer', fontFamily: 'inherit',
            opacity: loading ? 0.6 : 1,
            boxShadow: '0 6px 20px rgba(139,157,0,0.35)',
            letterSpacing: '0.01em',
          }}>
            {loading
              ? '⏳ Generating...'
              : `📋 Generate Treatment Plan${drugs.length > 1 ? ` (${drugs.length} drugs)` : ''}`}
          </button>
        </form>

        {/* ── Result ── */}
        {result && (
          <div id="result-section" className="result-enter" style={{ marginTop: '28px' }}>

            {/* Plan IDs hero */}
            <div style={{
              background: 'linear-gradient(135deg, #3B2F8F, #5A4DB8)',
              borderRadius: '18px', padding: '28px', marginBottom: '16px',
              boxShadow: '0 12px 36px rgba(59,47,143,0.3)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
            }}>
              <div>
                <p style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
                  {result.length > 1 ? 'Plan IDs — share all with owner' : 'Treatment Plan ID'}
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'baseline' }}>
                  {result.map((r, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '48px', fontWeight: '800', color: 'white', lineHeight: 1, letterSpacing: '-0.02em' }}>
                        {r.plan.id}
                      </span>
                      {result.length > 1 && (
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0', fontWeight: '600' }}>
                          {allDrugs.find(d => String(d.id) === String(drugs[i]?.drug_id))?.name || `Drug ${i + 1}`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={copyIds} style={{
                background: 'rgba(255,255,255,0.15)', color: 'white',
                border: '1px solid rgba(255,255,255,0.25)', borderRadius: '12px',
                padding: '12px 22px', fontSize: '13px', fontWeight: '700',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
              >
                {copied ? '✓ Copied!' : '📋 Copy ID(s)'}
              </button>
            </div>

            {/* Per-drug summaries */}
            {result.map((r, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: '16px', padding: '22px', marginBottom: '12px',
                boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '8px', background: '#3B2F8F',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '800', flexShrink: 0,
                  }}>{i + 1}</div>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: '800', color: '#1A1A2E', margin: 0 }}>
                      Plan #{r.plan.id} — {allDrugs.find(d => String(d.id) === String(drugs[i]?.drug_id))?.name || 'Drug'}
                    </p>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
                      {r.plan.patient_name} · {r.plan.species} · {r.plan.weight_kg} kg
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
                  {[
                    { label: 'Dose',      value: `${r.plan.calculated_dose_mg} mg` },
                    { label: 'Frequency', value: r.plan.frequency },
                    { label: 'Duration',  value: `${r.plan.duration_days} days` },
                  ].map((s, j) => (
                    <div key={j} style={{ background: '#F7F8F3', borderRadius: '10px', padding: '10px 14px', border: '1px solid #ECEEF2' }}>
                      <p style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 3px' }}>{s.label}</p>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E', margin: 0 }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#F4F6DC', borderRadius: '12px', padding: '16px 18px', border: '1px solid #C8D800' }}>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#5A6600', margin: '0 0 10px' }}>
                    {r.instructions.summary}
                  </p>
                  <ol style={{ paddingLeft: '16px', margin: 0 }}>
                    {r.instructions.steps.map((step, k) => (
                      <li key={k} style={{ fontSize: '13px', color: '#6B7A00', lineHeight: '1.75', marginBottom: '4px', fontWeight: '500' }}>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}