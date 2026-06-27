import { NextResponse } from 'next/server';
import { getNotices, createNotice } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const notices = await getNotices();
  return NextResponse.json(notices);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, priority, status } = body;
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const notice = await createNotice({
      title,
      content: content || '',
      priority: priority || 'normal',
      status: status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(notice, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create notice' }, { status: 500 });
  }
}
