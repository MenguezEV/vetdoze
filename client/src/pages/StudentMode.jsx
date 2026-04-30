import { useState, useEffect } from 'react';
import api from '../utils/api';

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const DIFF_COLORS = {
  easy:   { bg: '#F4F6DC', text: '#5A6600', active: '#8B9D00', shadow: 'rgba(139,157,0,0.2)' },
  medium: { bg: '#FFF4E0', text: '#8A4F00', active: '#C87A00', shadow: 'rgba(200,122,0,0.2)' },
  hard:   { bg: '#FCEBEB', text: '#7A1F1F', active: '#A32D2D', shadow: 'rgba(163,45,45,0.2)' },
};

export default function StudentMode() {
  const [caseData,        setCaseData]        = useState(null);
  const [answer,          setAnswer]          = useState('');
  const [feedback,        setFeedback]        = useState(null);
  const [difficulty,      setDifficulty]      = useState('easy');
  const [loading,         setLoading]         = useState(false);
  const [checking,        setChecking]        = useState(false);
  const [score,           setScore]           = useState({ correct: 0, total: 0 });
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const loadCase = async () => {
    setFeedback(null); setFeedbackVisible(false); setAnswer('');
    setCaseData(null); setLoading(true);
    try {
      const res = await api.get(`/practice/case?difficulty=${difficulty}`);
      setCaseData(res.data);
    } catch { setCaseData(null); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadCase(); }, [difficulty]);

  const checkAnswer = async () => {
    if (!answer || !caseData) return;
    setChecking(true);
    try {
      const res = await api.post(`/practice/check/${caseData.id}`, {
        student_dose_mg: parseFloat(answer),
      });
      setFeedback(res.data);
      setScore(s => ({ correct: s.correct + (res.data.correct ? 1 : 0), total: s.total + 1 }));
      setTimeout(() => setFeedbackVisible(true), 30);
    } catch {
      alert('Error checking answer.');
    } finally { setChecking(false); }
  };

  const dc         = DIFF_COLORS[difficulty];
  const scoreRatio = score.total > 0 ? score.correct / score.total : 0;

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .feedback-enter { animation: fadeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>

      <div style={{
        maxWidth: '740px', margin: '0 auto', padding: '40px 32px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: '24px', flexWrap: 'wrap', gap: '12px',
        }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#1A1A2E', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              Student Practice Mode
            </h1>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0 }}>
              Practice dosage calculations with realistic clinical cases.
            </p>
          </div>

          {score.total > 0 && (
            <div style={{
              background: scoreRatio >= 0.7 ? '#F4F6DC' : '#FCEBEB',
              border: `1.5px solid ${scoreRatio >= 0.7 ? '#C8D800' : '#F7C1C1'}`,
              borderRadius: '14px', padding: '12px 20px', textAlign: 'center',
              boxShadow: `0 4px 16px ${scoreRatio >= 0.7 ? 'rgba(139,157,0,0.12)' : 'rgba(163,45,45,0.08)'}`,
            }}>
              <p style={{ fontSize: '10px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Score</p>
              <p style={{ fontSize: '24px', fontWeight: '800', color: scoreRatio >= 0.7 ? '#5A6600' : '#A32D2D', margin: 0, lineHeight: 1 }}>
                {score.correct}/{score.total}
              </p>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: '3px 0 0', fontWeight: '600' }}>
                {Math.round(scoreRatio * 100)}%
              </p>
            </div>
          )}
        </div>

        {/* No-calculator notice */}
        <div style={{
          background: '#FFF8D6', border: '1.5px solid #F5C300', borderRadius: '14px',
          padding: '14px 18px', marginBottom: '24px',
          display: 'flex', gap: '12px', alignItems: 'flex-start',
          boxShadow: '0 2px 10px rgba(245,195,0,0.1)',
        }}>
          <span style={{ fontSize: '20px', flexShrink: 0 }}>📝</span>
          <p style={{ fontSize: '13px', color: '#6B5500', margin: 0, lineHeight: '1.65', fontWeight: '500' }}>
            <strong style={{ color: '#8A6A00' }}>Practice rules:</strong> Work out every dose manually — pen, paper, or mental math only.
            The dosage calculator is disabled during practice sessions to build real clinical fluency.
          </p>
        </div>

        {/* Difficulty + New Case */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'white', borderRadius: '12px', padding: '4px', display: 'flex', gap: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #ECEEF2',
          }}>
            {DIFFICULTIES.map(d => {
              const c = DIFF_COLORS[d];
              const isActive = difficulty === d;
              return (
                <button key={d} onClick={() => setDifficulty(d)} style={{
                  padding: '8px 18px', borderRadius: '8px', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: '13px', fontWeight: '700',
                  textTransform: 'capitalize', border: 'none', transition: 'all 0.15s',
                  background: isActive ? c.active : 'transparent',
                  color: isActive ? 'white' : '#6B6B80',
                  boxShadow: isActive ? `0 3px 10px ${c.shadow}` : 'none',
                }}>{d}</button>
              );
            })}
          </div>

          <button onClick={loadCase} disabled={loading} style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '12px', cursor: 'pointer',
            background: 'linear-gradient(135deg, #3B2F8F, #5A4DB8)',
            color: 'white', border: 'none', fontFamily: 'inherit',
            fontSize: '13px', fontWeight: '700', opacity: loading ? 0.6 : 1,
            transition: 'all 0.15s', boxShadow: '0 4px 14px rgba(59,47,143,0.3)',
          }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(59,47,143,0.4)'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(59,47,143,0.3)'; }}
          >
            <span style={{ fontSize: '16px' }}>🔄</span> New Case
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{
            background: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center',
            boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>⏳</div>
            <p style={{ color: '#94A3B8', fontSize: '14px', fontWeight: '600', margin: 0 }}>Loading clinical case...</p>
          </div>
        )}

        {/* No case */}
        {!loading && !caseData && (
          <div style={{
            background: 'white', border: '2px dashed #E8EAF0', borderRadius: '20px',
            padding: '60px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '44px', marginBottom: '14px' }}>📋</div>
            <p style={{ color: '#1A1A2E', fontSize: '16px', fontWeight: '700', margin: '0 0 6px' }}>No cases available</p>
            <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Try a different difficulty level.</p>
          </div>
        )}

        {/* Case card */}
        {!loading && caseData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'white', borderRadius: '20px', overflow: 'hidden',
              boxShadow: '0 4px 24px -4px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.04)',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #3B2F8F, #5A4DB8)',
                padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                  }}>🩺</div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: 'white', margin: 0 }}>Clinical Case</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Case #{caseData.id}</p>
                  </div>
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: '800', textTransform: 'capitalize',
                  padding: '5px 14px', borderRadius: '20px', letterSpacing: '0.04em',
                  background: 'rgba(255,255,255,0.15)', color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>{difficulty}</span>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                  {[
                    { label: 'Species',         value: caseData.species,         icon: caseData.species === 'dog' ? '🐕' : '🐈' },
                    { label: 'Breed',           value: caseData.breed_name,      icon: '🏷️' },
                    { label: 'Weight',          value: `${caseData.weight_kg} kg`, icon: '⚖️' },
                    { label: 'Drug Prescribed', value: caseData.drug_name,       icon: '💊' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      background: '#F7F8F3', borderRadius: '14px', padding: '14px 16px',
                      border: '1px solid #ECEEF2',
                    }}>
                      <p style={{ fontSize: '10px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
                        {item.label}
                      </p>
                      <p style={{ fontSize: '15px', fontWeight: '700', color: '#1A1A2E', margin: 0, display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'capitalize' }}>
                        <span>{item.icon}</span> {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{
                  background: '#EEEDFE', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px',
                  border: '1.5px solid #C8C4F0',
                }}>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#3B2F8F', margin: 0 }}>
                    ❓ Calculate the correct dose in <strong>mg</strong> — work it out manually before entering.
                  </p>
                </div>

                {!feedback && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <input
                        type="number" value={answer} step="0.01"
                        onChange={e => setAnswer(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') checkAnswer(); }}
                        placeholder="Enter your calculated answer"
                        style={{
                          width: '100%', border: '2px solid #C8C4F0', borderRadius: '12px',
                          padding: '13px 60px 13px 16px', fontSize: '15px', fontWeight: '600',
                          fontFamily: 'inherit', color: '#1A1A2E', background: 'white',
                          outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#5A4DB8'; e.target.style.boxShadow = '0 0 0 3px rgba(90,77,184,0.12)'; }}
                        onBlur={e  => { e.target.style.borderColor = '#C8C4F0'; e.target.style.boxShadow = 'none'; }}
                      />
                      <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', fontWeight: '700', color: '#5A4DB8' }}>mg</span>
                    </div>
                    <button onClick={checkAnswer} disabled={!answer || checking} style={{
                      padding: '13px 24px', borderRadius: '12px', cursor: 'pointer',
                      background: 'linear-gradient(135deg, #3B2F8F, #5A4DB8)',
                      color: 'white', border: 'none', fontFamily: 'inherit',
                      fontSize: '14px', fontWeight: '700',
                      opacity: (!answer || checking) ? 0.5 : 1,
                      boxShadow: '0 4px 14px rgba(59,47,143,0.3)',
                      transition: 'all 0.15s', whiteSpace: 'nowrap',
                    }}>
                      {checking ? 'Checking...' : 'Check ✓'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={feedbackVisible ? 'feedback-enter' : ''} style={{
                background: 'white', borderRadius: '20px', overflow: 'hidden',
                border: `2px solid ${feedback.correct ? '#8B9D00' : '#F7C1C1'}`,
                boxShadow: `0 8px 28px ${feedback.correct ? 'rgba(139,157,0,0.15)' : 'rgba(163,45,45,0.12)'}`,
                opacity: feedbackVisible ? 1 : 0,
              }}>
                <div style={{
                  background: feedback.correct
                    ? 'linear-gradient(135deg, #6B7A00, #8B9D00)'
                    : 'linear-gradient(135deg, #A32D2D, #C94040)',
                  padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '14px',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0,
                  }}>
                    {feedback.correct ? '✅' : '❌'}
                  </div>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: '800', color: 'white', margin: '0 0 3px' }}>
                      {feedback.correct ? 'Correct! Well done!' : 'Not quite — review the answer below.'}
                    </p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                      Margin of error: {feedback.margin_of_error_percent}%
                      {parseFloat(feedback.margin_of_error_percent) <= 5 && ' — within 5% tolerance ✓'}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: '#F7F8F3', borderRadius: '14px', padding: '16px', border: '1px solid #ECEEF2', textAlign: 'center' }}>
                      <p style={{ fontSize: '10px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Your Answer</p>
                      <p style={{ fontSize: '26px', fontWeight: '800', color: feedback.correct ? '#5A6600' : '#A32D2D', margin: 0, lineHeight: 1 }}>{feedback.student_answer}</p>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8' }}>mg</span>
                    </div>
                    <div style={{ background: '#F4F6DC', borderRadius: '14px', padding: '16px', border: '1.5px solid #C8D800', textAlign: 'center' }}>
                      <p style={{ fontSize: '10px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Correct Dose</p>
                      <p style={{ fontSize: '26px', fontWeight: '800', color: '#5A6600', margin: 0, lineHeight: 1 }}>{feedback.correct_dose_mg}</p>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#8B9D00' }}>mg</span>
                    </div>
                  </div>

                  {feedback.correct_volume_ml && (
                    <div style={{ background: '#EEEDFE', borderRadius: '12px', padding: '12px 16px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #C8C4F0' }}>
                      <span style={{ fontSize: '13px', color: '#3B2F8F', fontWeight: '700' }}>Volume to administer</span>
                      <span style={{ fontSize: '18px', fontWeight: '800', color: '#3B2F8F' }}>{feedback.correct_volume_ml} <span style={{ fontSize: '13px', fontWeight: '500' }}>mL</span></span>
                    </div>
                  )}

                  {feedback.hint && (
                    <div style={{ background: '#FFF8D6', border: '1.5px solid #F5C300', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                      <p style={{ fontSize: '10px', fontWeight: '800', color: '#8A6A00', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>💡 Hint</p>
                      <p style={{ fontSize: '13px', color: '#6B5500', margin: 0, lineHeight: '1.65' }}>{feedback.hint}</p>
                    </div>
                  )}

                  {feedback.explanation && (
                    <div style={{ background: '#F7F8F3', border: '1px solid #ECEEF2', borderRadius: '12px', padding: '14px', marginBottom: '18px' }}>
                      <p style={{ fontSize: '10px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>📖 Explanation</p>
                      <p style={{ fontSize: '13px', color: '#4A4A5A', lineHeight: '1.7', margin: 0 }}>{feedback.explanation}</p>
                    </div>
                  )}

                  <button onClick={loadCase} style={{
                    width: '100%', padding: '14px', borderRadius: '12px', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #3B2F8F, #5A4DB8)',
                    color: 'white', border: 'none', fontFamily: 'inherit',
                    fontSize: '14px', fontWeight: '800',
                    boxShadow: '0 4px 14px rgba(59,47,143,0.3)', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(59,47,143,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(59,47,143,0.3)'; }}
                  >
                    Next Case →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}