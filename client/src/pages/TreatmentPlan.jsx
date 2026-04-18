import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function TreatmentPlan() {
  const [drugs, setDrugs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [form, setForm] = useState({
    patient_name: '', species: 'dog', breed_id: '',
    weight_kg: '', drug_id: '', calculated_dose_mg: '',
    volume_ml: '', frequency: 'BID', duration_days: 7, notes: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/drugs').then(r => setDrugs(r.data));
  }, []);

  useEffect(() => {
    api.get(`/breeds?species=${form.species}`).then(r => setBreeds(r.data));
  }, [form.species]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/treatment/generate', form);
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-teal-800 mb-2">Treatment Plan Generator</h1>
      <p className="text-gray-500 text-sm mb-6">Generate a complete treatment schedule and owner instructions.</p>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
            <input name="patient_name" value={form.patient_name} onChange={handleChange} required
              placeholder="e.g. Buddy"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
            <select name="species" value={form.species} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
            <select name="breed_id" value={form.breed_id} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="">Select breed</option>
              {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <input name="weight_kg" value={form.weight_kg} onChange={handleChange} required
              type="number" step="0.1" min="0.1" placeholder="e.g. 25"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"/>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Drug</label>
          <select name="drug_id" value={form.drug_id} onChange={handleChange} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
            <option value="">Select drug</option>
            {drugs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dose (mg)</label>
            <input name="calculated_dose_mg" value={form.calculated_dose_mg} onChange={handleChange}
              type="number" step="0.01" placeholder="e.g. 375"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Volume (mL)</label>
            <input name="volume_ml" value={form.volume_ml} onChange={handleChange}
              type="number" step="0.01" placeholder="e.g. 7.5"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
            <input name="duration_days" value={form.duration_days} onChange={handleChange}
              type="number" min="1" placeholder="7"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"/>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
          <select name="frequency" value={form.frequency} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="SID">SID — once daily</option>
            <option value="BID">BID — twice daily</option>
            <option value="TID">TID — three times daily</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vet Notes (optional)</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
            placeholder="Any additional instructions for the owner..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"/>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
          {loading ? 'Generating...' : 'Generate Treatment Plan'}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-teal-50 border border-teal-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-teal-800">Treatment Plan Generated ✅</h2>
          <div className="bg-white rounded-lg p-4 border border-teal-100">
            <p className="font-medium text-teal-700 mb-3">{result.instructions.summary}</p>
            <ol className="space-y-2">
              {result.instructions.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="w-6 h-6 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <p className="text-xs text-gray-400">Plan ID: <strong>{result.plan.id}</strong> — share this with the pet owner</p>
        </div>
      )}
    </div>
  );
}