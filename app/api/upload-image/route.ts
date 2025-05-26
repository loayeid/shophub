// app/api/upload-image/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // handle your image upload logic here

  return NextResponse.json({ message: 'Upload successful' });
}
