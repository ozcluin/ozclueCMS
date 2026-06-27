import Link from 'next/link';
import { getSubmissions, getAccounts, getVerifications, getCollectionCount } from '@/lib/db';
import { StatsCard } from '@/components/StatsCard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [
    submissions,
    accounts,
    verifications,
    blogsCount,
    noticesCount,
    teamCount,
    servicesCount,
    galleryCount,
    testimonialsCount
  ] = await Promise.all([
    getSubmissions(),
    getAccounts(),
    getVerifications(),
    getCollectionCount('blogPosts'),
    getCollectionCount('notices'),
    getCollectionCount('teamMembers'),
    getCollectionCount('services'),
    getCollectionCount('galleryImages'),
    getCollectionCount('testimonials'),
  ]);

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

      {/* Primary Ops Stats Grid */}
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: 'var(--space-4)', color: 'var(--text-main)' }}>Screening Operations</h2>
      <div className="stat-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <StatsCard
          label="Pending Inquiries"
          value={pendingInquiries}
          href="/messages"
          accent="gold"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
        />
        <StatsCard
          label="Active Clients"
          value={activeAccounts}
          href="/accounts"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatsCard
          label="Checks In Progress"
          value={inProgressChecks}
          href="/verifications"
          accent="gold"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          }
        />
        <StatsCard
          label="Completed Checks"
          value={completedChecks}
          href="/verifications"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />
      </div>

      {/* CMS Content Stats Grid */}
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: 'var(--space-4)', color: 'var(--text-main)' }}>Content Management</h2>
      <div className="stat-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <StatsCard
          label="Blog Posts"
          value={blogsCount}
          href="/blog"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <path d="M16 8h2M16 12h2M8 8h5M8 12h5" />
            </svg>
          }
        />
        <StatsCard
          label="Notices"
          value={noticesCount}
          href="/notices"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          }
        />
        <StatsCard
          label="Team Directory"
          value={teamCount}
          href="/team"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          }
        />
        <StatsCard
          label="Services Listed"
          value={servicesCount}
          href="/services"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions & Previews */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Quick Actions Panel */}
        <div className="glass-card">
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Quick Actions</h3>
          <div className="quick-actions-grid">
            <Link href="/blog/new" className="quick-action-item">
              <div className="quick-action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>New Post</p>
            </Link>
            <Link href="/notices/new" className="quick-action-item">
              <div className="quick-action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                </svg>
              </div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>New Notice</p>
            </Link>
            <Link href="/team/new" className="quick-action-item">
              <div className="quick-action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Add Member</p>
            </Link>
            <Link href="/settings" className="quick-action-item">
              <div className="quick-action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82" />
                </svg>
              </div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Site Config</p>
            </Link>
          </div>
        </div>

        {/* Gallery / Reviews summary */}
        <div className="glass-card">
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Content Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{galleryCount}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-dim)' }}>Gallery Images</span>
              <Link href="/gallery" style={{ fontSize: '0.75rem', color: 'var(--gold)', textDecoration: 'none', marginTop: '6px', fontWeight: 600 }}>Manage Gallery →</Link>
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{testimonialsCount}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-dim)' }}>Client Testimonials</span>
              <Link href="/testimonials" style={{ fontSize: '0.75rem', color: 'var(--gold)', textDecoration: 'none', marginTop: '6px', fontWeight: 600 }}>Manage Feedback →</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Recent Inquiries Panel */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>Recent Inquiries</h3>
            <Link href="/messages" className="cms-btn cms-btn-secondary cms-btn-sm">
              Inbox
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
