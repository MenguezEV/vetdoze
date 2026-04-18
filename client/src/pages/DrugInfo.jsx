import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function DrugInfo() {
  const [drugs, setDrugs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    api.get('/drugs').then(r => setDrugs(r.data)).catch(() => {});
  }, []);

  const loadDrug = async (id) => {
    setSelected(id);
    const res = await api.get(`/drugs/${id}`);
    setDetail(res.data);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-teal-800 mb-2">Drug Information</h1>
      <p className="text-gray-500 text-sm mb-6">Quick-access drug descriptions and usage guidelines.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-3">Select a Drug</h2>
          <ul className="space-y-2">
            {drugs.map(d => (
              <li key={d.id}>
                <button onClick={() => loadDrug(d.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition
                    ${selected === d.id ? 'bg-teal-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                  {d.name}
                  <span className={`ml-2 text-xs ${selected === d.id ? 'text-teal-100' : 'text-gray-400'}`}>
                    {d.drug_class}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          {detail ? (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-teal-800">{detail.name}</h2>
              <p className="text-xs text-gray-400 uppercase tracking-wide">{detail.drug_class}</p>
              <p className="text-sm text-gray-700">{detail.description}</p>
              {detail.mechanism && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Mechanism</p>
                  <p className="text-sm text-gray-700">{detail.mechanism}</p>
                </div>
              )}
              {detail.contraindications && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                  <p className="text-xs font-semibold text-red-600 uppercase mb-1">Contraindications</p>
                  <p className="text-sm text-red-700">{detail.contraindications}</p>
                </div>
              )}
              {detail.dosage_ranges?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Dosage Ranges</p>
                  {detail.dosage_ranges.map((d, i) => (
                    <div key={i} className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 mb-1">
                      <span className="capitalize font-medium">{d.species}</span>: {d.min_dose_mg_per_kg}–{d.max_dose_mg_per_kg} mg/kg
                      <span className="text-gray-400 ml-2">({d.route}, {d.frequency})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
              Select a drug to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}