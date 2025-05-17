import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import getAuthUser from '@/lib/getAuthUser';

// PATCH: Moderate a review (approve/reject)
export async function PATCH(req: NextRequest) {
  const user = getAuthUser();
  if (!user || (typeof user !== 'object') || !('role' in user) || ((user as any).role !== 'admin' && (user as any).role !== 'manager')) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const { id, status } = await req.json();
  if (!id || !status) {
    return NextResponse.json({ success: false, message: 'Missing id or status' }, { status: 400 });
  }
  try {
    await query('UPDATE reviews SET status=? WHERE id=?', [status, id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
