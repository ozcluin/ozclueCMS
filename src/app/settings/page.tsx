'use client';

import { useEffect, useState } from 'react';
import { ImageUploader } from '@/components/ImageUploader';

interface Settings {
  siteName: string;
  tagline: string;
  heroBackgroundImage: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  trustedCompanies: string[];
  serviceCountries: string[];
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [companyInput, setCompanyInput] = useState('');
  const [countryInput, setCountryInput] = useState('');

  const [form, setForm] = useState<Settings>({
    siteName: '',
    tagline: '',
    heroBackgroundImage: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    trustedCompanies: [],
    serviceCountries: [],
    socialLinks: { facebook: '', twitter: '', linkedin: '', instagram: '' },
  });

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setForm({
          siteName: data.siteName || '',
          tagline: data.tagline || '',
          heroBackgroundImage: data.heroBackgroundImage || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          address: data.address || '',
          trustedCompanies: Array.isArray(data.trustedCompanies) ? data.trustedCompanies : [],
          serviceCountries: Array.isArray(data.serviceCountries) ? data.serviceCountries : [],
          socialLinks: {
            facebook: data.socialLinks?.facebook || '',
            twitter: data.socialLinks?.twitter || '',
            linkedin: data.socialLinks?.linkedin || '',
            instagram: data.socialLinks?.instagram || '',
          },
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSocial(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [name]: value } }));
  }

  function addCompany() {
    const company = companyInput.trim();
    if (!company) return;
    if (form.trustedCompanies.includes(company)) {
      setCompanyInput('');
      return;
    }
    setForm(prev => ({ ...prev, trustedCompanies: [...prev.trustedCompanies, company] }));
    setCompanyInput('');
  }

  function removeCompany(index: number) {
    setForm(prev => ({ ...prev, trustedCompanies: prev.trustedCompanies.filter((_, i) => i !== index) }));
  }

  function addCountry() {
    const country = countryInput.trim();
    if (!country) return;
    if (form.serviceCountries.includes(country)) {
      setCountryInput('');
      return;
    }
    setForm(prev => ({ ...prev, serviceCountries: [...prev.serviceCountries, country] }));
    setCountryInput('');
  }

  function removeCountry(index: number) {
    setForm(prev => ({ ...prev, serviceCountries: prev.serviceCountries.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      const data = await res.json();
      setError(typeof data.error === 'string' ? data.error : 'Failed to save settings');
    }
    setSaving(false);
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-dim)' }}>Loading...</div>;
  }

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: 'var(--space-6)' }}>Site Settings</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '900px' }}>
        
        {/* Site Profile settings */}
        <div className="form-card">
          <h2>General & Branding</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Site Name</label>
              <input className="form-input" name="siteName" value={form.siteName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Branding Tagline</label>
              <input className="form-input" name="tagline" value={form.tagline} onChange={handleChange} placeholder="e.g. Trust starts with visibility" />
            </div>
            <div className="form-group">
              <label className="form-label">Hero Banner Background Image</label>
              <ImageUploader value={form.heroBackgroundImage} onChange={url => setForm(prev => ({ ...prev, heroBackgroundImage: url }))} />
            </div>
          </div>
        </div>

        {/* Contact details */}
        <div className="form-card">
          <h2>Contact Information</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Contact Email Address</label>
                <input className="form-input" name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Phone Number</label>
                <input className="form-input" name="contactPhone" value={form.contactPhone} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Physical Address</label>
              <textarea className="form-textarea" name="address" value={form.address} onChange={handleChange} rows={3} />
            </div>
          </div>
        </div>

        {/* Company & Country Badges */}
        <div className="settings-grid">
          <div className="form-card">
            <h2>Trusted Partners</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <input
                  className="form-input"
                  placeholder="Company Name"
                  value={companyInput}
                  onChange={e => setCompanyInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCompany();
                    }
                  }}
                />
                <button type="button" className="cms-btn cms-btn-secondary" onClick={addCompany}>Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                {form.trustedCompanies.map((c, i) => (
                  <span className="tag-chip" key={i}>
                    {c}
                    <button type="button" className="tag-chip-remove" onClick={() => removeCompany(i)}>×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="form-card">
            <h2>Coverage Countries</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <input
                  className="form-input"
                  placeholder="Country"
                  value={countryInput}
                  onChange={e => setCountryInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCountry();
                    }
                  }}
                />
                <button type="button" className="cms-btn cms-btn-secondary" onClick={addCountry}>Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                {form.serviceCountries.map((c, i) => (
                  <span className="tag-chip" key={i}>
                    {c}
                    <button type="button" className="tag-chip-remove" onClick={() => removeCountry(i)}>×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social channels */}
        <div className="form-card">
          <h2>Social Channels</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Facebook Profile</label>
              <input className="form-input" name="facebook" value={form.socialLinks.facebook} onChange={handleSocial} />
            </div>
            <div className="form-group">
              <label className="form-label">Twitter / X Handle</label>
              <input className="form-input" name="twitter" value={form.socialLinks.twitter} onChange={handleSocial} />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn Page</label>
              <input className="form-input" name="linkedin" value={form.socialLinks.linkedin} onChange={handleSocial} />
            </div>
            <div className="form-group">
              <label className="form-label">Instagram Profile</label>
              <input className="form-input" name="instagram" value={form.socialLinks.instagram} onChange={handleSocial} />
            </div>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">Site configuration saved successfully!</div>}

        <button type="submit" className="cms-btn cms-btn-primary" disabled={saving} style={{ alignSelf: 'flex-start', padding: 'var(--space-3) var(--space-6)' }}>
          {saving ? 'Saving Settings...' : 'Apply Site Configuration'}
        </button>

      </form>
    </div>
  );
}
