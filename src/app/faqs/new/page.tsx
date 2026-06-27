'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewFAQPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 1,
    active: true,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 1 : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/faqs');
    } else {
      const data = await res.json();
      setError(typeof data.error === 'string' ? data.error : 'Failed to add FAQ');
    }
    setSaving(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Link href="/faqs">
          <button className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        </Link>
        <h1 className="page-title">Add FAQ Item</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-layout" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div className="form-layout-stack">
            <div className="form-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Question Text</label>
                  <input 
                    className="form-input" 
                    name="question" 
                    value={form.question} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. How long do standard checks take?" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Answer Text</label>
                  <textarea 
                    className="form-textarea" 
                    name="answer" 
                    value={form.answer} 
                    onChange={handleChange} 
                    rows={8} 
                    required 
                    placeholder="Provide a helpful, detailed answer..." 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-layout-stack">
            <div className="form-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                    <option value="General">General</option>
                    <option value="Verification Process">Verification Process</option>
                    <option value="Security & Compliance">Security & Compliance</option>
                    <option value="Candidate Onboarding">Candidate Onboarding</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Display Order (Index number)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    name="order" 
                    value={form.order} 
                    onChange={handleChange} 
                    min={1} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={e => setForm(prev => ({ ...prev, active: e.target.checked }))}
                    />
                    Active (Displayed on website)
                  </label>
                </div>
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" className="cms-btn cms-btn-primary" disabled={saving} style={{ width: '100%' }}>
              {saving ? 'Saving...' : 'Add FAQ'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
