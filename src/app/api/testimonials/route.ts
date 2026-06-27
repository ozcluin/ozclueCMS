import { NextResponse } from 'next/server';
import { getTestimonials, createTestimonial } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const testimonials = await getTestimonials();
  return NextResponse.json(testimonials);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, role, content, rating, active } = body;
    if (!name || !content) return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });

    const testimonial = await createTestimonial({
      name, company: company || '', role: role || '',
      content, rating: rating ?? 5, active: active ?? true,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
