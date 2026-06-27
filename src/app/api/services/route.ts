import { NextResponse } from 'next/server';
import { getServices, createService } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const services = await getServices();
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, icon, features, order, active } = body;
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const service = await createService({
      title, description: description || '', icon: icon || '',
      features: Array.isArray(features) ? features : [],
      order: order ?? 0, active: active ?? true,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(service, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
