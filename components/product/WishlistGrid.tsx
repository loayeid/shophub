"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function WishlistGrid({ wishlist }: { wishlist: any[] }) {
  const { toast } = useToast();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {wishlist.map((item) => (
        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
          <Link href={`/product/${item.slug}`} className="block mb-2">
            <div className="relative h-40 w-full mb-2">
              <Image
                src={item.image || 'https://images.pexels.com/photos/5926377/pexels-photo-5926377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                alt={item.name}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded"
              />
            </div>
            <h2 className="text-lg font-semibold mb-1">{item.name}</h2>
          </Link>
          <div className="mt-auto flex justify-between items-center gap-2">
            <span className="text-primary font-bold">${item.price}</span>
            <Link href={`/product/${item.slug}`} className="text-blue-600 underline text-sm">View</Link>
            <button
              type="button"
              className="text-red-600 underline text-sm ml-2"
              onClick={async () => {
                await fetch('/api/wishlist', {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ productId: item.productId })
                });
                toast({
                  title: 'Removed from Wishlist',
                  description: 'This product has been removed from your wishlist.',
                  variant: 'default',
                });
                setTimeout(() => window.location.reload(), 1200);
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
