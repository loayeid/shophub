import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import getAuthUser from '@/lib/getAuthUser';

export async function POST(req: NextRequest) {
  const user = getAuthUser();
  if (
    !user ||
    (typeof user === 'object'
      ? (user as any).role !== 'admin'
      : true)
  ) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const { name, slug, image, description } = await req.json();
  if (!name || !slug) {
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
  }
  const id = uuidv4();
  await query('INSERT INTO categories (id, name, slug, image, description) VALUES (?, ?, ?, ?, ?)', [id, name, slug, image, description]);
  return NextResponse.json({ success: true, id });
}
