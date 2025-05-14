import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import getAuthUser from '@/lib/getAuthUser';

export async function POST(req: NextRequest) {
  const user = getAuthUser();
  const role = typeof user === 'object' && user !== null && 'role' in user ? (user as any).role : undefined;
  if (!role || role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ success: false, message: 'Missing product id' }, { status: 400 });
  }
  await query('DELETE FROM product_images WHERE product_id = ?', [id]);
  await query('DELETE FROM products WHERE id = ?', [id]);
  return NextResponse.json({ success: true });
}
