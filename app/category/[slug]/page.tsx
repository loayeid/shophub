import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getCategories, getCategoryBySlug, getProductsByCategory } from '@/lib/api'
import ProductCard from '@/components/product/product-card'

export async function generateStaticParams() {
  const categories = await getCategories();
 
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {

  const {slug} = await params;

  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    notFound()
  }
  
  const products = await getProductsByCategory(category.slug)
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category header with banner */}
      <div className="relative h-64 rounded-xl overflow-hidden mb-8">
        <Image
          src={category.image || "https://images.pexels.com/photos/5926377/pexels-photo-5926377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
          alt={category.name}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center">
          <div className="px-8">
            <h1 className="text-4xl font-bold text-white mb-2">{category.name}</h1>
            {category.description && (
              <p className="text-white/90 text-lg max-w-2xl">{category.description}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
      </nav>
      
      {/* Products */}
      {products.length > 0 ? (
        <div>
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {products.length} products in {category.name}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No products found in this category.
          </p>
          <Link 
            href="/"
            className="text-primary hover:underline"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  )
}