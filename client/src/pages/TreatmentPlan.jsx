import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';

const S = {
  fieldLabel: {
    display: 'block', fontSize: '10px', fontWeight: '800', color: '#94A3B8',
    marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em',
  },
  input: {
    width: '100%', border: '1.5px solid #E8EAF0', borderRadius: '10px',
    padding: '11px 14px', fontSize: '14px', fontFamily: 'inherit',
    color: '#1A1A2E', background: 'white', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
  },
  select: {
    width: '100%', border: '1.5px solid #E8EAF0', borderRadius: '10px',
    padding: '11px 14px', fontSize: '14px', fontFamily: 'inherit',
    color: '#1A1A2E', background: 'white', outline: 'none',
    appearance: 'none', cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '36px',
    transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
  },
  card: {
    background: 'white', borderRadius: '18px', padding: '24px', marginBottom: '14px',
    boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)',
  },
};

const focusGreen  = e => { e.target.style.borderColor = '#8B9D00'; e.target.style.boxShadow = '0 0 0 3px rgba(139,157,0,0.1)'; };
const focusOff    = e => { e.target.style.borderColor = '#E8EAF0'; e.target.style.boxShadow = 'none'; };

export default function TreatmentPlan() {
  const user = JSON.parse(localStorage.getItem('vetdoze_user') || 'null');
  if (!user || user.role !== 'vet') return <Navigate to="/login" />;

  const [drugs, setDrugs]   = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [form, setForm]     = useState({
    patient_name: '', species: 'dog', breed_id: '',
    weight_kg: '', drug_id: '', calculated_dose_mg: '',
    volume_ml: '', frequency: 'BID', duration_days: 7, notes: '',
  });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied,  setCopied]  = useState(false);

  useEffect(() => { api.get('/drugs').then(r => setDrugs(r.data)); }, []);
  useEffect(() => { api.get(`/breeds?species=${form.species}`).then(r => setBreeds(r.data)); }, [form.species]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setResult(null);
    try {
      const res = await api.post('/treatment/generate', form);
      setResult(res.data);
      setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate plan.');
    } finally { setLoading(false); }
  };

  const copyId = () => {
    navigator.clipboard.writeText(String(result.plan.id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .result-enter { animation: fadeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
        .submit-btn { transition: all 0.18s ease; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(139,157,0,0.45) !important; }
      `}</style>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 32px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#1A1A2E', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Treatment Plan Generator
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0 }}>
            Fill in patient details — share the generated Plan ID with the owner.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Patient section */}
          <div style={S.card}>
            <p style={{ fontSize: '10px', fontWeight: '800', color: '#8B9D00', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8B9D00', display: 'inline-block' }}/>
              Patient Information
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={S.fieldLabel}>Patient name</label>
                <input name="patient_name" value={form.patient_name} onChange={handleChange}
                  required placeholder="e.g. Buddy" style={S.input}
                  onFocus={focusGreen} onBlur={focusOff} />
              </div>
              <div>
                <label style={S.fieldLabel}>Species</label>
                <select name="species" value={form.species} onChange={handleChange} style={S.select}
                  onFocus={focusGreen} onBlur={focusOff}>
                  <option value="dog">🐕 Dog</option>
                  <option value="cat">🐈 Cat</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={S.fieldLabel}>Breed</label>
                <select name="breed_id" value={form.breed_id} onChange={handleChange} style={S.select}
                  onFocus={focusGreen} onBlur={focusOff}>
                  <option value="">Select breed</option>
                  {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label style={S.fieldLabel}>Weight (kg)</label>
                <input name="weight_kg" value={form.weight_kg} onChange={handleChange}
                  required type="number" step="0.1" min="0.1" placeholder="e.g. 25"
                  style={S.input} onFocus={focusGreen} onBlur={focusOff} />
              </div>
            </div>
          </div>

          {/* Prescription section */}
          <div style={S.card}>
            <p style={{ fontSize: '10px', fontWeight: '800', color: '#8B9D00', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B2F8F', display: 'inline-block' }}/>
              Prescription Details
            </p>

            <div style={{ marginBottom: '14px' }}>
              <label style={S.fieldLabel}>Drug</label>
              <select name="drug_id" value={form.drug_id} onChange={handleChange} required style={S.select}
                onFocus={focusGreen} onBlur={focusOff}>
                <option value="">Select drug</option>
                {drugs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={S.fieldLabel}>Dose (mg)</label>
                <input name="calculated_dose_mg" value={form.calculated_dose_mg} onChange={handleChange}
                  type="number" step="0.01" placeholder="e.g. 375" style={S.input}
                  onFocus={focusGreen} onBlur={focusOff} />
              </div>
              <div>
                <label style={S.fieldLabel}>Volume (mL)</label>
                <input name="volume_ml" value={form.volume_ml} onChange={handleChange}
                  type="number" step="0.01" placeholder="e.g. 7.5" style={S.input}
                  onFocus={focusGreen} onBlur={focusOff} />
              </div>
              <div>
                <label style={S.fieldLabel}>Duration (days)</label>
                <input name="duration_days" value={form.duration_days} onChange={handleChange}
                  type="number" min="1" placeholder="7" style={S.input}
                  onFocus={focusGreen} onBlur={focusOff} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={S.fieldLabel}>Frequency</label>
              <select name="frequency" value={form.frequency} onChange={handleChange} style={S.select}
                onFocus={focusGreen} onBlur={focusOff}>
                <option value="SID">SID — once daily</option>
                <option value="BID">BID — twice daily</option>
                <option value="TID">TID — three times daily</option>
              </select>
            </div>

            <div>
              <label style={S.fieldLabel}>Vet notes <span style={{ fontWeight: '500', textTransform: 'none', fontSize: '10px', color: '#C0C8D8', letterSpacing: '0' }}>(optional)</span></label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                placeholder="Additional instructions for the owner..."
                style={{ ...S.input, resize: 'vertical', lineHeight: '1.65' }}
                onFocus={focusGreen} onBlur={focusOff} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn" style={{
            width: '100%', background: 'linear-gradient(135deg, #8B9D00, #6B7A00)',
            color: 'white', border: 'none', borderRadius: '14px',
            padding: '16px', fontSize: '16px', fontWeight: '800',
            cursor: 'pointer', fontFamily: 'inherit',
            opacity: loading ? 0.6 : 1,
            boxShadow: '0 6px 20px rgba(139,157,0,0.35)',
            letterSpacing: '0.01em',
          }}>
            {loading ? '⏳ Generating...' : '📋 Generate Treatment Plan'}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div id="result-section" className="result-enter" style={{ marginTop: '24px' }}>

            {/* Plan ID hero card */}
            <div style={{
              background: 'linear-gradient(135deg, #3B2F8F, #5A4DB8)',
              borderRadius: '18px', padding: '28px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '14px',
              boxShadow: '0 12px 36px rgba(59,47,143,0.3)',
            }}>
              <div>
                <p style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>
                  Treatment Plan ID
                </p>
                <p style={{ fontSize: '56px', fontWeight: '800', color: 'white', margin: '0 0 6px', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {result.plan.id}
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', margin: 0, fontWeight: '500' }}>
                  Share this ID with the pet owner
                </p>
              </div>
              <button onClick={copyId} style={{
                background: 'rgba(255,255,255,0.15)', color: 'white',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '12px', padding: '12px 22px',
                fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
              >
                {copied ? '✓ Copied!' : '📋 Copy ID'}
              </button>
            </div>

            {/* Summary card */}
            <div style={{
              background: 'white', borderRadius: '18px', padding: '24px',
              boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)',
            }}>
              <p style={{ fontSize: '10px', fontWeight: '800', color: '#8B9D00', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 18px' }}>
                Plan Summary
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                {[
                  { label: 'Patient',   value: result.plan.patient_name },
                  { label: 'Species',   value: result.plan.species },
                  { label: 'Weight',    value: `${result.plan.weight_kg} kg` },
                  { label: 'Frequency', value: result.plan.frequency },
                  { label: 'Dose',      value: `${result.plan.calculated_dose_mg} mg` },
                  { label: 'Duration',  value: `${result.plan.duration_days} days` },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: '#F7F8F3', borderRadius: '12px', padding: '12px 16px',
                    border: '1px solid #ECEEF2',
                  }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>
                      {s.label}
                    </p>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#1A1A2E', margin: 0, textTransform: 'capitalize' }}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{
                background: '#F4F6DC', borderRadius: '14px', padding: '18px 20px',
                border: '1px solid #C8D800',
              }}>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#5A6600', margin: '0 0 12px' }}>
                  {result.instructions.summary}
                </p>
                <ol style={{ paddingLeft: '18px', margin: 0 }}>
                  {result.instructions.steps.map((step, i) => (
                    <li key={i} style={{ fontSize: '13px', color: '#6B7A00', lineHeight: '1.75', marginBottom: '6px', fontWeight: '500' }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}