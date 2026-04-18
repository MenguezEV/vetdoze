import { useState } from 'react';
import api from '../utils/api';

export default function OwnerView() {
  const [planId, setPlanId]   = useState('');
  const [plan, setPlan]       = useState(null);
  const [error, setError]     = useState('');

  const fetchPlan = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.get(`/treatment/${planId}`);
      setPlan(res.data);
    } catch {
      setError('Plan not found. Ask your vet for the plan ID.');
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-teal-800 mb-2">My Pet's Treatment Plan</h1>
      <p className="text-gray-500 text-sm mb-6">Enter the plan ID your veterinarian gave you.</p>

      <form onSubmit={fetchPlan} className="flex gap-2 mb-6">
        <input value={planId} onChange={e => setPlanId(e.target.value)}
          placeholder="Treatment Plan ID" required
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"/>
        <button type="submit" className="bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-700">
          Find Plan
        </button>
      </form>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {plan && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{plan.plan.patient_name}'s Plan</h2>
            <p className="text-sm text-gray-500">{plan.plan.species} • {plan.plan.weight_kg} kg</p>
          </div>
          <div className="bg-teal-50 border border-teal-100 rounded-lg p-4">
            <p className="font-semibold text-teal-800 mb-1">{plan.instructions.summary}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Step-by-step instructions</h3>
            <ol className="space-y-2">
              {plan.instructions.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="w-6 h-6 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          {plan.plan.notes && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-sm text-amber-800">
              <strong>Vet's notes:</strong> {plan.plan.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}