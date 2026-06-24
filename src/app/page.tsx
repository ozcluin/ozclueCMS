import Link from 'next/link';
import { getSubmissions, getAccounts, getVerifications } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const submissions = await getSubmissions();
  const accounts = await getAccounts();
  const verifications = await getVerifications();


  // Compute stats
  const totalSubmissions = submissions.length;
  const pendingInquiries = submissions.filter(sub => sub.status === 'New').length;
  
  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter(acc => acc.status === 'Active').length;

  const totalChecks = verifications.length;
  const inProgressChecks = verifications.filter(v => v.status === 'In Progress' || v.status === 'Pending').length;
  const completedChecks = verifications.filter(v => v.status === 'Completed').length;
  const actionRequiredChecks = verifications.filter(v => v.status === 'Action Required').length;

  // Recent 3 submissions
  const recentSubmissions = submissions.slice(0, 3);
  // Recent 4 checks
  const recentChecks = verifications.slice(0, 4);

  return (
    <>
      <div className="page-title-area">
        <div>
          <h1 className="page-title">Operations Control</h1>
          <p className="page-subtitle">Real-time status of inquiries, screening operations, and compliance tasks.</p>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="stat-grid">
        <div className="glass-card stat-card">
          <span className="stat-label">Pending Inquiries</span>
          <span className="stat-val">{pendingInquiries}</span>
          <span className="stat-change" style={{ color: 'var(--gold)' }}>
            {totalSubmissions} Total Received
          </span>
        </div>

        <div className="glass-card stat-card">
          <span className="stat-label">Active Clients</span>
          <span className="stat-val">{activeAccounts}</span>
          <span className="stat-change" style={{ color: 'var(--primary)' }}>
            {totalAccounts} Registered Accounts
          </span>
        </div>

        <div className="glass-card stat-card">
          <span className="stat-label">Checks In Progress</span>
          <span className="stat-val">{inProgressChecks}</span>
          <span className="stat-change" style={{ color: 'var(--gold)' }}>
            Across all corporations
          </span>
        </div>

        <div className="glass-card stat-card">
          <span className="stat-label">Completed Checks</span>
          <span className="stat-val">{completedChecks}</span>
          <span className="stat-change" style={{ color: 'var(--primary)' }}>
            {actionRequiredChecks} Action Required
          </span>
        </div>
      </div>

      <div className="grid-2">
        {/* Recent Inquiries Panel */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>Recent Inquiries</h3>
            <Link href="/inquiries" className="cms-btn cms-btn-secondary cms-btn-sm">
              View All
            </Link>
          </div>
          
          {recentSubmissions.length === 0 ? (
            <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>No contact inquiries found.</p>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Contact</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((sub) => (
                    <tr key={sub.id}>
                      <td style={{ fontWeight: 600 }}>{sub.company || 'Individual'}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{sub.name}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{sub.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${sub.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Background Checks Panel */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>Verification Pipeline</h3>
            <Link href="/verifications" className="cms-btn cms-btn-secondary cms-btn-sm">
              Manage Checks
            </Link>
          </div>

          {recentChecks.length === 0 ? (
            <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>No background checks found.</p>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Type</th>
                    <th>Client</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentChecks.map((check) => (
                    <tr key={check.id}>
                      <td style={{ fontWeight: 600 }}>{check.candidateName}</td>
                      <td>{check.type}</td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{check.clientCompany}</td>
                      <td>
                        <span className={`badge badge-${check.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {check.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
