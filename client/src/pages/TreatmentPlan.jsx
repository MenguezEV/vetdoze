import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';

const S = {
  label: {
    display:'block', fontSize:'11px', fontWeight:'700', color:'#6B6B80',
    marginBottom:'5px', textTransform:'uppercase', letterSpacing:'0.07em',
  },
  input: {
    width:'100%', border:'1.5px solid #E2E4D0', borderRadius:'10px',
    padding:'10px 13px', fontSize:'13px', fontFamily:'inherit',
    color:'#1A1A2E', background:'white', outline:'none', transition:'border-color 0.2s',
  },
  select: {
    width:'100%', border:'1.5px solid #E2E4D0', borderRadius:'10px',
    padding:'10px 13px', fontSize:'13px', fontFamily:'inherit',
    color:'#1A1A2E', background:'white', outline:'none',
    appearance:'none', cursor:'pointer',
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B6B80' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', paddingRight:'32px',
  },
};

export default function TreatmentPlan() {
  const user = JSON.parse(localStorage.getItem('vetdoze_user') || 'null');
  if (!user || user.role !== 'vet') return <Navigate to="/login" />;

  const [drugs, setDrugs]   = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [form, setForm]     = useState({
    patient_name:'', species:'dog', breed_id:'',
    weight_kg:'', drug_id:'', calculated_dose_mg:'',
    volume_ml:'', frequency:'BID', duration_days:7, notes:'',
  });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);

  useEffect(() => { api.get('/drugs').then(r => setDrugs(r.data)); }, []);
  useEffect(() => { api.get(`/breeds?species=${form.species}`).then(r => setBreeds(r.data)); }, [form.species]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setResult(null);
    try {
      const res = await api.post('/treatment/generate', form);
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate plan.');
    } finally { setLoading(false); }
  };

  const copyId = () => {
    navigator.clipboard.writeText(String(result.plan.id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const focusOn  = e => e.target.style.borderColor = '#8B9D00';
  const focusOff = e => e.target.style.borderColor = '#E2E4D0';

  return (
    <div style={{ maxWidth:'680px', margin:'0 auto', padding:'40px 32px' }}>

      {/* Header */}
      <div style={{ marginBottom:'28px' }}>
        <h1 style={{ fontSize:'28px', fontWeight:'800', color:'#1A1A2E', margin:'0 0 6px' }}>
          Treatment Plan Generator
        </h1>
        <p style={{ fontSize:'14px', color:'#6B6B80', margin:0 }}>
          Fill in the patient details — the generated Plan ID can be shared with the pet owner.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section: Patient */}
        <div style={{
          background:'white', border:'1px solid #E2E4D0',
          borderRadius:'16px', padding:'24px', marginBottom:'16px',
        }}>
          <p style={{ fontSize:'11px', fontWeight:'700', color:'#8B9D00',
            textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 18px' }}>
            Patient Information
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px' }}>
            <div>
              <label style={S.label}>Patient name</label>
              <input name="patient_name" value={form.patient_name} onChange={handleChange}
                required placeholder="e.g. Buddy" style={S.input}
                onFocus={focusOn} onBlur={focusOff}/>
            </div>
            <div>
              <label style={S.label}>Species</label>
              <select name="species" value={form.species} onChange={handleChange} style={S.select}>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
              </select>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            <div>
              <label style={S.label}>Breed</label>
              <select name="breed_id" value={form.breed_id} onChange={handleChange} style={S.select}>
                <option value="">Select breed</option>
                {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>Weight (kg)</label>
              <input name="weight_kg" value={form.weight_kg} onChange={handleChange}
                required type="number" step="0.1" min="0.1" placeholder="e.g. 25"
                style={S.input} onFocus={focusOn} onBlur={focusOff}/>
            </div>
          </div>
        </div>

        {/* Section: Prescription */}
        <div style={{
          background:'white', border:'1px solid #E2E4D0',
          borderRadius:'16px', padding:'24px', marginBottom:'16px',
        }}>
          <p style={{ fontSize:'11px', fontWeight:'700', color:'#8B9D00',
            textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 18px' }}>
            Prescription Details
          </p>

          <div style={{ marginBottom:'14px' }}>
            <label style={S.label}>Drug</label>
            <select name="drug_id" value={form.drug_id} onChange={handleChange} required style={S.select}>
              <option value="">Select drug</option>
              {drugs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'14px', marginBottom:'14px' }}>
            <div>
              <label style={S.label}>Dose (mg)</label>
              <input name="calculated_dose_mg" value={form.calculated_dose_mg} onChange={handleChange}
                type="number" step="0.01" placeholder="e.g. 375" style={S.input}
                onFocus={focusOn} onBlur={focusOff}/>
            </div>
            <div>
              <label style={S.label}>Volume (mL)</label>
              <input name="volume_ml" value={form.volume_ml} onChange={handleChange}
                type="number" step="0.01" placeholder="e.g. 7.5" style={S.input}
                onFocus={focusOn} onBlur={focusOff}/>
            </div>
            <div>
              <label style={S.label}>Duration (days)</label>
              <input name="duration_days" value={form.duration_days} onChange={handleChange}
                type="number" min="1" placeholder="7" style={S.input}
                onFocus={focusOn} onBlur={focusOff}/>
            </div>
          </div>

          <div style={{ marginBottom:'14px' }}>
            <label style={S.label}>Frequency</label>
            <select name="frequency" value={form.frequency} onChange={handleChange} style={S.select}>
              <option value="SID">SID — once daily</option>
              <option value="BID">BID — twice daily</option>
              <option value="TID">TID — three times daily</option>
            </select>
          </div>

          <div>
            <label style={S.label}>Vet notes <span style={{ fontWeight:'400', textTransform:'none' }}>(optional)</span></label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
              placeholder="Additional instructions for the owner..."
              style={{ ...S.input, resize:'vertical' }}
              onFocus={focusOn} onBlur={focusOff}/>
          </div>
        </div>

        <button type="submit" disabled={loading} style={{
          width:'100%', background:'#8B9D00', color:'white', border:'none',
          borderRadius:'12px', padding:'14px', fontSize:'15px', fontWeight:'700',
          cursor:'pointer', fontFamily:'inherit', transition:'background 0.2s',
          opacity: loading ? 0.6 : 1,
        }}>
          {loading ? 'Generating...' : 'Generate Treatment Plan'}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div style={{ marginTop:'20px' }}>

          {/* Plan ID card */}
          <div style={{
            background:'linear-gradient(135deg,#3B2F8F,#5A4DB8)',
            borderRadius:'16px', padding:'24px',
            display:'flex', justifyContent:'space-between', alignItems:'center',
            marginBottom:'16px',
          }}>
            <div>
              <p style={{ fontSize:'11px', fontWeight:'700', color:'rgba(255,255,255,0.6)',
                textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 4px' }}>
                Treatment Plan ID
              </p>
              <p style={{ fontSize:'48px', fontWeight:'800', color:'white', margin:'0 0 4px', lineHeight:1 }}>
                {result.plan.id}
              </p>
              <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)', margin:0 }}>
                Share this ID with the pet owner
              </p>
            </div>
            <button onClick={copyId} style={{
              background:'rgba(255,255,255,0.15)', color:'white',
              border:'1px solid rgba(255,255,255,0.3)',
              borderRadius:'10px', padding:'10px 20px',
              fontSize:'13px', fontWeight:'700', cursor:'pointer', fontFamily:'inherit',
              transition:'background 0.2s',
            }}>
              {copied ? '✓ Copied!' : '📋 Copy ID'}
            </button>
          </div>

          {/* Summary */}
          <div style={{
            background:'white', border:'1px solid #E2E4D0',
            borderRadius:'16px', padding:'24px',
          }}>
            <p style={{ fontSize:'11px', fontWeight:'700', color:'#8B9D00',
              textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 16px' }}>
              Plan Summary
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'16px' }}>
              {[
                { label:'Patient',   value: result.plan.patient_name },
                { label:'Species',   value: result.plan.species },
                { label:'Weight',    value: `${result.plan.weight_kg} kg` },
                { label:'Frequency', value: result.plan.frequency },
                { label:'Dose',      value: `${result.plan.calculated_dose_mg} mg` },
                { label:'Duration',  value: `${result.plan.duration_days} days` },
              ].map((s,i) => (
                <div key={i} style={{ background:'#F7F8F3', borderRadius:'10px', padding:'10px 14px' }}>
                  <p style={{ fontSize:'11px', color:'#6B6B80', textTransform:'uppercase',
                    letterSpacing:'0.06em', margin:'0 0 2px' }}>{s.label}</p>
                  <p style={{ fontSize:'14px', fontWeight:'700', color:'#1A1A2E', margin:0, textTransform:'capitalize' }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ background:'#F4F6DC', borderRadius:'12px', padding:'16px' }}>
              <p style={{ fontSize:'13px', fontWeight:'700', color:'#5A6600', margin:'0 0 10px' }}>
                {result.instructions.summary}
              </p>
              <ol style={{ paddingLeft:'16px', margin:0 }}>
                {result.instructions.steps.map((step,i) => (
                  <li key={i} style={{ fontSize:'13px', color:'#6B7A00', lineHeight:'1.7', marginBottom:'4px' }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}