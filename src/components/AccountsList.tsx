'use client';

import { useState } from 'react';
import { Account } from '@/lib/db';
import { createClientAccount, updateAccountStatus } from '@/app/actions';

interface AccountsListProps {
  initialAccounts: Account[];
}

export default function AccountsList({ initialAccounts }: AccountsListProps) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createClientAccount(name, email, company);
      // Optimistic or real re-load
      const newAcc: Account = {
        id: `acc_${Date.now()}`,
        name,
        email,
        company,
        status: 'Active',
        dateCreated: new Date().toISOString()
      };
      setAccounts(prev => [newAcc, ...prev]);
      
      // Reset form
      setName('');
      setEmail('');
      setCompany('');
      setShowForm(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to register corporate account.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: Account['status']) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setActionLoadingId(id);
    setError('');

    try {
      await updateAccountStatus(id, nextStatus);
      setAccounts(prev => 
        prev.map(acc => acc.id === id ? { ...acc, status: nextStatus } : acc)
      );
    } catch (err) {
      console.error(err);
      setError('Failed to update account status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div>
      <div className="page-title-area">
        <div>
          <h1 className="page-title">Client Accounts</h1>
          <p className="page-subtitle">Monitor and register corporate client accounts accessing the verification dashboard.</p>
        </div>
        <button 
          className="cms-btn cms-btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel Onboarding' : 'Onboard Client'}
        </button>
      </div>

      {error && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--red)', color: 'var(--red)', marginBottom: 'var(--space-4)', padding: 'var(--space-3)' }}>
          {error}
        </div>
      )}

      {/* Manual Onboarding Form */}
      {showForm && (
        <form onSubmit={handleAddAccount} className="glass-card" style={{ marginBottom: 'var(--space-6)', maxWidth: '600px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-4)', fontSize: '1.25rem' }}>
            Register Client Organisation
          </h3>
          
          <div className="form-group">
            <label className="form-label">Client Company Name</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              placeholder="e.g. Sterling Ventures" 
              value={company}
              onChange={e => setCompany(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Contact Person Name</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                placeholder="e.g. Richard Hendricks" 
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Corporate Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                required 
                placeholder="e.g. rhendricks@sterling.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="cms-btn cms-btn-primary" disabled={loading} style={{ marginTop: 'var(--space-2)' }}>
            {loading ? 'Onboarding...' : 'Onboard Organisation'}
          </button>
        </form>
      )}

      {/* Accounts List Table */}
      <div className="glass-card table-container" style={{ padding: 0 }}>
        {accounts.length === 0 ? (
          <p style={{ padding: 'var(--space-6)', color: 'var(--text-dim)', textAlign: 'center' }}>
            No client accounts registered.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Account ID</th>
                <th>Company</th>
                <th>Primary Contact</th>
                <th>Date Onboarded</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => {
                const isLoading = actionLoadingId === acc.id;
                return (
                  <tr key={acc.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
                      {acc.id}
                    </td>
                    <td style={{ fontWeight: 600 }}>{acc.company}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500 }}>{acc.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{acc.email}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                      {new Date(acc.dateCreated).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge badge-${acc.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {acc.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={`cms-btn cms-btn-sm ${acc.status === 'Active' ? 'cms-btn-secondary' : 'cms-btn-primary'}`}
                        disabled={isLoading}
                        onClick={() => handleToggleStatus(acc.id, acc.status)}
                      >
                        {acc.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
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
