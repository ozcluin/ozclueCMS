'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface FAQ {
  [key: string]: unknown;
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
}

export default function FAQsListPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  async function fetchFAQs() {
    const res = await fetch('/api/faqs');
    if (res.ok) setFaqs(await res.json());
    setLoading(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/faqs/${deleteId}`, { method: 'DELETE' });
    if (res.ok) setFaqs(faqs.filter(f => f._id !== deleteId));
    setDeleteId(null);
  }

  const columns: Column<FAQ>[] = [
    { 
      key: 'question', 
      label: 'Question',
      render: (val) => {
        const question = val as string;
        return <span style={{ fontWeight: 500, color: 'var(--text-main)' }} title={question}>{question.length > 60 ? question.substring(0, 60) + '...' : question}</span>;
      }
    },
    { key: 'category', label: 'Category' },
    { 
      key: 'order', 
      label: 'Display Order',
      render: (val) => <span className="badge badge-normal" style={{ width: 'fit-content' }}>{val as number}</span>
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
          <h1 className="page-title">FAQ Database</h1>
          <p className="page-subtitle">Manage frequently asked questions, answers, and help categories shown on the main site</p>
        </div>
        <Link href="/faqs/new" className="cms-btn cms-btn-primary">
          + Add FAQ Item
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={faqs}
        loading={loading}
        emptyMessage="No FAQs added yet."
        actions={(row) => (
          <>
            <Link href={`/faqs/${row._id}/edit`}>
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
        title="Delete FAQ"
        message="Are you sure you want to remove this FAQ? This will instantly remove it from the public help center page."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
