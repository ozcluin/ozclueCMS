import { NextResponse } from 'next/server';
import { getBlogPosts, createBlogPost } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, author, tags, status } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const post = await createBlogPost({
      title,
      slug,
      excerpt: excerpt || '',
      content: content || '',
      coverImage: coverImage || '',
      author: author || 'Admin',
      tags: Array.isArray(tags) ? tags : [],
      status: status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create post' }, { status: 500 });
  }
}
