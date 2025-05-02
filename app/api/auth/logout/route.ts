import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // Clear the auth_token cookie
  const response = NextResponse.json({ success: true, message: 'Logged out' })
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  })
  return response
}
