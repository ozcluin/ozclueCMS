'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface TeamMember {
  [key: string]: unknown;
  _id: string;
  name: string;
  role: string;
  email: string;
  active: boolean;
  order: number;
}

export default function TeamListPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    const res = await fetch('/api/team');
    if (res.ok) setMembers(await res.json());
    setLoading(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/team/${deleteId}`, { method: 'DELETE' });
    if (res.ok) setMembers(members.filter(m => m._id !== deleteId));
    setDeleteId(null);
  }

  const columns: Column<TeamMember>[] = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'order', label: 'Display Order' },
    {
      key: 'active',
      label: 'Status',
      render: (val) => <StatusBadge active={val as boolean} activeLabel="Active" inactiveLabel="Inactive" />
    },
  ];

  return (
    <div>
      <div className="page-title-area">
        <div>
          <h1 className="page-title">Team Members</h1>
          <p className="page-subtitle">Manage corporate leadership and operations staff listings</p>
        </div>
        <Link href="/team/new" className="cms-btn cms-btn-primary">
          + Add Member
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={members}
        loading={loading}
        emptyMessage="No team members added yet."
        actions={(row) => (
          <>
            <Link href={`/team/${row._id}/edit`}>
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
        title="Delete Team Member"
        message="Are you sure you want to remove this team member from the directory?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
