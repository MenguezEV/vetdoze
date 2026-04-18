import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Calculator() {
  const [species, setSpecies]       = useState('dog');
  const [breeds, setBreeds]         = useState([]);
  const [breedId, setBreedId]       = useState('');
  const [weight, setWeight]         = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [drugs, setDrugs]           = useState([]);
  const [drugId, setDrugId]         = useState('');
  const [drugDetail, setDrugDetail] = useState(null);
  const [formulationId, setFormulationId] = useState('');
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

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
      });
    }
  }, [drugId]);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    const weightKg = weightUnit === 'lbs'
      ? parseFloat(weight) * 0.453592
      : parseFloat(weight);

    try {
      const res = await api.post('/calculate/dose', {
        species,
        breed_id: breedId || null,
        weight_kg: weightKg,
        drug_id: parseInt(drugId),
        formulation_id: formulationId ? parseInt(formulationId) : null
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
      <p className="text-gray-500 text-sm mb-6">Based on Plumb's Veterinary Drug Handbook</p>

      <form onSubmit={handleCalculate} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">

        {/* Species */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
          <div className="flex gap-3">
            {['dog', 'cat'].map(s => (
              <button key={s} type="button"
                onClick={() => setSpecies(s)}
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
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
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
            {drugs.map(d => <option key={d.id} value={d.id}>{d.name} ({d.drug_class})</option>)}
          </select>
        </div>

        {/* Formulation */}
        {drugDetail?.formulations?.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Formulation</label>
            <select value={formulationId} onChange={e => setFormulationId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
              <option value="">Select formulation (optional)</option>
              {drugDetail.formulations.map(f => (
                <option key={f.id} value={f.id}>{f.form} — {f.concentration}</option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
          {loading ? 'Calculating...' : 'Calculate Dose'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
      )}

      {result && <CalculationResult result={result} />}
    </div>
  );
}

function CalculationResult({ result }) {
  return (
    <div className="mt-6 space-y-4">
      {/* Warnings first */}
      {result.warnings?.length > 0 && result.warnings.map((w, i) => (
        <div key={i} className={`p-4 rounded-xl border ${w.severity === 'severe' || w.severity === 'contraindicated' ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-300'}`}>
          <p className="font-semibold text-red-800">⚠️ Breed-Specific Warning ({w.severity.toUpperCase()})</p>
          <p className="text-sm text-red-700 mt-1">{w.warning_note}</p>
        </div>
      ))}

      {/* Results */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-teal-800 mb-4">
          {result.drug.name} — {result.patient.weight_kg} kg {result.patient.species}
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div className="bg-white rounded-lg p-3 border border-teal-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Min Dose</p>
            <p className="text-xl font-bold text-teal-700">{result.calculation.min_dose_mg}</p>
            <p className="text-xs text-gray-400">mg</p>
          </div>
          <div className="bg-teal-100 rounded-lg p-3 border border-teal-300">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Recommended</p>
            <p className="text-2xl font-bold text-teal-800">{result.calculation.recommended_dose_mg}</p>
            <p className="text-xs text-gray-500">mg</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-teal-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Max Dose</p>
            <p className="text-xl font-bold text-teal-700">{result.calculation.max_dose_mg}</p>
            <p className="text-xs text-gray-400">mg</p>
          </div>
        </div>

        {result.administration && (
          <div className="bg-white rounded-lg p-3 border border-teal-200 text-center mb-3">
            <p className="text-sm text-gray-600">Volume to Administer</p>
            <p className="text-2xl font-bold text-teal-800">
              {result.administration.volume || result.administration.tablets}
              <span className="text-base font-normal text-gray-500 ml-1">{result.administration.unit}</span>
            </p>
          </div>
        )}

        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Route:</span> {result.schedule.route}</p>
          <p><span className="font-medium">Frequency:</span> {result.schedule.frequency}</p>
          {result.schedule.duration_notes && <p><span className="font-medium">Duration:</span> {result.schedule.duration_notes}</p>}
          <p className="text-xs text-gray-400 pt-1">Source: {result.source}</p>
        </div>
      </div>
    </div>
  );
}