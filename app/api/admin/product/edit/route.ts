import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import getAuthUser from '@/lib/getAuthUser';

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser();
    if (
      !user ||
      (typeof user === 'object' && 'role' in user
        ? (user as any).role !== 'admin'
        : true)
    ) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const { id, name, slug, description, price, originalPrice, images, categoryId, stock, features, specifications } = await req.json();
    if (!id || !name || !slug || !price || !categoryId || !stock) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }
    // Guard: do not update images if id is empty
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json({ success: false, message: 'Missing or invalid product id for image update' }, { status: 400 });
    }
    await query(
      'UPDATE products SET name=?, slug=?, description=?, price=?, original_price=?, category_id=?, stock=?, features=?, specifications=? WHERE id=?',
      [name, slug, description, price, originalPrice, categoryId, stock, JSON.stringify(features || []), JSON.stringify(specifications || {}), id]
    );
    // Optionally update images (delete old, insert new)
    if (images && Array.isArray(images) && id) {
      await query('DELETE FROM product_images WHERE product_id=?', [id]);
      for (let i = 0; i < images.length; i++) {
        if (!id) continue;
        await query('INSERT INTO product_images (product_id, url, position) VALUES (?, ?, ?)', [id, images[i], i]);
      }
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Product update error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to update product', error }, { status: 500 });
  }
}
