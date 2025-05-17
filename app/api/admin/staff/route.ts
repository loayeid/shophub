import { NextRequest, NextResponse } from 'next/server';
import { getAllStaff, updateUserRole, inviteStaff } from '@/lib/db';
import getAuthUser from '@/lib/getAuthUser';

// GET: List all staff (admin/manager)
export async function GET() {
  const staff = await getAllStaff();
  return NextResponse.json({ staff });
}

// PATCH: Update staff role
export async function PATCH(req: NextRequest) {
  const user = getAuthUser();
  if (!user || (typeof user !== 'object') || !('role' in user) || (user as any).role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const { userId, role } = await req.json();
  if (!userId || !role) {
    return NextResponse.json({ success: false, message: 'Missing userId or role' }, { status: 400 });
  }
  await updateUserRole(userId, role);
  return NextResponse.json({ success: true });
}

// POST: Invite new staff
export async function POST(req: NextRequest) {
  const user = getAuthUser();
  if (!user || (typeof user !== 'object') || !('role' in user) || (user as any).role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const { name, email, role } = await req.json();
  if (!name || !email || !role) {
    return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
  }
  const staff = await inviteStaff({ name, email, role });
  return NextResponse.json({ success: true, staff });
}
