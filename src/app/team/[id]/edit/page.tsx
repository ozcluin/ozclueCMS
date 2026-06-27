'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ImageUploader } from '@/components/ImageUploader';

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    role: '',
    email: '',
    bio: '',
    image: '',
    order: 0,
    active: true,
  });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/team/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          name: data.name || '',
          role: data.role || '',
          email: data.email || '',
          bio: data.bio || '',
          image: data.image || '',
          order: data.order ?? 0,
          active: data.active ?? true,
        });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch(`/api/team/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/team');
    } else {
      const data = await res.json();
      setError(typeof data.error === 'string' ? data.error : 'Failed to update team member');
    }
    setSaving(false);
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-dim)' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Link href="/team">
          <button className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        </Link>
        <h1 className="page-title">Edit Team Member</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-layout" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div className="form-layout-stack">
            <div className="form-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Corporate Designation / Role</label>
                  <input className="form-input" name="role" value={form.role} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Professional Email Address</label>
                  <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Biography / Professional Profile</label>
                  <textarea className="form-textarea" name="bio" value={form.bio} onChange={handleChange} rows={6} />
                </div>
              </div>
            </div>
          </div>

          <div className="form-layout-stack">
            <div className="form-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Sort Display Order</label>
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

            <div className="form-card">
              <label className="form-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>Profile Photograph</label>
              <ImageUploader value={form.image} onChange={url => setForm(prev => ({ ...prev, image: url }))} />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" className="cms-btn cms-btn-primary" disabled={saving} style={{ width: '100%' }}>
              {saving ? 'Saving...' : 'Update Team Member'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
