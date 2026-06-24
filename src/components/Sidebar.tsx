'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAdmin } from '@/app/actions';

interface SidebarProps {
  adminEmail: string;
  adminName: string;
  adminAvatar: string;
  adminRole: string;
}

export default function Sidebar({ adminEmail, adminName, adminAvatar, adminRole }: SidebarProps) {
  const pathname = usePathname();

  const navLinks = [
    {
      label: 'Dashboard',
      href: '/',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      )
    },
    {
      label: 'Contact Inquiries',
      href: '/inquiries',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    },
    {
      label: 'Client Accounts',
      href: '/accounts',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      label: 'Candidate Checks',
      href: '/verifications',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    }
  ];

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.reload();
  };

  return (
    <aside className="sidebar">
      {/* Brand logo */}
      <div className="brand-section" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <svg width="28" height="28" viewBox="0 0 50 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <circle cx="18" cy="14" r="11" fill="none" stroke="var(--gold)" strokeWidth="3.6" />
          <path d="M12 9 Q14 4, 19 5" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <path d="M27 22 L40 22 L27 36 L40 36" fill="none" stroke="var(--gold)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ 
          fontFamily: 'var(--font-serif)', 
          fontSize: '1.4rem', 
          fontWeight: 700, 
          color: 'var(--text-main)',
          whiteSpace: 'nowrap'
        }}>
          OzClu <span style={{ color: 'var(--primary)' }}>CMS</span>
        </span>
      </div>

      {/* Nav Links */}
      <nav className="nav-links">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile with logout button */}
      <div className="admin-profile-container">
        <div className="admin-profile">
          <div className="profile-avatar">{adminAvatar}</div>
          <div className="profile-info">
            <span className="profile-name" title={adminEmail}>{adminName}</span>
            <span className="profile-role">{adminRole}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn" title="Logout from CMS">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

