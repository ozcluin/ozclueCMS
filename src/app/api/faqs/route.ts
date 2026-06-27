import { NextResponse } from 'next/server';
import { getFAQs, createFAQ } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const faqs = await getFAQs();
  return NextResponse.json(faqs);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, answer, category, order, active } = body;
    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const faq = await createFAQ({
      question,
      answer,
      category: category || 'General',
      order: order !== undefined ? Number(order) : 99,
      active: active ?? true,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
