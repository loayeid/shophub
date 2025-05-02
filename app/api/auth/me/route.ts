import { NextRequest, NextResponse } from 'next/server'
import getAuthUser from '@/lib/getAuthUser'

export async function GET(req: NextRequest) {
  const user = getAuthUser()
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ success: true, user })
}
