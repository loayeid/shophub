import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import getAuthUser from '@/lib/getAuthUser';

export async function POST(req: NextRequest) {
  const user = getAuthUser();
  if (
    !user ||
    (typeof user !== 'object') ||
    !('role' in user) ||
    (user as any).role !== 'admin'
  ) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ success: false, message: 'Missing category id' }, { status: 400 });
  }
  await query('DELETE FROM categories WHERE id = ?', [id]);
  return NextResponse.json({ success: true });
}
