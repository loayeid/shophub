import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import getAuthUser from '@/lib/getAuthUser';

// POST: Add a new review
export async function POST(req: NextRequest) {
  const { productId, userId, userName, rating, title, content } = await req.json();
  if (!productId || !userId || !userName || !rating || !title || !content) {
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
  }
  const id = uuidv4();
  const date = new Date().toISOString();
  try {
    await query(
      'INSERT INTO reviews (id, product_id, user_id, user_name, rating, title, content, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, productId, userId, userName, rating, title, content, date, 'approved']
    );
    return NextResponse.json({ success: true, id, message: 'Review submitted and approved' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Database error' }, { status: 500 });
  }
}
