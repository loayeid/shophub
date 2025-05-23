import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item: any) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
              <Link href={`/product/${item.product.slug}`} className="block mb-2">
                <div className="relative h-40 w-full mb-2">
                  <Image
                    src={item.product.image || 'https://images.pexels.com/photos/5926377/pexels-photo-5926377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                    alt={item.product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded"
                  />
                </div>
                <h2 className="text-lg font-semibold mb-1">{item.product.name}</h2>
              </Link>
              <div className="mt-auto flex justify-between items-center">
                <span className="text-primary font-bold">${item.product.price}</span>
                <Link href={`/product/${item.product.slug}`} className="text-blue-600 underline text-sm">View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
