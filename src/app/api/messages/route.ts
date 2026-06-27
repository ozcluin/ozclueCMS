import { NextResponse } from 'next/server';
import { getSubmissions } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const submissions = await getSubmissions();
  // Map submissions to message structure expected by front-end
  const messages = submissions.map(sub => ({
    _id: sub.id,
    name: sub.name,
    email: sub.email,
    companyName: sub.company,
    phone: sub.phone,
    subject: `Inquiry from ${sub.company || 'Individual'}`,
    message: sub.message,
    read: sub.status !== 'New',
    createdAt: sub.date,
  }));
  return NextResponse.json(messages);
}
