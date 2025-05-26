// This is a basic API route for handling forgot password requests.
// It expects a POST request with { email } in the body.
// You should implement the logic to generate a reset token, store it, and send an email.

import { NextResponse } from "next/server"
import { getUserByEmail, query } from '@/lib/db'
import { sendMail } from '@/lib/sendMail'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, message: "Invalid email." }, { status: 400 })
    }

    const user = await getUserByEmail(email)
    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json({ success: true })
    }

    // Generate a reset token and expiry (1 hour)
    const token = uuidv4()
    const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour from now
    // Store token and expiry in DB (assume users table has reset_token, reset_token_expires columns)
    await query('UPDATE users SET reset_token=?, reset_token_expires=? WHERE id=?', [token, expires, user.id])

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`
    await sendMail({
      to: email,
      subject: 'Reset your ShopHub password',
      html: `<p>Hello,</p><p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Forgot password error:', err)
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 })
  }
}
