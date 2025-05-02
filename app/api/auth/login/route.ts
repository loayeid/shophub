import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 })
  }

  const user = await getUserByEmail(email)
  if (!user) {
    return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 })
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 })
  }

  // Generate JWT and set as HTTP-only cookie
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.NEXTAUTH_SECRET || 'default_secret',
    { expiresIn: '30d' }
  )

  const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } })
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })
  return response
}
