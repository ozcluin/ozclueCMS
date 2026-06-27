'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditNoticePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    priority: 'normal',
    status: 'draft',
  });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/notices/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          title: data.title || '',
          content: data.content || '',
          priority: data.priority || 'normal',
          status: data.status || 'draft',
        });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch(`/api/notices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/notices');
    } else {
      const data = await res.json();
      setError(typeof data.error === 'string' ? data.error : 'Failed to update notice');
    }
    setSaving(false);
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-dim)' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Link href="/notices">
          <button className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        </Link>
        <h1 className="page-title">Edit Notice</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-layout" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div className="form-layout-stack">
            <div className="form-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Announcement Content</label>
                  <textarea className="form-textarea" name="content" value={form.content} onChange={handleChange} rows={10} required />
                </div>
              </div>
            </div>
          </div>

          <div className="form-layout-stack">
            <div className="form-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Priority Level</label>
                  <select className="form-select" name="priority" value={form.priority} onChange={handleChange}>
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Publishing Status</label>
                  <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" className="cms-btn cms-btn-primary" disabled={saving} style={{ width: '100%' }}>
              {saving ? 'Saving...' : 'Update Notice'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
