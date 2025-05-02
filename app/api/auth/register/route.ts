
import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 })
  }

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return NextResponse.json({ success: false, message: 'Email already in use.' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await createUser({ name, email, password: hashedPassword })

  return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } })
}
