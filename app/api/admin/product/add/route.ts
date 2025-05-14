import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
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
  const { name, slug, description, price, originalPrice, images, categoryId, stock, features, specifications } = await req.json();
  if (!name || !slug || !price || !categoryId || !stock) {
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
  }
  const id = uuidv4();
  await query('INSERT INTO products (id, name, slug, description, price, original_price, category_id, stock, features, specifications) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, name, slug, description, price, originalPrice, categoryId, stock, JSON.stringify(features || []), JSON.stringify(specifications || {})]);
  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      await query('INSERT INTO product_images (product_id, url, position) VALUES (?, ?, ?)', [id, images[i], i]);
    }
  }
  return NextResponse.json({ success: true, id });
}
