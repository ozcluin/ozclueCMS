import { NextResponse } from 'next/server';
import { getGalleryImages, createGalleryImage } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const images = await getGalleryImages();
  return NextResponse.json(images);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, caption, category } = body;
    if (!url) return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });

    const image = await createGalleryImage({
      url, caption: caption || '', category: category || 'general',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(image, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
