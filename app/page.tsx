import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getFeaturedProducts, getCategories, getDeals } from '@/lib/api'
import ProductCard from '@/components/product/product-card'
import ProductCarousel from '@/components/product/product-carousel'
import { Button } from '@/components/ui/button'

export default async function Home() {
  // Fetch data for the homepage
  const featuredProducts = await getFeaturedProducts(4);  
  const categories = await getCategories()
  const deals = await getDeals(6)
  
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Hero background"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        </div>
        
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Summer Sale Is Now Live
            </h1>
            <p className="text-xl mb-8">
              Discover amazing deals on your favorite products. Up to 40% off on select items.
            </p>
            <div className="flex space-x-4">
              <Button size="lg" asChild>
                <Link href="/category/electronics">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-black border-white hover:bg-white/90">
                <Link href="/deals">View Deals</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link 
                href={`/category/${category.slug}`}
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg"
              >
                <div className="relative h-48">
                  <Image
                    src={category.image || "https://images.pexels.com/photos/5926377/pexels-photo-5926377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                    alt={category.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured products section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="ghost" asChild>
              <Link href="/search" className="flex items-center">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Deals section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Top Deals</h2>
            <Button variant="ghost" asChild>
              <Link href="/deals" className="flex items-center">
                View all deals <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          
          <ProductCarousel products={deals} />
        </div>
      </section>
    </div>
  )
}