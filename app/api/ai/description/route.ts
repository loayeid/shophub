import { NextRequest, NextResponse } from 'next/server';
import { generateDescription } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { productName, features } = await req.json();
    if (!productName) {
      return NextResponse.json({ error: 'Missing productName' }, { status: 400 });
    }
    const prompt = `Write a compelling product description for a product called "${productName}". Features: ${features || 'N/A'}`;
    const description = await generateDescription(prompt);
    return NextResponse.json({ description });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate description' }, { status: 500 });
  }
}
