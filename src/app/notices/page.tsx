'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface Notice {
  [key: string]: unknown;
  _id: string;
  title: string;
  priority: string;
  status: string;
  createdAt: string;
}

export default function NoticesListPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    const res = await fetch('/api/notices');
    if (res.ok) setNotices(await res.json());
    setLoading(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/notices/${deleteId}`, { method: 'DELETE' });
    if (res.ok) setNotices(notices.filter(n => n._id !== deleteId));
    setDeleteId(null);
  }

  const columns: Column<Notice>[] = [
    { key: 'title', label: 'Title' },
    {
      key: 'priority',
      label: 'Priority',
      render: (val) => {
        const priority = val as string;
        const color = priority === 'high' ? 'var(--red)' : priority === 'low' ? 'var(--text-dim)' : 'var(--gold)';
        return (
          <span style={{ color, fontWeight: 600, textTransform: 'capitalize' }}>
            {priority}
          </span>
        );
      }
    },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val as string} /> },
    { key: 'createdAt', label: 'Date', render: (val) => new Date(val as string).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="page-title-area">
        <div>
          <h1 className="page-title">Notices & Announcements</h1>
          <p className="page-subtitle">Manage system notices, notifications, and alerts</p>
        </div>
        <Link href="/notices/new" className="cms-btn cms-btn-primary">
          + New Notice
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={notices}
        loading={loading}
        emptyMessage="No notices yet. Create your first announcement!"
        actions={(row) => (
          <>
            <Link href={`/notices/${row._id}/edit`}>
              <button className="action-btn action-btn-edit" title="Edit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </Link>
            <button className="action-btn action-btn-delete" title="Delete" onClick={() => setDeleteId(row._id)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </>
        )}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Notice"
        message="Are you sure you want to delete this notice? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
