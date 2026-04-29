import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

const S = {
  sectionLabel: {
    fontSize: '10px', fontWeight: '800', color: '#8B9D00',
    textTransform: 'uppercase', letterSpacing: '0.1em',
    marginBottom: '18px', margin: '0 0 18px',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  fieldLabel: {
    display: 'block', fontSize: '10px', fontWeight: '700',
    color: '#94A3B8', marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.07em',
  },
  input: {
    width: '100%', border: '1.5px solid #E8EAF0', borderRadius: '10px',
    padding: '11px 14px', fontSize: '15px', fontWeight: '500',
    fontFamily: 'inherit', color: '#1A1A2E', background: 'white',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%', border: '1.5px solid #E8EAF0', borderRadius: '10px',
    padding: '11px 14px', fontSize: '15px', fontWeight: '500', fontFamily: 'inherit',
    color: '#1A1A2E', background: 'white', outline: 'none',
    appearance: 'none', cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
    paddingRight: '36px', boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  card: {
    background: 'white',
    borderRadius: '20px', padding: '28px', marginBottom: '16px',
    boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.04)',
  },
};

const Badge = ({ children, color = 'purple' }) => {
  const colors = {
    purple: { bg: '#EEEDFE', text: '#3B2F8F', border: '#C8C4F0' },
    green:  { bg: '#F4F6DC', text: '#5A6600', border: '#C8D800' },
    amber:  { bg: '#FFF8D6', text: '#8A6A00', border: '#F5C300' },
  };
  const c = colors[color] || colors.purple;
  return (
    <span style={{
      fontSize: '11px', fontWeight: '700', padding: '4px 12px',
      borderRadius: '20px', display: 'inline-block',
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      letterSpacing: '0.04em',
    }}>{children}</span>
  );
};

const focusStyle  = (e, active = true) => {
  e.target.style.borderColor = active ? '#8B9D00' : '#E8EAF0';
  e.target.style.boxShadow   = active ? '0 0 0 3px rgba(139,157,0,0.12)' : 'none';
};

export default function Calculator() {
  const [species, setSpecies]             = useState('dog');
  const [breeds, setBreeds]               = useState([]);
  const [breedId, setBreedId]             = useState('');
  const [weight, setWeight]               = useState('');
  const [weightUnit, setWeightUnit]       = useState('kg');
  const [drugs, setDrugs]                 = useState([]);
  const [drugId, setDrugId]               = useState('');
  const [drugDetail, setDrugDetail]       = useState(null);
  const [formulationId, setFormulationId] = useState('');
  const [dosageRange, setDosageRange]     = useState(null);
  const [selectedDose, setSelectedDose]   = useState(null);
  const [result, setResult]               = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [resultVisible, setResultVisible] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => { api.get('/drugs').then(r => setDrugs(r.data)); }, []);
  useEffect(() => {
    api.get(`/breeds?species=${species}`).then(r => { setBreeds(r.data); setBreedId(''); });
  }, [species]);
  useEffect(() => {
    if (drugId) {
      api.get(`/drugs/${drugId}`).then(r => {
        setDrugDetail(r.data); setFormulationId(''); setResult(null); setResultVisible(false);
        const range = r.data.dosage_ranges?.find(d => d.species === species);
        if (range) {
          setDosageRange(range);
          const mid = (parseFloat(range.min_dose_mg_per_kg) + parseFloat(range.max_dose_mg_per_kg)) / 2;
          setSelectedDose(parseFloat(mid.toFixed(4)));
        } else { setDosageRange(null); setSelectedDose(null); }
      });
    } else { setDrugDetail(null); setDosageRange(null); setSelectedDose(null); }
  }, [drugId, species]);

  useEffect(() => {
    if (result) {
      setResultVisible(false);
      requestAnimationFrame(() => setTimeout(() => setResultVisible(true), 30));
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [result]);

  const weightKg    = weightUnit === 'lbs' ? parseFloat(weight) * 0.453592 : parseFloat(weight);
  const previewDose = selectedDose && weight && !isNaN(weightKg)
    ? (weightKg * selectedDose).toFixed(3) : null;

  const getVolumePreview = () => {
    if (!previewDose || !formulationId || !drugDetail) return null;
    const form = drugDetail.formulations?.find(f => f.id === parseInt(formulationId));
    if (!form) return null;
    const vol = parseFloat(previewDose) / form.concentration_value;
    return { value: vol.toFixed(2), unit: form.form === 'tablet' ? 'tablets' : 'mL', form: form.concentration };
  };
  const volumePreview = getVolumePreview();

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError(''); setResult(null); setResultVisible(false); setLoading(true);
    try {
      const res = await api.post('/calculate/dose', {
        species, breed_id: breedId || null, weight_kg: weightKg,
        drug_id: parseInt(drugId),
        formulation_id: formulationId ? parseInt(formulationId) : null,
        selected_dose_mg_per_kg: selectedDose,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Calculation failed.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .result-enter { animation: fadeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
        .species-btn:hover { transform: translateY(-1px); }
        input[type=range] { accent-color: #8B9D00; }
      `}</style>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#1A1A2E', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Dosage Calculator
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0 }}>
            Based on Plumb's Veterinary Drug Handbook — Desk Edition
          </p>
        </div>

        <form onSubmit={handleCalculate}>
          {/* Patient Info Card */}
          <div style={S.card}>
            <p style={S.sectionLabel}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8B9D00', display: 'inline-block' }}/>
              Patient Information
            </p>

            {/* Species */}
            <div style={{ marginBottom: '20px' }}>
              <label style={S.fieldLabel}>Species</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['dog', 'cat'].map(s => (
                  <button key={s} type="button" className="species-btn"
                    onClick={() => { setSpecies(s); setResult(null); setResultVisible(false); }}
                    style={{
                      flex: 1, padding: '14px', borderRadius: '12px', cursor: 'pointer',
                      border: species === s ? '2px solid #8B9D00' : '2px solid #E8EAF0',
                      background: species === s ? '#F4F6DC' : 'white',
                      fontFamily: 'inherit', fontSize: '14px', fontWeight: '700',
                      color: species === s ? '#5A6600' : '#94A3B8',
                      transition: 'all 0.18s ease',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      boxShadow: species === s ? '0 4px 12px rgba(139,157,0,0.15)' : '0 1px 4px rgba(0,0,0,0.04)',
                    }}>
                    <span style={{ fontSize: '20px' }}>{s === 'dog' ? '🐕' : '🐈'}</span>
                    <span>{s === 'dog' ? 'Dog' : 'Cat'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Breed + Weight */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={S.fieldLabel}>Breed <span style={{ textTransform: 'none', fontSize: '10px', color: '#C0C8D8' }}>(optional)</span></label>
                <select value={breedId} onChange={e => setBreedId(e.target.value)} style={S.select}
                  onFocus={e => focusStyle(e)} onBlur={e => focusStyle(e, false)}>
                  <option value="">Any breed</option>
                  {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label style={S.fieldLabel}>Body Weight</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" value={weight}
                    onChange={e => { setWeight(e.target.value); setResult(null); setResultVisible(false); }}
                    placeholder="e.g. 25" min="0.1" step="0.1" required
                    style={{ ...S.input, flex: 1 }}
                    onFocus={e => focusStyle(e)} onBlur={e => focusStyle(e, false)}
                  />
                  <select value={weightUnit} onChange={e => setWeightUnit(e.target.value)}
                    style={{ ...S.select, width: '72px' }}>
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Drug */}
            <div>
              <label style={S.fieldLabel}>Drug</label>
              <select value={drugId} onChange={e => setDrugId(e.target.value)} required style={S.select}
                onFocus={e => focusStyle(e)} onBlur={e => focusStyle(e, false)}>
                <option value="">Select a drug</option>
                {drugs.map(d => <option key={d.id} value={d.id}>{d.name} — {d.drug_class}</option>)}
              </select>
            </div>
          </div>

          {/* Dosage Slider Card */}
          {dosageRange && (
            <div style={{
              ...S.card,
              border: '2px solid #C8D800',
              boxShadow: '0 4px 20px -4px rgba(139,157,0,0.18)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <p style={{ ...S.sectionLabel, margin: 0 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8B9D00', display: 'inline-block' }}/>
                  Dosage Selection
                </p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <Badge color="green">{dosageRange.route}</Badge>
                  <Badge color="purple">{dosageRange.frequency}</Badge>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>Min</span>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#1A1A2E' }}>{dosageRange.min_dose_mg_per_kg}</span>
                  <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '3px' }}>mg/kg</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>Max</span>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#1A1A2E' }}>{dosageRange.max_dose_mg_per_kg}</span>
                  <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '3px' }}>mg/kg</span>
                </div>
              </div>

              <input type="range"
                min={parseFloat(dosageRange.min_dose_mg_per_kg)}
                max={parseFloat(dosageRange.max_dose_mg_per_kg)}
                step="0.0001"
                value={selectedDose || parseFloat(dosageRange.min_dose_mg_per_kg)}
                onChange={e => { setSelectedDose(parseFloat(e.target.value)); setResult(null); setResultVisible(false); }}
                style={{ width: '100%', marginBottom: '14px', height: '4px', cursor: 'pointer' }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8' }}>Selected dose</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="number"
                    min={parseFloat(dosageRange.min_dose_mg_per_kg)}
                    max={parseFloat(dosageRange.max_dose_mg_per_kg)}
                    step="0.0001" value={selectedDose || ''}
                    onChange={e => {
                      const val = parseFloat(e.target.value);
                      if (val >= parseFloat(dosageRange.min_dose_mg_per_kg) && val <= parseFloat(dosageRange.max_dose_mg_per_kg)) {
                        setSelectedDose(val); setResult(null); setResultVisible(false);
                      }
                    }}
                    style={{
                      width: '120px', border: '2px solid #8B9D00', borderRadius: '8px',
                      padding: '8px 10px', fontSize: '16px', fontWeight: '700',
                      color: '#1A1A2E', background: '#F4F6DC', textAlign: 'center',
                      fontFamily: 'inherit', outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#8B9D00' }}>mg/kg</span>
                </div>
              </div>

              {previewDose && (
                <div style={{
                  marginTop: '14px', background: '#F4F6DC', borderRadius: '12px',
                  padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  border: '1px solid #C8D800',
                }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#8B9D00', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>Live Preview</span>
                    <span style={{ fontSize: '12px', color: '#6B7A00' }}>{weight} {weightUnit} patient</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '26px', fontWeight: '800', color: '#5A6600', lineHeight: 1 }}>{previewDose}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#8B9D00', marginLeft: '4px' }}>mg</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Formulation Card */}
          {drugDetail?.formulations?.length > 0 && (
            <div style={S.card}>
              <p style={S.sectionLabel}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B2F8F', display: 'inline-block' }}/>
                Formulation
                <span style={{ color: '#94A3B8', fontWeight: '500', textTransform: 'none', fontSize: '11px', letterSpacing: '0' }}>optional — for volume calc</span>
              </p>
              <select value={formulationId}
                onChange={e => { setFormulationId(e.target.value); setResult(null); setResultVisible(false); }}
                style={S.select}
                onFocus={e => { e.target.style.borderColor = '#5A4DB8'; e.target.style.boxShadow = '0 0 0 3px rgba(90,77,184,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#E8EAF0'; e.target.style.boxShadow = 'none'; }}
              >
                <option value="">No formulation — show mg only</option>
                {drugDetail.formulations.map(f => (
                  <option key={f.id} value={f.id}>{f.form} — {f.concentration}</option>
                ))}
              </select>

              {volumePreview && (
                <div style={{
                  marginTop: '12px', background: '#EEEDFE', borderRadius: '12px',
                  padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  border: '1px solid #C8C4F0',
                }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#5A4DB8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>Volume</span>
                    <span style={{ fontSize: '12px', color: '#3B2F8F' }}>{volumePreview.form}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '26px', fontWeight: '800', color: '#3B2F8F', lineHeight: 1 }}>{volumePreview.value}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#5A4DB8', marginLeft: '4px' }}>{volumePreview.unit}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div style={{
              background: '#FCEBEB', border: '1px solid #F7C1C1', borderRadius: '12px',
              padding: '14px 18px', fontSize: '14px', color: '#A32D2D', marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading || !drugId || !weight} style={{
            width: '100%', background: 'linear-gradient(135deg, #8B9D00, #6B7A00)',
            color: 'white', border: 'none', borderRadius: '14px',
            padding: '16px', fontSize: '16px', fontWeight: '800',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
            opacity: (loading || !drugId || !weight) ? 0.5 : 1,
            boxShadow: (!loading && drugId && weight) ? '0 6px 20px rgba(139,157,0,0.35)' : 'none',
            letterSpacing: '0.02em',
          }}
            onMouseEnter={e => { if (!loading && drugId && weight) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(139,157,0,0.45)'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = (!loading && drugId && weight) ? '0 6px 20px rgba(139,157,0,0.35)' : 'none'; }}
          >
            {loading ? '⏳  Calculating...' : '🧮  Calculate Dose'}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div ref={resultRef} className={resultVisible ? 'result-enter' : ''} style={{ marginTop: '24px', opacity: 0 }}>
            <CalculationResult result={result} />
          </div>
        )}
      </div>
    </>
  );
}

function CalculationResult({ result }) {
  return (
    <div>
      {result.warnings?.length > 0 && result.warnings.map((w, i) => (
        <div key={i} style={{
          background: '#FCEBEB', border: '1.5px solid #F7C1C1', borderRadius: '16px',
          padding: '16px 20px', marginBottom: '12px',
          boxShadow: '0 4px 16px rgba(163,45,45,0.08)',
        }}>
          <p style={{ fontWeight: '800', color: '#A32D2D', marginBottom: '4px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            ⚠️ Breed Warning — <span style={{ color: '#C94040' }}>{w.severity.toUpperCase()}</span>
          </p>
          <p style={{ fontSize: '13px', color: '#791F1F', margin: 0, lineHeight: '1.6' }}>{w.warning_note}</p>
        </div>
      ))}

      <div style={{
        background: 'white', border: '2px solid #8B9D00', borderRadius: '20px', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(139,157,0,0.15)',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #6B7A00, #8B9D00)',
          padding: '20px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'white', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
              {result.drug.name}
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', margin: 0 }}>
              {result.patient.weight_kg} kg {result.patient.species}
            </p>
          </div>
          <span style={{
            fontSize: '11px', fontWeight: '700', padding: '5px 14px',
            borderRadius: '20px', background: 'rgba(255,255,255,0.2)',
            color: 'white', letterSpacing: '0.04em',
          }}>{result.drug.class}</span>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Dose cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {[
              { label: 'Min dose', value: result.calculation.min_dose_mg, accent: false },
              { label: 'Recommended', value: result.calculation.recommended_dose_mg, accent: true },
              { label: 'Max dose', value: result.calculation.max_dose_mg, accent: false },
            ].map((d, i) => (
              <div key={i} style={{
                background: d.accent ? 'linear-gradient(135deg, #8B9D00, #6B7A00)' : '#F7F8F3',
                borderRadius: '14px', padding: '18px 12px', textAlign: 'center',
                border: d.accent ? 'none' : '1px solid #E8EAF0',
                boxShadow: d.accent ? '0 4px 16px rgba(139,157,0,0.25)' : '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <p style={{ fontSize: '10px', fontWeight: '700', color: d.accent ? 'rgba(255,255,255,0.75)' : '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>
                  {d.label}
                </p>
                <p style={{ fontSize: '24px', fontWeight: '800', color: d.accent ? 'white' : '#1A1A2E', margin: '0 0 2px', lineHeight: 1 }}>
                  {d.value}
                </p>
                <p style={{ fontSize: '11px', fontWeight: '600', color: d.accent ? 'rgba(255,255,255,0.6)' : '#94A3B8', margin: 0 }}>mg</p>
              </div>
            ))}
          </div>

          {/* Volume */}
          {result.administration && (
            <div style={{
              background: '#EEEDFE', borderRadius: '14px', padding: '18px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '16px', border: '1px solid #C8C4F0',
            }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#5A4DB8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '2px' }}>Volume to Administer</span>
                <span style={{ fontSize: '13px', color: '#3B2F8F' }}>Based on selected formulation</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '28px', fontWeight: '800', color: '#3B2F8F', lineHeight: 1 }}>
                  {result.administration.volume || result.administration.tablets}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#5A4DB8', marginLeft: '4px' }}>
                  {result.administration.unit}
                </span>
              </div>
            </div>
          )}

          {/* Schedule */}
          <div style={{ borderTop: '1px solid #F0F2F5', paddingTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Route',     value: result.schedule.route },
              { label: 'Frequency', value: result.schedule.frequency },
              ...(result.schedule.duration_notes ? [{ label: 'Duration', value: result.schedule.duration_notes }] : []),
            ].map((s, i) => (
              <div key={i} style={{
                background: '#F7F8F3', borderRadius: '10px', padding: '10px 16px',
                border: '1px solid #E8EAF0', flex: '1 1 auto', minWidth: '80px',
              }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>{s.label}</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#1A1A2E' }}>{s.value}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '11px', color: '#C0C8D8', marginTop: '14px', margin: '14px 0 0' }}>
            Source: {result.source}
          </p>
        </div>
      </div>
    </div>
  );
}