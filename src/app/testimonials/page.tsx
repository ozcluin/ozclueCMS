'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface Testimonial {
  [key: string]: unknown;
  _id: string;
  name: string;
  company: string;
  role: string;
  rating: number;
  active: boolean;
}

export default function TestimonialsListPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    const res = await fetch('/api/testimonials');
    if (res.ok) setTestimonials(await res.json());
    setLoading(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/testimonials/${deleteId}`, { method: 'DELETE' });
    if (res.ok) setTestimonials(testimonials.filter(t => t._id !== deleteId));
    setDeleteId(null);
  }

  const columns: Column<Testimonial>[] = [
    { key: 'name', label: 'Client Name' },
    { key: 'company', label: 'Company' },
    { key: 'role', label: 'Role / Designation' },
    {
      key: 'rating',
      label: 'Rating',
      render: (val) => {
        const rating = val as number;
        return <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{Array(rating).fill('★').join('')}</span>;
      }
    },
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
          <h1 className="page-title">Testimonials</h1>
          <p className="page-subtitle">Manage client reviews, feedback, and endorsements displayed on the website</p>
        </div>
        <Link href="/testimonials/new" className="cms-btn cms-btn-primary">
          + Add Testimonial
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={testimonials}
        loading={loading}
        emptyMessage="No testimonials added yet."
        actions={(row) => (
          <>
            <Link href={`/testimonials/${row._id}/edit`}>
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
        title="Delete Testimonial"
        message="Are you sure you want to remove this client endorsement? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
