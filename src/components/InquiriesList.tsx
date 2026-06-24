'use client';

import { useState, Fragment } from 'react';
import { Submission } from '@/lib/db';
import { updateSubmissionStatus, createAccountFromInquiry } from '@/app/actions';

interface InquiriesListProps {
  initialSubmissions: Submission[];
}

export default function InquiriesList({ initialSubmissions }: InquiriesListProps) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleMarkRead = async (id: string) => {
    setLoadingId(id);
    setError('');
    try {
      await updateSubmissionStatus(id, 'Read');
      // Update local state
      setSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, status: 'Read' } : sub)
      );
    } catch (err) {
      console.error(err);
      setError('Failed to update status.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleCreateAccount = async (id: string) => {
    if (!confirm('Are you sure you want to approve this inquiry and create a corporate client account?')) {
      return;
    }
    setLoadingId(id);
    setError('');
    try {
      await createAccountFromInquiry(id);
      // Update local state
      setSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, status: 'Account Created' } : sub)
      );
      alert('Corporate account created successfully! The client is now registered as an Active company.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create corporate account.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleArchive = async (id: string) => {
    setLoadingId(id);
    setError('');
    try {
      await updateSubmissionStatus(id, 'Archived');
      // Update local state
      setSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, status: 'Archived' } : sub)
      );
    } catch (err) {
      console.error(err);
      setError('Failed to archive inquiry.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      {error && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--red)', color: 'var(--red)', marginBottom: 'var(--space-4)', padding: 'var(--space-3)' }}>
          {error}
        </div>
      )}

      <div className="glass-card table-container" style={{ padding: 0 }}>
        {submissions.length === 0 ? (
          <p style={{ padding: 'var(--space-6)', color: 'var(--text-dim)', textAlign: 'center' }}>
            No contact inquiries found in database.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Company</th>
                <th>Contact</th>
                <th>Date Received</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => {
                const isExpanded = expandedId === sub.id;
                const isLoading = loadingId === sub.id;

                return (
                  <Fragment key={sub.id}>
                    <tr style={{ cursor: 'pointer' }} onClick={() => toggleExpand(sub.id)}>
                      <td>
                        <span style={{ 
                          display: 'inline-block', 
                          transform: isExpanded ? 'rotate(90deg)' : 'none', 
                          transition: 'transform 0.2s',
                          fontSize: '0.75rem',
                          color: 'var(--text-dim)'
                        }}>
                          ▶
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{sub.company || 'Individual Client'}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 500 }}>{sub.name}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{sub.email} {sub.phone && `| ${sub.phone}`}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                        {new Date(sub.date).toLocaleDateString()} {new Date(sub.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td>
                        <span className={`badge badge-${sub.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          {sub.status === 'New' && (
                            <button 
                              className="cms-btn cms-btn-secondary cms-btn-sm"
                              disabled={isLoading}
                              onClick={() => handleMarkRead(sub.id)}
                            >
                              Mark Read
                            </button>
                          )}
                          
                          {(sub.status === 'New' || sub.status === 'Read') && (
                            <button 
                              className="cms-btn cms-btn-primary cms-btn-sm"
                              disabled={isLoading}
                              onClick={() => handleCreateAccount(sub.id)}
                            >
                              Approve & Setup
                            </button>
                          )}

                          {sub.status !== 'Archived' && (
                            <button 
                              className="cms-btn cms-btn-secondary cms-btn-sm"
                              style={{ color: 'var(--red)' }}
                              disabled={isLoading}
                              onClick={() => handleArchive(sub.id)}
                            >
                              Archive
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr onClick={() => toggleExpand(sub.id)}>
                        <td colSpan={6} style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 'var(--space-4) var(--space-8)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Inquiry Message Details</span>
                            <div className="inquiry-details">{sub.message}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
