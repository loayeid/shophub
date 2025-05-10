import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }
    const imageUrl = await generateImage(prompt);
    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate image' }, { status: 500 });
  }
}
