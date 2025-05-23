import { NextRequest, NextResponse } from 'next/server'
import getAuthUser from '@/lib/getAuthUser'
import { getWishlist, isInWishlist, addToWishlist, removeFromWishlist } from '@/lib/db'

// GET: List wishlist items for the logged-in user
export async function GET(req: NextRequest) {
  const user = await getAuthUser()
  if (!user || typeof user === 'string' || !('id' in user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const wishlist = await getWishlist(user.id)
  return NextResponse.json(wishlist)
}

// POST: Add a product to wishlist
export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user || typeof user === 'string' || !('id' in user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { productId } = await req.json()
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  const exists = await isInWishlist(user.id, productId)
  if (exists) return NextResponse.json({ error: 'Already in wishlist' }, { status: 409 })
  const item = await addToWishlist(user.id, productId)
  return NextResponse.json(item)
}

// DELETE: Remove a product from wishlist
export async function DELETE(req: NextRequest) {
  const user = await getAuthUser()
  if (!user || typeof user === 'string' || !('id' in user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { productId } = await req.json()
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  await removeFromWishlist(user.id, productId)
  return NextResponse.json({ success: true })
}
