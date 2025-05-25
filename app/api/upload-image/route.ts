import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // handle file upload logic here
  return NextResponse.json({ message: "Image uploaded successfully" });
}
