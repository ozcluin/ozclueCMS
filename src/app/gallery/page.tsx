'use client';

import { useEffect, useState } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface GalleryImage {
  _id: string;
  url: string;
  caption: string;
  category: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [uploadUrl, setUploadUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('general');

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const res = await fetch('/api/gallery');
    if (res.ok) setImages(await res.json());
    setLoading(false);
  }

  async function handleSaveImage() {
    if (!uploadUrl) return;
    setSaving(true);

    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: uploadUrl,
        caption,
        category,
      }),
    });

    if (res.ok) {
      const newImg = await res.json();
      setImages([newImg, ...images]);
      setShowUpload(false);
      setUploadUrl('');
      setCaption('');
      setCategory('general');
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/gallery/${deleteId}`, { method: 'DELETE' });
    if (res.ok) setImages(images.filter(i => i._id !== deleteId));
    setDeleteId(null);
  }

  return (
    <div>
      <div className="page-title-area">
        <div>
          <h1 className="page-title">Gallery Management</h1>
          <p className="page-subtitle">Upload and categorize corporate pictures and office images</p>
        </div>
        <button className="cms-btn cms-btn-primary" onClick={() => setShowUpload(!showUpload)}>
          {showUpload ? 'Close Upload' : 'Upload Image'}
        </button>
      </div>

      {showUpload && (
        <div className="form-card" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Select Image</label>
              <ImageUploader value={uploadUrl} onChange={setUploadUrl} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Caption / Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="e.g. Annual Summit 2026"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="general">General</option>
                  <option value="office">Office & Workspace</option>
                  <option value="events">Corporate Events</option>
                  <option value="team">Team & Group</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="cms-btn cms-btn-primary" onClick={handleSaveImage} disabled={saving || !uploadUrl}>
                {saving ? 'Saving...' : 'Save to Gallery'}
              </button>
              <button className="cms-btn cms-btn-secondary" onClick={() => setShowUpload(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-dim)' }}>Loading...</div>
      ) : images.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-muted)' }}>
          No gallery images uploaded yet.
        </div>
      ) : (
        <div className="gallery-grid">
          {images.map(img => (
            <div key={img._id} className="gallery-item">
              <img src={img.url} alt={img.caption || 'Gallery Image'} />
              <div className="gallery-item-info">
                <p style={{ fontWeight: 600, fontSize: '0.875rem' }} className="line-clamp-1">{img.caption || 'Untitled'}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'capitalize' }}>{img.category}</p>
              </div>
              <button className="gallery-item-delete" onClick={() => setDeleteId(img._id)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Gallery Image"
        message="Are you sure you want to delete this gallery image? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
