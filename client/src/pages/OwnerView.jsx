import { useState } from 'react';
import api from '../utils/api';

export default function OwnerView() {
  const [planId, setPlanId] = useState('');
  const [plan, setPlan]     = useState(null);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPlan = async (e) => {
    e.preventDefault();
    setError('');
    setPlan(null);
    setLoading(true);
    try {
      const res = await api.get(`/treatment/${planId}`);
      setPlan(res.data);
    } catch {
      setError('Plan not found. Please check the ID your vet gave you.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 32px' }}>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A2E', margin: '0 0 6px' }}>
          My Pet's Treatment Plan
        </h1>
        <p style={{ fontSize: '14px', color: '#6B6B80', margin: 0 }}>
          Enter the plan ID your veterinarian gave you to view instructions.
        </p>
      </div>

      <div style={{
        background: 'white', border: '1px solid #E2E4D0',
        borderRadius: '20px', padding: '28px', marginBottom: '20px',
      }}>
        <p style={{
          fontSize: '11px', fontWeight: '700', color: '#8B9D00',
          textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px',
        }}>Enter Plan ID</p>

        <form onSubmit={fetchPlan} style={{ display: 'flex', gap: '10px' }}>
          <input
            value={planId} onChange={e => setPlanId(e.target.value)}
            placeholder="e.g. 7" required
            style={{
              flex: 1, border: '2px solid #E2E4D0', borderRadius: '10px',
              padding: '12px 14px', fontSize: '16px', fontWeight: '600',
              fontFamily: 'inherit', color: '#1A1A2E', background: 'white',
              outline: 'none', transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#5A4DB8'}
            onBlur={e  => e.target.style.borderColor = '#E2E4D0'}
          />
          <button type="submit" disabled={loading} style={{
            padding: '12px 24px', borderRadius: '10px', cursor: 'pointer',
            background: 'linear-gradient(135deg,#3B2F8F,#5A4DB8)',
            color: 'white', border: 'none', fontFamily: 'inherit',
            fontSize: '14px', fontWeight: '700',
            opacity: loading ? 0.6 : 1, transition: 'opacity 0.15s',
            boxShadow: '0 2px 8px rgba(59,47,143,0.3)', whiteSpace: 'nowrap',
          }}>
            {loading ? 'Searching...' : '🔍 Find Plan'}
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: '14px', background: '#FCEBEB', border: '1px solid #F7C1C1',
            borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: '#A32D2D',
          }}>{error}</div>
        )}
      </div>

      {plan && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{
            background: 'linear-gradient(135deg,#3B2F8F,#5A4DB8)',
            borderRadius: '20px', padding: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
              }}>
                {plan.plan.species === 'dog' ? '🐕' : '🐈'}
              </div>
              <div>
                <p style={{ fontSize: '18px', fontWeight: '800', color: 'white', margin: 0 }}>
                  {plan.plan.patient_name}'s Plan
                </p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                  Plan ID #{plan.plan.id} · {plan.plan.species} · {plan.plan.weight_kg} kg
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Dose',      value: `${plan.plan.calculated_dose_mg} mg` },
                { label: 'Frequency', value: plan.plan.frequency },
                { label: 'Duration',  value: `${plan.plan.duration_days} days` },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: '10px', padding: '10px 12px', textAlign: 'center',
                }}>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)',
                    textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: '800', color: 'white', margin: 0 }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: '#F4F6DC', border: '1px solid #C8D800',
            borderRadius: '16px', padding: '18px 20px',
          }}>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#5A6600', margin: 0, lineHeight: '1.6' }}>
              📋 {plan.instructions.summary}
            </p>
          </div>

          <div style={{
            background: 'white', border: '1px solid #E2E4D0',
            borderRadius: '20px', padding: '24px',
          }}>
            <p style={{
              fontSize: '11px', fontWeight: '700', color: '#8B9D00',
              textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px',
            }}>Step-by-Step Instructions</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {plan.instructions.steps.map((step, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  background: '#F7F8F3', borderRadius: '12px', padding: '14px',
                  border: '1px solid #E2E4D0',
                }}>
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: 'linear-gradient(135deg,#3B2F8F,#5A4DB8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: '800', color: 'white',
                    flexShrink: 0, marginTop: '1px',
                  }}>{i + 1}</div>
                  <p style={{ fontSize: '14px', color: '#2A2A3A', lineHeight: '1.6', margin: 0 }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {plan.plan.notes && (
            <div style={{
              background: '#FFF8D6', border: '1px solid #F5C300',
              borderRadius: '16px', padding: '18px 20px',
            }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#8A6A00',
                textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
                💡 Vet's Notes
              </p>
              <p style={{ fontSize: '14px', color: '#6B5500', lineHeight: '1.6', margin: 0 }}>
                {plan.plan.notes}
              </p>
            </div>
          )}

          <div style={{
            background: '#FCEBEB', border: '1px solid #F7C1C1',
            borderRadius: '16px', padding: '16px 20px',
            display: 'flex', gap: '10px', alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
            <p style={{ fontSize: '13px', color: '#791F1F', lineHeight: '1.6', margin: 0 }}>
              Contact your veterinarian immediately if your pet shows signs of vomiting, lethargy, loss of appetite, or any unusual behavior after taking medication.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}