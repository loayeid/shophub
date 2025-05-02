import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/db'
import bcrypt from 'bcryptjs'

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

  // TODO: Set session/cookie here

  return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } })
}
