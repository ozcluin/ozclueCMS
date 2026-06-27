import { NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings || {
    siteName: 'OzClu Verification Services',
    tagline: 'Trust starts with visibility',
    heroBackgroundImage: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    trustedCompanies: [],
    serviceCountries: [],
    socialLinks: { facebook: '', twitter: '', linkedin: '', instagram: '' },
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await updateSiteSettings(body);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
