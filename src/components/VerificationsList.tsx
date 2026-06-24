'use client';

import { useState } from 'react';
import { Verification } from '@/lib/db';
import { createVerificationCase, updateVerificationStatus } from '@/app/actions';

interface VerificationsListProps {
  initialVerifications: Verification[];
  clientCompanies: string[];
}

export default function VerificationsList({ initialVerifications, clientCompanies }: VerificationsListProps) {
  const [verifications, setVerifications] = useState<Verification[]>(initialVerifications);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Form states
  const [candidateName, setCandidateName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [verificationType, setVerificationType] = useState<Verification['type']>('Employment');

  const handleAddCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientCompany) {
      setError('Please select a client company. If none are listed, onboard an organisation first.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await createVerificationCase(candidateName, verificationType, clientCompany);
      
      const newCase: Verification = {
        id: `ver_${Date.now()}`,
        candidateName,
        type: verificationType,
        clientCompany,
        status: 'Pending',
        dateInitiated: new Date().toISOString(),
        reportUrl: ''
      };
      setVerifications(prev => [newCase, ...prev]);

      // Reset
      setCandidateName('');
      setVerificationType('Employment');
      setShowForm(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to initiate verification check.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: Verification['status']) => {
    setActionLoadingId(id);
    setError('');

    try {
      await updateVerificationStatus(id, status);
      setVerifications(prev => 
        prev.map(v => {
          if (v.id === id) {
            let reportUrl = v.reportUrl;
            if (status === 'Completed' && !reportUrl) {
              reportUrl = `/reports/rep_${v.candidateName.toLowerCase().replace(/\s+/g, '_')}.pdf`;
            }
            return { ...v, status, reportUrl };
          }
          return v;
        })
      );
    } catch (err) {
      console.error(err);
      setError('Failed to update verification case status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div>
      <div className="page-title-area">
        <div>
          <h1 className="page-title">Candidate Checks</h1>
          <p className="page-subtitle">Track, update, and publish transparent screening results for candidate checks.</p>
        </div>
        <button 
          className="cms-btn cms-btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel Check' : 'Initiate New Check'}
        </button>
      </div>

      {error && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--red)', color: 'var(--red)', marginBottom: 'var(--space-4)', padding: 'var(--space-3)' }}>
          {error}
        </div>
      )}

      {/* New Verification Case Form */}
      {showForm && (
        <form onSubmit={handleAddCase} className="glass-card" style={{ marginBottom: 'var(--space-6)', maxWidth: '600px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-4)', fontSize: '1.25rem' }}>
            Initiate Candidate Verification
          </h3>

          <div className="form-group">
            <label className="form-label">Candidate Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              placeholder="e.g. Richard Hendricks" 
              value={candidateName}
              onChange={e => setCandidateName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Client Organisation</label>
              <select 
                className="form-select" 
                required 
                value={clientCompany}
                onChange={e => setClientCompany(e.target.value)}
              >
                <option value="" disabled>Select active company</option>
                {clientCompanies.map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Verification Class</label>
              <select 
                className="form-select" 
                required 
                value={verificationType}
                onChange={e => setVerificationType(e.target.value as Verification['type'])}
              >
                <option value="Employment">Employment Verification</option>
                <option value="Identity">Identity Check</option>
                <option value="Due Diligence">Due Diligence Audit</option>
                <option value="Compliance">Compliance Check</option>
              </select>
            </div>
          </div>

          <button type="submit" className="cms-btn cms-btn-primary" disabled={loading} style={{ marginTop: 'var(--space-2)' }}>
            {loading ? 'Initiating...' : 'Launch Verification'}
          </button>
        </form>
      )}

      {/* Verifications Table */}
      <div className="glass-card table-container" style={{ padding: 0 }}>
        {verifications.length === 0 ? (
          <p style={{ padding: 'var(--space-6)', color: 'var(--text-dim)', textAlign: 'center' }}>
            No candidate checks initiated yet.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Candidate</th>
                <th>Type</th>
                <th>Client Company</th>
                <th>Date Initiated</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifications.map((v) => {
                const isLoading = actionLoadingId === v.id;
                return (
                  <tr key={v.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
                      {v.id}
                    </td>
                    <td style={{ fontWeight: 600 }}>{v.candidateName}</td>
                    <td>{v.type}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{v.clientCompany}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                      {new Date(v.dateInitiated).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
                        <span className={`badge badge-${v.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {v.status}
                        </span>
                        {v.status === 'Completed' && v.reportUrl && (
                          <a 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); alert(`Downloading report: ${v.reportUrl}`); }}
                            style={{ fontSize: '0.6875rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}
                          >
                            Download Report
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        {v.status === 'Pending' && (
                          <button 
                            className="cms-btn cms-btn-primary cms-btn-sm"
                            disabled={isLoading}
                            onClick={() => handleUpdateStatus(v.id, 'In Progress')}
                          >
                            Start Check
                          </button>
                        )}
                        
                        {v.status === 'In Progress' && (
                          <>
                            <button 
                              className="cms-btn cms-btn-primary cms-btn-sm"
                              disabled={isLoading}
                              onClick={() => handleUpdateStatus(v.id, 'Completed')}
                            >
                              Approve & Publish
                            </button>
                            <button 
                              className="cms-btn cms-btn-secondary cms-btn-sm"
                              style={{ color: 'var(--red)' }}
                              disabled={isLoading}
                              onClick={() => handleUpdateStatus(v.id, 'Action Required')}
                            >
                              Flag Action
                            </button>
                          </>
                        )}

                        {v.status === 'Action Required' && (
                          <button 
                            className="cms-btn cms-btn-secondary cms-btn-sm"
                            disabled={isLoading}
                            onClick={() => handleUpdateStatus(v.id, 'In Progress')}
                          >
                            Resolve Flag
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
