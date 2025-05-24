import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import WishlistGrid from '@/components/product/WishlistGrid'

export default async function WishlistPage() {
  // Get absolute base URL for fetch
  const forwardedHost = headers().get('x-forwarded-host')
  const baseUrl = forwardedHost
    ? `https://${forwardedHost}`
    : `http://localhost:${process.env.PORT || 3000}`

  // Fetch wishlist items for the logged-in user
  const res = await fetch(`${baseUrl}/api/wishlist`, {
    headers: { Cookie: cookies().toString() },
    cache: 'no-store',
  })
  if (!res.ok) {
    return (
      <div className="container mx-auto py-16 px-4 text-center text-lg text-gray-600 dark:text-gray-300">
        Please <Link href="/login" className="text-blue-600 underline">log in</Link> to view your wishlist.
      </div>
    )
  }
  const wishlist = await res.json()

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="text-gray-600 dark:text-gray-300 text-center py-8 text-lg">
          Your wishlist is empty.
        </div>
      ) : (
        <WishlistGrid wishlist={wishlist} />
      )}
    </div>
  )
}
