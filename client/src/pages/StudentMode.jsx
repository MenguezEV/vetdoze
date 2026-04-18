import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function StudentMode() {
  const [caseData, setCaseData]   = useState(null);
  const [answer, setAnswer]       = useState('');
  const [feedback, setFeedback]   = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading]     = useState(false);

  const loadCase = async () => {
    setFeedback(null);
    setAnswer('');
    setLoading(true);
    try {
      const res = await api.get(`/practice/case?difficulty=${difficulty}`);
      setCaseData(res.data);
    } catch {
      setCaseData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCase(); }, [difficulty]);

  const checkAnswer = async () => {
    if (!answer || !caseData) return;
    try {
      const res = await api.post(`/practice/check/${caseData.id}`, {
        student_dose_mg: parseFloat(answer)
      });
      setFeedback(res.data);
    } catch (err) {
      alert('Error checking answer.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-teal-800 mb-2">Student Practice Mode</h1>
      <p className="text-gray-500 text-sm mb-6">Practice dosage calculations with realistic cases. Get instant feedback.</p>

      <div className="flex gap-2 mb-6">
        {['easy', 'medium', 'hard'].map(d => (
          <button key={d} onClick={() => setDifficulty(d)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition
              ${difficulty === d ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {d}
          </button>
        ))}
        <button onClick={loadCase} className="ml-auto px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700">
          New Case
        </button>
      </div>

      {loading && <p className="text-gray-400 text-center py-12">Loading case...</p>}

      {caseData && !loading && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-blue-800 mb-2">Clinical Case</h2>
            <p className="text-sm text-blue-900"><strong>Species:</strong> {caseData.species}</p>
            <p className="text-sm text-blue-900"><strong>Breed:</strong> {caseData.breed_name}</p>
            <p className="text-sm text-blue-900"><strong>Weight:</strong> {caseData.weight_kg} kg</p>
            <p className="text-sm text-blue-900"><strong>Drug prescribed:</strong> {caseData.drug_name}</p>
            <p className="text-sm text-blue-900 font-medium mt-2">What is the correct dose in mg?</p>
          </div>

          <div className="flex gap-2 mb-4">
            <input type="number" value={answer} onChange={e => setAnswer(e.target.value)}
              placeholder="Enter dose in mg" step="0.01"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"/>
            <button onClick={checkAnswer}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-medium">
              Check
            </button>
          </div>

          {feedback && (
            <div className={`rounded-lg p-4 ${feedback.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`font-semibold mb-2 ${feedback.correct ? 'text-green-800' : 'text-red-800'}`}>
                {feedback.correct ? '✅ Correct!' : '❌ Not quite.'}
              </p>
              <p className="text-sm"><strong>Your answer:</strong> {feedback.student_answer} mg</p>
              <p className="text-sm"><strong>Correct dose:</strong> {feedback.correct_dose_mg} mg</p>
              {feedback.correct_volume_ml && <p className="text-sm"><strong>Volume:</strong> {feedback.correct_volume_ml} mL</p>}
              {feedback.hint && <p className="text-sm text-amber-800 mt-2"><strong>Hint:</strong> {feedback.hint}</p>}
              {feedback.explanation && <p className="text-sm text-gray-700 mt-2">{feedback.explanation}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}