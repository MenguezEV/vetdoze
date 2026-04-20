import { useState, useEffect } from 'react';
import api from '../utils/api';

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

  useEffect(() => {
    api.get('/drugs').then(r => setDrugs(r.data));
  }, []);

  useEffect(() => {
    api.get(`/breeds?species=${species}`).then(r => {
      setBreeds(r.data);
      setBreedId('');
    });
  }, [species]);

  useEffect(() => {
    if (drugId) {
      api.get(`/drugs/${drugId}`).then(r => {
        setDrugDetail(r.data);
        setFormulationId('');
        setResult(null);
        // Find dosage range for current species
        const range = r.data.dosage_ranges?.find(d => d.species === species);
        if (range) {
          setDosageRange(range);
          // Default slider to midpoint
          const mid = ((parseFloat(range.min_dose_mg_per_kg) + parseFloat(range.max_dose_mg_per_kg)) / 2);
          setSelectedDose(parseFloat(mid.toFixed(4)));
        } else {
          setDosageRange(null);
          setSelectedDose(null);
        }
      });
    } else {
      setDrugDetail(null);
      setDosageRange(null);
      setSelectedDose(null);
    }
  }, [drugId, species]);

  // Recalculate preview dose whenever slider or weight changes
  const weightKg = weightUnit === 'lbs'
    ? parseFloat(weight) * 0.453592
    : parseFloat(weight);

  const previewDose = selectedDose && weight && !isNaN(weightKg)
    ? (weightKg * selectedDose).toFixed(3)
    : null;

  // Calculate volume preview
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
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await api.post('/calculate/dose', {
        species,
        breed_id: breedId || null,
        weight_kg: weightKg,
        drug_id: parseInt(drugId),
        formulation_id: formulationId ? parseInt(formulationId) : null,
        selected_dose_mg_per_kg: selectedDose
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-teal-800 mb-2">Dosage Calculator</h1>
      <p className="text-gray-500 text-sm mb-6">Based on Plumb's Veterinary Drug Handbook — Desk Edition</p>

      <form onSubmit={handleCalculate} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">

        {/* Species */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
          <div className="flex gap-3">
            {['dog', 'cat'].map(s => (
              <button key={s} type="button" onClick={() => { setSpecies(s); setResult(null); }}
                className={`px-5 py-2 rounded-lg border text-sm font-medium capitalize transition
                  ${species === s ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400'}`}>
                {s === 'dog' ? '🐕 Dog' : '🐈 Cat'}
              </button>
            ))}
          </div>
        </div>

        {/* Breed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
          <select value={breedId} onChange={e => setBreedId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
            <option value="">Select breed (optional)</option>
            {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body Weight</label>
          <div className="flex gap-2">
            <input type="number" value={weight} onChange={e => { setWeight(e.target.value); setResult(null); }}
              placeholder="Enter weight" min="0.1" step="0.1" required
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"/>
            <select value={weightUnit} onChange={e => setWeightUnit(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>

        {/* Drug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Drug</label>
          <select value={drugId} onChange={e => setDrugId(e.target.value)} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
            <option value="">Select drug</option>
            {drugs.map(d => <option key={d.id} value={d.id}>{d.name} — {d.drug_class}</option>)}
          </select>
        </div>

        {/* DOSAGE RANGE SLIDER — shows after drug is selected */}
        {dosageRange && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-teal-800">Dosage Range</label>
              <span className="text-xs text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
                {dosageRange.route} · {dosageRange.frequency}
              </span>
            </div>

            {/* Range info */}
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Min: <strong className="text-gray-700">{dosageRange.min_dose_mg_per_kg} mg/kg</strong></span>
              <span>Max: <strong className="text-gray-700">{dosageRange.max_dose_mg_per_kg} mg/kg</strong></span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={parseFloat(dosageRange.min_dose_mg_per_kg)}
              max={parseFloat(dosageRange.max_dose_mg_per_kg)}
              step="0.0001"
              value={selectedDose || parseFloat(dosageRange.min_dose_mg_per_kg)}
              onChange={e => { setSelectedDose(parseFloat(e.target.value)); setResult(null); }}
              className="w-full accent-teal-600"
            />

            {/* Selected dose display */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Selected dose:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={parseFloat(dosageRange.min_dose_mg_per_kg)}
                  max={parseFloat(dosageRange.max_dose_mg_per_kg)}
                  step="0.0001"
                  value={selectedDose || ''}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    if (val >= parseFloat(dosageRange.min_dose_mg_per_kg) &&
                        val <= parseFloat(dosageRange.max_dose_mg_per_kg)) {
                      setSelectedDose(val);
                      setResult(null);
                    }
                  }}
                  className="w-28 border border-teal-300 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <span className="text-sm text-gray-500">mg/kg</span>
              </div>
            </div>

            {/* Live dose preview */}
            {previewDose && (
              <div className="bg-white border border-teal-200 rounded-lg px-4 py-2 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Calculated dose for <strong>{weight} {weightUnit}</strong>:
                </span>
                <span className="text-lg font-bold text-teal-700">{previewDose} mg</span>
              </div>
            )}
          </div>
        )}

        {/* Formulation */}
        {drugDetail?.formulations?.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Formulation
              <span className="ml-2 text-xs text-gray-400 font-normal">(select to calculate volume)</span>
            </label>
            <select value={formulationId} onChange={e => { setFormulationId(e.target.value); setResult(null); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
              <option value="">No formulation — show mg only</option>
              {drugDetail.formulations.map(f => (
                <option key={f.id} value={f.id}>{f.form} — {f.concentration}</option>
              ))}
            </select>

            {/* Live volume preview */}
            {volumePreview && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Volume to administer ({volumePreview.form}):
                </span>
                <span className="text-lg font-bold text-blue-700">
                  {volumePreview.value} {volumePreview.unit}
                </span>
              </div>
            )}
          </div>
        )}

        <button type="submit" disabled={loading || !drugId || !weight}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
          {loading ? 'Calculating...' : 'Calculate & Save Result'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {result && <CalculationResult result={result} />}
    </div>
  );
}

function CalculationResult({ result }) {
  return (
    <div className="mt-6 space-y-4">

      {/* Warnings */}
      {result.warnings?.length > 0 && result.warnings.map((w, i) => (
        <div key={i} className={`p-4 rounded-xl border ${
          w.severity === 'severe' || w.severity === 'contraindicated'
            ? 'bg-red-50 border-red-300'
            : 'bg-amber-50 border-amber-300'}`}>
          <p className="font-semibold text-red-800">⚠️ Breed-Specific Warning ({w.severity.toUpperCase()})</p>
          <p className="text-sm text-red-700 mt-1">{w.warning_note}</p>
        </div>
      ))}

      {/* Results card */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-teal-800 mb-4">
          {result.drug.name} — {result.patient.weight_kg} kg {result.patient.species}
        </h2>

        {/* Dose boxes */}
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div className="bg-white rounded-lg p-3 border border-teal-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Min Dose</p>
            <p className="text-xl font-bold text-teal-700">{result.calculation.min_dose_mg}</p>
            <p className="text-xs text-gray-400">mg</p>
          </div>
          <div className="bg-teal-100 rounded-lg p-3 border border-teal-300">
            <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Recommended</p>
            <p className="text-2xl font-bold text-teal-800">{result.calculation.recommended_dose_mg}</p>
            <p className="text-xs text-gray-500">mg</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-teal-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Max Dose</p>
            <p className="text-xl font-bold text-teal-700">{result.calculation.max_dose_mg}</p>
            <p className="text-xs text-gray-400">mg</p>
          </div>
        </div>

        {/* Volume — only shows if formulation was selected */}
        {result.administration && (
          <div className="bg-white rounded-lg p-3 border border-teal-200 text-center mb-4">
            <p className="text-sm text-gray-500 mb-1">Volume to Administer</p>
            <p className="text-2xl font-bold text-teal-800">
              {result.administration.volume || result.administration.tablets}
              <span className="text-base font-normal text-gray-500 ml-1">
                {result.administration.unit}
              </span>
            </p>
          </div>
        )}

        {/* Schedule */}
        <div className="text-sm text-gray-600 space-y-1 border-t border-teal-100 pt-3">
          <p><span className="font-medium">Route:</span> {result.schedule.route}</p>
          <p><span className="font-medium">Frequency:</span> {result.schedule.frequency}</p>
          {result.schedule.duration_notes && (
            <p><span className="font-medium">Duration:</span> {result.schedule.duration_notes}</p>
          )}
          <p className="text-xs text-gray-400 pt-1">Source: {result.source}</p>
        </div>
      </div>
    </div>
  );
}