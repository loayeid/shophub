import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/lib/sendMail';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }
    await sendMail({
      to: 'hubshop275@gmail.com',
      subject: `Contact Form Message from ${name}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message.replace(/\n/g, '<br>')}</p>`
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to send message.' }, { status: 500 });
  }
}
