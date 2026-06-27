'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface BlogPost {
  [key: string]: unknown;
  _id: string;
  title: string;
  slug: string;
  status: string;
  author: string;
  createdAt: string;
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    const res = await fetch('/api/blog');
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }

  async function handleDelete() {
    if (!deleteSlug) return;
    const res = await fetch(`/api/blog/${deleteSlug}`, { method: 'DELETE' });
    if (res.ok) setPosts(posts.filter(p => p.slug !== deleteSlug));
    setDeleteSlug(null);
  }

  const columns: Column<BlogPost>[] = [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val as string} /> },
    { key: 'createdAt', label: 'Date', render: (val) => new Date(val as string).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="page-title-area">
        <div>
          <h1 className="page-title">Blog Posts</h1>
          <p className="page-subtitle">Manage news articles and insights</p>
        </div>
        <Link href="/blog/new" className="cms-btn cms-btn-primary">
          + New Post
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={posts}
        loading={loading}
        emptyMessage="No blog posts yet. Create your first post!"
        actions={(row) => (
          <>
            <Link href={`/blog/${row.slug}/edit`}>
              <button className="action-btn action-btn-edit" title="Edit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </Link>
            <button className="action-btn action-btn-delete" title="Delete" onClick={() => setDeleteSlug(row.slug)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </>
        )}
      />

      <ConfirmDialog
        open={!!deleteSlug}
        title="Delete Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteSlug(null)}
      />
    </div>
  );
}
