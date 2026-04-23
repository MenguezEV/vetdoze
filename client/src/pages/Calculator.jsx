import { useState, useEffect } from 'react';
import api from '../utils/api';

const S = {
  label: {
    display: 'block', fontSize: '13px', fontWeight: '600',
    color: '#6B6B80', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em'
  },
  input: {
    width: '100%', border: '1.5px solid #E2E4D0', borderRadius: '10px',
    padding: '11px 14px', fontSize: '14px', fontFamily: 'inherit',
    color: '#1A1A2E', background: 'white', outline: 'none', transition: 'border-color 0.2s'
  },
  select: {
    width: '100%', border: '1.5px solid #E2E4D0', borderRadius: '10px',
    padding: '11px 14px', fontSize: '14px', fontFamily: 'inherit',
    color: '#1A1A2E', background: 'white', outline: 'none',
    appearance: 'none', cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B6B80' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
    paddingRight: '36px',
  },
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

  useEffect(() => { api.get('/drugs').then(r => setDrugs(r.data)); }, []);

  useEffect(() => {
    api.get(`/breeds?species=${species}`).then(r => { setBreeds(r.data); setBreedId(''); });
  }, [species]);

  useEffect(() => {
    if (drugId) {
      api.get(`/drugs/${drugId}`).then(r => {
        setDrugDetail(r.data);
        setFormulationId('');
        setResult(null);
        const range = r.data.dosage_ranges?.find(d => d.species === species);
        if (range) {
          setDosageRange(range);
          const mid = (parseFloat(range.min_dose_mg_per_kg) + parseFloat(range.max_dose_mg_per_kg)) / 2;
          setSelectedDose(parseFloat(mid.toFixed(4)));
        } else { setDosageRange(null); setSelectedDose(null); }
      });
    } else { setDrugDetail(null); setDosageRange(null); setSelectedDose(null); }
  }, [drugId, species]);

  const weightKg = weightUnit === 'lbs' ? parseFloat(weight) * 0.453592 : parseFloat(weight);
  const previewDose = selectedDose && weight && !isNaN(weightKg) ? (weightKg * selectedDose).toFixed(3) : null;

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
    setError(''); setResult(null); setLoading(true);
    try {
      const res = await api.post('/calculate/dose', {
        species, breed_id: breedId || null, weight_kg: weightKg,
        drug_id: parseInt(drugId),
        formulation_id: formulationId ? parseInt(formulationId) : null,
        selected_dose_mg_per_kg: selectedDose
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Calculation failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A2E', margin: '0 0 6px' }}>
          Dosage Calculator
        </h1>
        <p style={{ fontSize: '14px', color: '#6B6B80', margin: 0 }}>
          Based on Plumb's Veterinary Drug Handbook — Desk Edition
        </p>
      </div>

      <form onSubmit={handleCalculate}>
        <div style={{
          background: 'white', border: '1px solid #E2E4D0',
          borderRadius: '20px', padding: '28px', marginBottom: '20px'
        }}>
          <p style={{ fontSize: '13px', fontWeight: '700', color: '#8B9D00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
            Patient Information
          </p>

          {/* Species */}
          <div style={{ marginBottom: '20px' }}>
            <label style={S.label}>Species</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['dog', 'cat'].map(s => (
                <button key={s} type="button" onClick={() => { setSpecies(s); setResult(null); }} style={{
                  flex: 1, padding: '12px', borderRadius: '10px', cursor: 'pointer',
                  border: species === s ? '2px solid #8B9D00' : '1.5px solid #E2E4D0',
                  background: species === s ? '#F4F6DC' : 'white',
                  fontFamily: 'inherit', fontSize: '14px', fontWeight: '600',
                  color: species === s ? '#6B7A00' : '#6B6B80', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}>
                  {s === 'dog' ? '🐕 Dog' : '🐈 Cat'}
                </button>
              ))}
            </div>
          </div>

          {/* Breed + Weight */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={S.label}>Breed <span style={{ textTransform: 'none', fontSize: '11px', color: '#A0A0B0' }}>(optional)</span></label>
              <select value={breedId} onChange={e => setBreedId(e.target.value)} style={S.select}>
                <option value="">Select breed</option>
                {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>Body Weight</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="number" value={weight} onChange={e => { setWeight(e.target.value); setResult(null); }}
                  placeholder="e.g. 25" min="0.1" step="0.1" required
                  style={{ ...S.input, flex: 1 }}
                  onFocus={e => e.target.style.borderColor = '#8B9D00'}
                  onBlur={e => e.target.style.borderColor = '#E2E4D0'}
                />
                <select value={weightUnit} onChange={e => setWeightUnit(e.target.value)} style={{ ...S.select, width: '70px' }}>
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>
          </div>

          {/* Drug */}
          <div>
            <label style={S.label}>Drug</label>
            <select value={drugId} onChange={e => setDrugId(e.target.value)} required style={S.select}>
              <option value="">Select drug</option>
              {drugs.map(d => <option key={d.id} value={d.id}>{d.name} — {d.drug_class}</option>)}
            </select>
          </div>
        </div>

        {/* Dosage range slider */}
        {dosageRange && (
          <div style={{
            background: 'white', border: '2px solid #8B9D00',
            borderRadius: '20px', padding: '24px', marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <p style={{ fontSize: '13px', fontWeight: '700', color: '#8B9D00', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Dosage Selection
              </p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ background: '#F4F6DC', color: '#6B7A00', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>
                  {dosageRange.route}
                </span>
                <span style={{ background: '#EEEDFE', color: '#3B2F8F', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>
                  {dosageRange.frequency}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B6B80', marginBottom: '8px' }}>
              <span>Min: <strong style={{ color: '#1A1A2E' }}>{dosageRange.min_dose_mg_per_kg} mg/kg</strong></span>
              <span>Max: <strong style={{ color: '#1A1A2E' }}>{dosageRange.max_dose_mg_per_kg} mg/kg</strong></span>
            </div>

            <input type="range"
              min={parseFloat(dosageRange.min_dose_mg_per_kg)}
              max={parseFloat(dosageRange.max_dose_mg_per_kg)}
              step="0.0001"
              value={selectedDose || parseFloat(dosageRange.min_dose_mg_per_kg)}
              onChange={e => { setSelectedDose(parseFloat(e.target.value)); setResult(null); }}
              style={{ width: '100%', accentColor: '#8B9D00', marginBottom: '12px' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: '#6B6B80' }}>Selected dose:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="number"
                  min={parseFloat(dosageRange.min_dose_mg_per_kg)}
                  max={parseFloat(dosageRange.max_dose_mg_per_kg)}
                  step="0.0001" value={selectedDose || ''}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    if (val >= parseFloat(dosageRange.min_dose_mg_per_kg) && val <= parseFloat(dosageRange.max_dose_mg_per_kg)) {
                      setSelectedDose(val); setResult(null);
                    }
                  }}
                  style={{ width: '110px', border: '1.5px solid #8B9D00', borderRadius: '8px', padding: '8px 10px', fontSize: '14px', fontWeight: '600', color: '#1A1A2E', background: '#F4F6DC', textAlign: 'center', fontFamily: 'inherit', outline: 'none' }}
                />
                <span style={{ fontSize: '13px', color: '#6B6B80' }}>mg/kg</span>
              </div>
            </div>

            {previewDose && (
              <div style={{
                marginTop: '12px', background: '#F4F6DC', borderRadius: '10px',
                padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span style={{ fontSize: '13px', color: '#6B7A00' }}>
                  Live dose preview for <strong>{weight} {weightUnit}</strong>
                </span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#6B7A00' }}>{previewDose} mg</span>
              </div>
            )}
          </div>
        )}

        {/* Formulation */}
        {drugDetail?.formulations?.length > 0 && (
          <div style={{
            background: 'white', border: '1px solid #E2E4D0',
            borderRadius: '20px', padding: '24px', marginBottom: '20px'
          }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#8B9D00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Formulation <span style={{ color: '#A0A0B0', fontWeight: '400', textTransform: 'none', fontSize: '12px' }}>(optional — for volume calculation)</span>
            </p>
            <select value={formulationId} onChange={e => { setFormulationId(e.target.value); setResult(null); }} style={S.select}>
              <option value="">No formulation — show mg only</option>
              {drugDetail.formulations.map(f => (
                <option key={f.id} value={f.id}>{f.form} — {f.concentration}</option>
              ))}
            </select>

            {volumePreview && (
              <div style={{
                marginTop: '12px', background: '#EEEDFE', borderRadius: '10px',
                padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span style={{ fontSize: '13px', color: '#3B2F8F' }}>
                  Volume to administer ({volumePreview.form})
                </span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#3B2F8F' }}>
                  {volumePreview.value} {volumePreview.unit}
                </span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{
            background: '#FCEBEB', border: '1px solid #F7C1C1', borderRadius: '12px',
            padding: '14px', fontSize: '14px', color: '#A32D2D', marginBottom: '16px'
          }}>{error}</div>
        )}

        <button type="submit" disabled={loading || !drugId || !weight} style={{
          width: '100%', background: '#8B9D00', color: 'white', border: 'none',
          borderRadius: '12px', padding: '15px', fontSize: '16px', fontWeight: '700',
          cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s',
          opacity: (loading || !drugId || !weight) ? 0.5 : 1,
        }}>
          {loading ? 'Calculating...' : 'Calculate Dose'}
        </button>
      </form>

      {result && <CalculationResult result={result} />}
    </div>
  );
}

function CalculationResult({ result }) {
  return (
    <div style={{ marginTop: '24px' }}>
      {result.warnings?.length > 0 && result.warnings.map((w, i) => (
        <div key={i} style={{
          background: '#FCEBEB', border: '1.5px solid #F7C1C1', borderRadius: '16px',
          padding: '16px 20px', marginBottom: '12px'
        }}>
          <p style={{ fontWeight: '700', color: '#A32D2D', marginBottom: '4px', fontSize: '14px' }}>
            ⚠️ Breed-Specific Warning — {w.severity.toUpperCase()}
          </p>
          <p style={{ fontSize: '13px', color: '#791F1F', margin: 0 }}>{w.warning_note}</p>
        </div>
      ))}

      <div style={{
        background: 'white', border: '2px solid #8B9D00',
        borderRadius: '20px', padding: '28px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A2E', margin: '0 0 4px' }}>
              {result.drug.name}
            </h2>
            <p style={{ fontSize: '13px', color: '#6B6B80', margin: 0 }}>
              {result.patient.weight_kg} kg {result.patient.species}
            </p>
          </div>
          <span style={{ background: '#F4F6DC', color: '#6B7A00', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>
            {result.drug.class}
          </span>
        </div>

        {/* Dose cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          {[
            { label: 'Min dose', value: result.calculation.min_dose_mg, accent: false },
            { label: 'Recommended', value: result.calculation.recommended_dose_mg, accent: true },
            { label: 'Max dose', value: result.calculation.max_dose_mg, accent: false },
          ].map((d, i) => (
            <div key={i} style={{
              background: d.accent ? '#8B9D00' : '#F7F8F3',
              borderRadius: '12px', padding: '16px', textAlign: 'center',
              border: d.accent ? 'none' : '1px solid #E2E4D0'
            }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: d.accent ? 'rgba(255,255,255,0.8)' : '#6B6B80', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>
                {d.label}
              </p>
              <p style={{ fontSize: '22px', fontWeight: '700', color: d.accent ? 'white' : '#1A1A2E', margin: '0 0 2px' }}>
                {d.value}
              </p>
              <p style={{ fontSize: '12px', color: d.accent ? 'rgba(255,255,255,0.7)' : '#A0A0B0', margin: 0 }}>mg</p>
            </div>
          ))}
        </div>

        {/* Volume */}
        {result.administration && (
          <div style={{
            background: '#EEEDFE', borderRadius: '12px', padding: '16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'
          }}>
            <p style={{ fontSize: '14px', color: '#3B2F8F', margin: 0 }}>Volume to administer</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#3B2F8F', margin: 0 }}>
              {result.administration.volume || result.administration.tablets}
              <span style={{ fontSize: '14px', fontWeight: '400', marginLeft: '4px' }}>
                {result.administration.unit}
              </span>
            </p>
          </div>
        )}

        {/* Schedule */}
        <div style={{
          borderTop: '1px solid #E2E4D0', paddingTop: '16px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'
        }}>
          {[
            { label: 'Route', value: result.schedule.route },
            { label: 'Frequency', value: result.schedule.frequency },
            ...(result.schedule.duration_notes ? [{ label: 'Duration', value: result.schedule.duration_notes }] : []),
          ].map((s, i) => (
            <div key={i}>
              <span style={{ fontSize: '12px', color: '#6B6B80', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E', margin: '2px 0 0' }}>{s.value}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '11px', color: '#A0A0B0', marginTop: '12px', margin: '12px 0 0' }}>
          Source: {result.source}
        </p>
      </div>
    </div>
  );
}