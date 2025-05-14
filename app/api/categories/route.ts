import { NextRequest, NextResponse } from 'next/server';
import { getCategories } from '@/lib/api';

export async function GET(req: NextRequest) {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch categories' }, { status: 500 });
  }
}
