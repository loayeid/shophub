import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/api';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters: any = {};
    if (searchParams.has('brand')) filters.brand = searchParams.get('brand');
    if (searchParams.has('minPrice')) filters.minPrice = Number(searchParams.get('minPrice'));
    if (searchParams.has('maxPrice')) filters.maxPrice = Number(searchParams.get('maxPrice'));
    if (searchParams.has('rating')) filters.rating = Number(searchParams.get('rating'));
    if (searchParams.has('shippingSpeed')) filters.shippingSpeed = searchParams.get('shippingSpeed');
    const products = await getProducts(filters);
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 });
  }
}
