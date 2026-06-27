'use client';

import { useEffect, useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { createAccountFromInquiry } from '@/app/actions';

interface Message {
  _id: string;
  name: string;
  email: string;
  companyName?: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const res = await fetch('/api/messages');
    if (res.ok) {
      const data = await res.json();
      // Filter out archived messages (in existing schema, status !== 'Archived' and status !== 'Account Created' is shown)
      // Since we map submissions to messages, let's keep all active messages
      setMessages(data);
    }
    setLoading(false);
  }

  async function markAsRead(msg: Message) {
    setSelected(msg);
    if (!msg.read) {
      await fetch(`/api/messages/${msg._id}`, { method: 'PATCH' });
      setMessages(messages.map((m) => (m._id === msg._id ? { ...m, read: true } : m)));
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/messages/${deleteId}`, { method: 'DELETE' });
    if (res.ok) {
      setMessages(messages.filter((m) => m._id !== deleteId));
      if (selected?._id === deleteId) setSelected(null);
    }
    setDeleteId(null);
  }

  async function handleApproveAndSetup(msg: Message) {
    if (!confirm('Are you sure you want to approve this inquiry and create a corporate client account?')) {
      return;
    }
    setActionLoading(true);
    setError('');
    try {
      await createAccountFromInquiry(msg._id);
      alert('Corporate account created successfully! The client is now registered as an Active company.');
      // Remove from messages or update status locally
      setMessages(messages.filter(m => m._id !== msg._id));
      setSelected(null);
    } catch (err: any) {
      setError(err.message || 'Failed to create corporate account.');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-dim)' }}>Loading...</div>;
  }

  return (
    <div>
      <div className="page-title-area">
        <div>
          <h1 className="page-title">
            Inbox Messages{' '}
            <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-dim)' }}>
              ({messages.filter((m) => !m.read).length} unread)
            </span>
          </h1>
          <p className="page-subtitle">Review screening requests, partnership inquiries, and client submissions</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>
          {error}
        </div>
      )}

      <div className="inbox-layout">
        {/* Messages List */}
        <div className="inbox-list">
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-dim)' }}>
              No messages found
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => markAsRead(msg)}
                className={`inbox-item ${selected?._id === msg._id ? 'inbox-item-active' : ''} ${
                  !msg.read ? 'inbox-item-unread' : ''
                }`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontWeight: !msg.read ? 700 : 500, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                      {msg.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.companyName || 'Individual'} | {msg.email}
                    </p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px' }} className="line-clamp-1">
                      {msg.message}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px', flexShrink: 0 }}>
                    {!msg.read && <div className="unread-dot" />}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(msg._id);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-dim)',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                      title="Archive Message"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Message Details */}
        <div>
          {selected ? (
            <div className="form-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '2px' }}>{selected.subject}</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      From: <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selected.name}</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                      className="cms-btn cms-btn-primary cms-btn-sm"
                      onClick={() => handleApproveAndSetup(selected)}
                      disabled={actionLoading}
                    >
                      Approve & Onboard
                    </button>
                    <button
                      className="cms-btn cms-btn-secondary cms-btn-sm"
                      style={{ color: 'var(--red)', borderColor: 'var(--red-glow)' }}
                      onClick={() => setDeleteId(selected._id)}
                      disabled={actionLoading}
                    >
                      Archive
                    </button>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-dim)' }}>Email: </span>
                    {selected.email}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-dim)' }}>Phone: </span>
                    {selected.phone || 'N/A'}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-dim)' }}>Organization: </span>
                    {selected.companyName || 'Individual'}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-dim)' }}>Received: </span>
                    {new Date(selected.createdAt).toLocaleString()}
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

                <div>
                  <span style={{ fontWeight: 600, color: 'var(--text-dim)', fontSize: '0.8125rem', display: 'block', marginBottom: '8px' }}>
                    MESSAGE
                  </span>
                  <div style={{ fontSize: '0.9375rem', lineHeight: '1.6', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                    {selected.message}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="form-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-12)', height: '240px', color: 'var(--text-dim)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.5, marginBottom: 'var(--space-3)' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <p>Select an inquiry message from the list to view</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Archive Message"
        message="Are you sure you want to archive this contact message?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
