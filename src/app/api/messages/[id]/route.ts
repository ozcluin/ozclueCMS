import { NextResponse } from 'next/server';
import { updateSubmissionStatus } from '@/lib/db';

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Mark as read in submissions database schema is 'Read' status
    await updateSubmissionStatus(id, 'Read');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Archive in submissions database schema is 'Archived' status
    await updateSubmissionStatus(id, 'Archived');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
