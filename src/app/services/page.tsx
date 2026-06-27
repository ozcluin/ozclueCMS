'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface Service {
  [key: string]: unknown;
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
}

export default function ServicesListPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const res = await fetch('/api/services');
    if (res.ok) setServices(await res.json());
    setLoading(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/services/${deleteId}`, { method: 'DELETE' });
    if (res.ok) setServices(services.filter(s => s._id !== deleteId));
    setDeleteId(null);
  }

  const columns: Column<Service>[] = [
    { key: 'title', label: 'Service Name' },
    {
      key: 'description',
      label: 'Description',
      render: (val) => <span className="line-clamp-2" style={{ maxWidth: '400px' }}>{val as string}</span>
    },
    { key: 'icon', label: 'Icon Class / Name' },
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
          <h1 className="page-title">Service Settings</h1>
          <p className="page-subtitle">Configure the screening and verification solutions offered on the portal</p>
        </div>
        <Link href="/services/new" className="cms-btn cms-btn-primary">
          + Add Service
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={services}
        loading={loading}
        emptyMessage="No services configured yet."
        actions={(row) => (
          <>
            <Link href={`/services/${row._id}/edit`}>
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
        title="Delete Service"
        message="Are you sure you want to delete this service solution listing? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
