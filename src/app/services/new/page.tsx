'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewServicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    icon: '',
    features: [] as string[],
    order: 0,
    active: true,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value,
    }));
  }

  function addFeature() {
    const feature = featureInput.trim();
    if (!feature) return;
    if (form.features.includes(feature)) {
      setFeatureInput('');
      return;
    }
    setForm(prev => ({ ...prev, features: [...prev.features, feature] }));
    setFeatureInput('');
  }

  function removeFeature(index: number) {
    setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/services');
    } else {
      const data = await res.json();
      setError(typeof data.error === 'string' ? data.error : 'Failed to add service');
    }
    setSaving(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Link href="/services">
          <button className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        </Link>
        <h1 className="page-title">Add Service</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-layout" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div className="form-layout-stack">
            <div className="form-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Service Title</label>
                  <input className="form-input" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Identity Screening" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} rows={5} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Features / Deliverables included</label>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <input
                      className="form-input"
                      placeholder="Add a key feature"
                      value={featureInput}
                      onChange={e => setFeatureInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFeature();
                        }
                      }}
                    />
                    <button type="button" className="cms-btn cms-btn-secondary" onClick={addFeature}>
                      Add
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                    {form.features.length === 0 ? (
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>No features added yet.</span>
                    ) : (
                      form.features.map((feature, idx) => (
                        <span className="tag-chip" key={idx}>
                          {feature}
                          <button type="button" className="tag-chip-remove" onClick={() => removeFeature(idx)}>
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-layout-stack">
            <div className="form-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Lucide Icon Class / Name</label>
                  <input className="form-input" name="icon" value={form.icon} onChange={handleChange} placeholder="e.g. ShieldAlert, KeyRound" />
                </div>
                <div className="form-group">
                  <label className="form-label">Sort Order</label>
                  <input className="form-input" name="order" type="number" value={form.order} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={e => setForm(prev => ({ ...prev, active: e.target.checked }))}
                    />
                    Active Listing
                  </label>
                </div>
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" className="cms-btn cms-btn-primary" disabled={saving} style={{ width: '100%' }}>
              {saving ? 'Saving...' : 'Add Service'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
