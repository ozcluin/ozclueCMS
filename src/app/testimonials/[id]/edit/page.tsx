'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    company: '',
    role: '',
    content: '',
    rating: 5,
    active: true,
  });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/testimonials/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          name: data.name || '',
          company: data.company || '',
          role: data.role || '',
          content: data.content || '',
          rating: data.rating ?? 5,
          active: data.active ?? true,
        });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) || 5 : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch(`/api/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/testimonials');
    } else {
      const data = await res.json();
      setError(typeof data.error === 'string' ? data.error : 'Failed to update testimonial');
    }
    setSaving(false);
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-dim)' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Link href="/testimonials">
          <button className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        </Link>
        <h1 className="page-title">Edit Testimonial</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-layout" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div className="form-layout-stack">
            <div className="form-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Client Name</label>
                  <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Company / Client Organization</label>
                  <input className="form-input" name="company" value={form.company} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Role / Job Title</label>
                  <input className="form-input" name="role" value={form.role} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Feedback Review / Content</label>
                  <textarea className="form-textarea" name="content" value={form.content} onChange={handleChange} rows={6} required />
                </div>
              </div>
            </div>
          </div>

          <div className="form-layout-stack">
            <div className="form-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Rating Rating (1-5 Stars)</label>
                  <select className="form-select" name="rating" value={form.rating} onChange={handleChange}>
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
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
              {saving ? 'Saving...' : 'Update Testimonial'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
