import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/api';

export async function GET(req: NextRequest) {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 });
  }
}
