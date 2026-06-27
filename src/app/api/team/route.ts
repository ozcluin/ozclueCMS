import { NextResponse } from 'next/server';
import { getTeamMembers, createTeamMember } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const members = await getTeamMembers();
  return NextResponse.json(members);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, bio, image, email, order, active } = body;
    if (!name || !role) return NextResponse.json({ error: 'Name and role are required' }, { status: 400 });

    const member = await createTeamMember({
      name, role,
      bio: bio || '',
      image: image || '',
      email: email || '',
      order: order ?? 0,
      active: active ?? true,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(member, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
