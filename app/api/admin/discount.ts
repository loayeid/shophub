import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import getAuthUser from '@/lib/getAuthUser';

// POST: Add a new discount code
export async function POST(req: NextRequest) {
  const user = getAuthUser();
  if (!user || (typeof user !== 'object') || !('role' in user) || ((user as any).role !== 'admin' && (user as any).role !== 'manager')) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const { code, type, value, minOrder, maxDiscount, startDate, endDate, usageLimit, active } = await req.json();
  if (!code || !type || !value) {
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
  }
  const id = uuidv4();
  try {
    await query(
      'INSERT INTO discounts (id, code, type, value, min_order, max_discount, start_date, end_date, usage_limit, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, code, type, value, minOrder, maxDiscount, startDate, endDate, usageLimit, active ? 1 : 0]
    );
    return NextResponse.json({ success: true, id, message: 'Discount code created' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Database error' }, { status: 500 });
  }
}

// GET: List all discount codes
export async function GET() {
  try {
    const codes = await query('SELECT * FROM discounts ORDER BY created_at DESC');
    return NextResponse.json({ codes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH: Update a discount code
export async function PATCH(req: NextRequest) {
  const user = getAuthUser();
  if (!user || (typeof user !== 'object') || !('role' in user) || ((user as any).role !== 'admin' && (user as any).role !== 'manager')) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const { id, ...fields } = await req.json();
  if (!id) {
    return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });
  }
  const updates = Object.keys(fields).map(key => `${key}=?`).join(', ');
  const values = Object.values(fields);
  try {
    await query(`UPDATE discounts SET ${updates} WHERE id=?`, [...values, id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Remove a discount code
export async function DELETE(req: NextRequest) {
  const user = getAuthUser();
  if (!user || (typeof user !== 'object') || !('role' in user) || ((user as any).role !== 'admin' && (user as any).role !== 'manager')) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });
  }
  try {
    await query('DELETE FROM discounts WHERE id=?', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
