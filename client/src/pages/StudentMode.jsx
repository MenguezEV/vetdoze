import { useState, useEffect } from 'react';
import api from '../utils/api';

const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function StudentMode() {
  const [caseData,   setCaseData]   = useState(null);
  const [answer,     setAnswer]     = useState('');
  const [feedback,   setFeedback]   = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [loading,    setLoading]    = useState(false);
  const [checking,   setChecking]   = useState(false);
  const [score,      setScore]      = useState({ correct: 0, total: 0 });

  const loadCase = async () => {
    setFeedback(null);
    setAnswer('');
    setCaseData(null);
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
    setChecking(true);
    try {
      const res = await api.post(`/practice/check/${caseData.id}`, {
        student_dose_mg: parseFloat(answer),
      });
      setFeedback(res.data);
      setScore(s => ({
        correct: s.correct + (res.data.correct ? 1 : 0),
        total: s.total + 1,
      }));
    } catch {
      alert('Error checking answer.');
    } finally {
      setChecking(false);
    }
  };

  const handleKeyDown = e => { if (e.key === 'Enter') checkAnswer(); };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 32px' }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px',
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A2E', margin: '0 0 6px' }}>
            Student Practice Mode
          </h1>
          <p style={{ fontSize: '14px', color: '#6B6B80', margin: 0 }}>
            Practice dosage calculations with realistic clinical cases.
          </p>
        </div>

        {/* Score badge */}
        {score.total > 0 && (
          <div style={{
            background: score.correct / score.total >= 0.7 ? '#F4F6DC' : '#FCEBEB',
            border: `1px solid ${score.correct / score.total >= 0.7 ? '#C8D800' : '#F7C1C1'}`,
            borderRadius: '12px', padding: '10px 16px', textAlign: 'center',
          }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#6B6B80',
              textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>Score</p>
            <p style={{ fontSize: '20px', fontWeight: '800',
              color: score.correct / score.total >= 0.7 ? '#5A6600' : '#A32D2D', margin: 0 }}>
              {score.correct}/{score.total}
            </p>
          </div>
        )}
      </div>

      {/* ── Difficulty + New Case ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        marginBottom: '24px', flexWrap: 'wrap',
      }}>
        <div style={{
          background: 'white', border: '1px solid #E2E4D0',
          borderRadius: '10px', padding: '4px', display: 'flex', gap: '2px',
        }}>
          {DIFFICULTIES.map(d => (
            <button key={d} onClick={() => setDifficulty(d)} style={{
              padding: '7px 16px', borderRadius: '8px', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '13px', fontWeight: '600',
              textTransform: 'capitalize', border: 'none', transition: 'all 0.15s',
              background: difficulty === d
                ? d === 'easy' ? '#8B9D00'
                  : d === 'medium' ? '#C87A00'
                  : '#A32D2D'
                : 'transparent',
              color: difficulty === d ? 'white' : '#6B6B80',
            }}>
              {d}
            </button>
          ))}
        </div>

        <button onClick={loadCase} disabled={loading} style={{
          marginLeft: 'auto',
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '9px 18px', borderRadius: '10px', cursor: 'pointer',
          background: 'linear-gradient(135deg,#3B2F8F,#5A4DB8)',
          color: 'white', border: 'none', fontFamily: 'inherit',
          fontSize: '13px', fontWeight: '700',
          opacity: loading ? 0.6 : 1, transition: 'opacity 0.15s',
          boxShadow: '0 2px 8px rgba(59,47,143,0.3)',
        }}>
          <span style={{ fontSize: '15px' }}>🔄</span> New Case
        </button>
      </div>

      {/* ── Loading state ── */}
      {loading && (
        <div style={{
          background: 'white', border: '1px solid #E2E4D0',
          borderRadius: '20px', padding: '60px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <p style={{ color: '#6B6B80', fontSize: '14px', margin: 0 }}>Loading case...</p>
        </div>
      )}

      {/* ── No case found ── */}
      {!loading && !caseData && (
        <div style={{
          background: 'white', border: '2px dashed #E2E4D0',
          borderRadius: '20px', padding: '60px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
          <p style={{ color: '#6B6B80', fontSize: '14px', margin: 0 }}>
            No cases available for this difficulty. Try a different level.
          </p>
        </div>
      )}

      {/* ── Case card ── */}
      {!loading && caseData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Clinical case info */}
          <div style={{
            background: 'white', border: '1px solid #E2E4D0',
            borderRadius: '20px', overflow: 'hidden',
          }}>
            {/* Card header */}
            <div style={{
              background: 'linear-gradient(135deg,#3B2F8F,#5A4DB8)',
              padding: '18px 24px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                }}>🩺</div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: 'white', margin: 0 }}>
                    Clinical Case
                  </p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                    Case #{caseData.id}
                  </p>
                </div>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: '700', textTransform: 'capitalize',
                padding: '4px 12px', borderRadius: '20px',
                background: difficulty === 'easy' ? 'rgba(139,157,0,0.3)'
                  : difficulty === 'medium' ? 'rgba(200,122,0,0.3)'
                  : 'rgba(163,45,45,0.3)',
                color: difficulty === 'easy' ? '#C8E000'
                  : difficulty === 'medium' ? '#FFB84D'
                  : '#FFB3B3',
              }}>
                {difficulty}
              </span>
            </div>

            {/* Case details */}
            <div style={{ padding: '24px' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
                marginBottom: '20px',
              }}>
                {[
                  { label: 'Species',          value: caseData.species,    icon: caseData.species === 'dog' ? '🐕' : '🐈' },
                  { label: 'Breed',            value: caseData.breed_name, icon: '🏷️' },
                  { label: 'Weight',           value: `${caseData.weight_kg} kg`, icon: '⚖️' },
                  { label: 'Drug Prescribed',  value: caseData.drug_name,  icon: '💊' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: '#F7F8F3', borderRadius: '12px',
                    padding: '12px 14px', border: '1px solid #E2E4D0',
                  }}>
                    <p style={{ fontSize: '11px', color: '#6B6B80', textTransform: 'uppercase',
                      letterSpacing: '0.06em', margin: '0 0 4px', fontWeight: '600' }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E',
                      margin: 0, display: 'flex', alignItems: 'center', gap: '6px',
                      textTransform: 'capitalize' }}>
                      <span>{item.icon}</span> {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Question */}
              <div style={{
                background: '#EEEDFE', borderRadius: '12px',
                padding: '14px 18px', marginBottom: '20px',
                border: '1px solid #C8C4F0',
              }}>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#3B2F8F', margin: 0 }}>
                  ❓ What is the correct dose in <strong>mg</strong> for this patient?
                </p>
              </div>

              {/* Answer input */}
              {!feedback && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input
                      type="number" value={answer} step="0.01"
                      onChange={e => setAnswer(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter your answer in mg"
                      style={{
                        width: '100%', border: '2px solid #C8C4F0', borderRadius: '10px',
                        padding: '12px 60px 12px 14px', fontSize: '14px', fontWeight: '600',
                        fontFamily: 'inherit', color: '#1A1A2E', background: 'white',
                        outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = '#5A4DB8'}
                      onBlur={e  => e.target.style.borderColor = '#C8C4F0'}
                    />
                    <span style={{
                      position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                      fontSize: '12px', fontWeight: '600', color: '#6B6B80',
                    }}>mg</span>
                  </div>
                  <button onClick={checkAnswer} disabled={!answer || checking} style={{
                    padding: '12px 24px', borderRadius: '10px', cursor: 'pointer',
                    background: 'linear-gradient(135deg,#3B2F8F,#5A4DB8)',
                    color: 'white', border: 'none', fontFamily: 'inherit',
                    fontSize: '14px', fontWeight: '700',
                    opacity: (!answer || checking) ? 0.5 : 1,
                    boxShadow: '0 2px 8px rgba(59,47,143,0.3)',
                    transition: 'opacity 0.15s', whiteSpace: 'nowrap',
                  }}>
                    {checking ? 'Checking...' : 'Check Answer'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Feedback card ── */}
          {feedback && (
            <div style={{
              background: 'white', border: `2px solid ${feedback.correct ? '#8B9D00' : '#F7C1C1'}`,
              borderRadius: '20px', overflow: 'hidden',
            }}>
              {/* Result banner */}
              <div style={{
                background: feedback.correct
                  ? 'linear-gradient(135deg,#6B7A00,#8B9D00)'
                  : 'linear-gradient(135deg,#A32D2D,#C94040)',
                padding: '16px 24px',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px',
                }}>
                  {feedback.correct ? '✅' : '❌'}
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '800', color: 'white', margin: 0 }}>
                    {feedback.correct ? 'Correct! Well done!' : 'Not quite — review the answer below.'}
                  </p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                    Margin of error: {feedback.margin_of_error_percent}%
                    {parseFloat(feedback.margin_of_error_percent) <= 5 && ' (within 5% tolerance)'}
                  </p>
                </div>
              </div>

              {/* Answer breakdown */}
              <div style={{ padding: '24px' }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
                  marginBottom: feedback.explanation || feedback.hint ? '16px' : '0',
                }}>
                  <div style={{
                    background: '#F7F8F3', borderRadius: '12px',
                    padding: '14px', border: '1px solid #E2E4D0', textAlign: 'center',
                  }}>
                    <p style={{ fontSize: '11px', color: '#6B6B80', textTransform: 'uppercase',
                      letterSpacing: '0.06em', margin: '0 0 4px', fontWeight: '600' }}>Your Answer</p>
                    <p style={{ fontSize: '22px', fontWeight: '800',
                      color: feedback.correct ? '#5A6600' : '#A32D2D', margin: 0 }}>
                      {feedback.student_answer} <span style={{ fontSize: '14px', fontWeight: '400' }}>mg</span>
                    </p>
                  </div>
                  <div style={{
                    background: '#F4F6DC', borderRadius: '12px',
                    padding: '14px', border: '1px solid #C8D800', textAlign: 'center',
                  }}>
                    <p style={{ fontSize: '11px', color: '#6B6B80', textTransform: 'uppercase',
                      letterSpacing: '0.06em', margin: '0 0 4px', fontWeight: '600' }}>Correct Dose</p>
                    <p style={{ fontSize: '22px', fontWeight: '800', color: '#5A6600', margin: 0 }}>
                      {feedback.correct_dose_mg} <span style={{ fontSize: '14px', fontWeight: '400' }}>mg</span>
                    </p>
                  </div>
                </div>

                {feedback.correct_volume_ml && (
                  <div style={{
                    background: '#EEEDFE', borderRadius: '10px',
                    padding: '10px 14px', marginBottom: '14px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    border: '1px solid #C8C4F0',
                  }}>
                    <span style={{ fontSize: '13px', color: '#3B2F8F', fontWeight: '600' }}>
                      Volume to administer
                    </span>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#3B2F8F' }}>
                      {feedback.correct_volume_ml} mL
                    </span>
                  </div>
                )}

                {/* Hint */}
                {feedback.hint && (
                  <div style={{
                    background: '#FFF8D6', border: '1px solid #F5C300',
                    borderRadius: '10px', padding: '12px 14px', marginBottom: '12px',
                  }}>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#8A6A00',
                      textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>
                      💡 Hint
                    </p>
                    <p style={{ fontSize: '13px', color: '#6B5500', margin: 0 }}>{feedback.hint}</p>
                  </div>
                )}

                {/* Explanation */}
                {feedback.explanation && (
                  <div style={{
                    background: '#F7F8F3', border: '1px solid #E2E4D0',
                    borderRadius: '10px', padding: '12px 14px', marginBottom: '16px',
                  }}>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#6B6B80',
                      textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>
                      📖 Explanation
                    </p>
                    <p style={{ fontSize: '13px', color: '#4A4A5A', lineHeight: '1.6', margin: 0 }}>
                      {feedback.explanation}
                    </p>
                  </div>
                )}

                {/* Next case button */}
                <button onClick={loadCase} style={{
                  width: '100%', padding: '12px', borderRadius: '10px', cursor: 'pointer',
                  background: 'linear-gradient(135deg,#3B2F8F,#5A4DB8)',
                  color: 'white', border: 'none', fontFamily: 'inherit',
                  fontSize: '14px', fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(59,47,143,0.3)',
                }}>
                  Next Case →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}