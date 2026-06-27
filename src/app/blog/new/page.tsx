'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ImageUploader } from '@/components/ImageUploader';

export default function NewBlogPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    coverImage: '', author: '', tags: '', status: 'draft',
  });

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev, [name]: value,
      ...(name === 'title' && !prev.slug ? { slug: generateSlug(value) } : {}),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    const res = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/blog');
    } else {
      const data = await res.json();
      setError(typeof data.error === 'string' ? data.error : 'Failed to create post');
    }
    setSaving(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Link href="/blog">
          <button className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        </Link>
        <h1 className="page-title">New Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-layout">
          <div className="form-layout-stack">
            <div className="form-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Slug</label>
                  <input className="form-input" name="slug" value={form.slug} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Excerpt</label>
                  <textarea className="form-textarea" name="excerpt" value={form.excerpt} onChange={handleChange} rows={3} />
                </div>
                <div className="form-group">
                  <label className="form-label">Content</label>
                  <RichTextEditor content={form.content} onChange={(content) => setForm(prev => ({ ...prev, content }))} />
                </div>
              </div>
            </div>
          </div>

          <div className="form-layout-stack">
            <div className="form-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Author</label>
                  <input className="form-input" name="author" value={form.author} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input className="form-input" name="tags" value={form.tags} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-card">
              <label className="form-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>Cover Image</label>
              <ImageUploader value={form.coverImage} onChange={(url) => setForm(prev => ({ ...prev, coverImage: url }))} />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" className="cms-btn cms-btn-primary" disabled={saving} style={{ width: '100%' }}>
              {saving ? 'Saving...' : 'Create Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
