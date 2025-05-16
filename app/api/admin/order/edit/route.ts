import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import getAuthUser from '@/lib/getAuthUser';

// PATCH: Update order status or refund
export async function PATCH(req: NextRequest) {
  const user = getAuthUser();
  // If getAuthUser returns a JWT or string, parse or typecast accordingly
  let role: string | undefined;
  if (typeof user === 'string') {
    try {
      const parsed = JSON.parse(user);
      role = parsed.role;
    } catch {
      role = undefined;
    }
  } else if (user && typeof user === 'object' && 'role' in user) {
    role = (user as any).role;
  }
  if (!role || (role !== 'admin' && role !== 'manager')) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const { orderId, status, refund } = await req.json();
  if (!orderId) {
    return NextResponse.json({ success: false, message: 'Missing orderId' }, { status: 400 });
  }
  if (status) {
    await query('UPDATE `order` SET status=? WHERE id=?', [status, orderId]);
  }
  if (refund) {
    // Mark as refunded and optionally handle payment gateway refund logic here
    await query('UPDATE `order` SET status=? WHERE id=?', ['refunded', orderId]);
  }
  return NextResponse.json({ success: true });
}
