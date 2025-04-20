import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star, ChevronRight, Truck, ArrowUpDown, Package } from 'lucide-react'
import { getProductBySlug, getProductReviews, getProducts, getRelatedProducts } from '@/lib/api'
import ProductCarousel from '@/components/product/product-carousel'
import AddToCartButton from '@/components/product/add-to-cart-button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export async function generateStaticParams() {
  const products = await getProducts();
 
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {

  const {slug} = await params;

  const product = await getProductBySlug(slug);
  
  if (!product) {
    notFound()
  }
  
  const reviews = await getProductReviews(product.id)
  const relatedProducts = await getRelatedProducts(product.id)
  
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : product.rating
  
  const isOnSale = product.originalPrice && product.originalPrice > product.price
  const discountPercentage = isOnSale
    ? Math.round((((product.originalPrice as number) - product.price) / (product.originalPrice as number)) * 100)
    : 0
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link href={`/category/${product.category.slug}`} className="hover:text-primary">
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-gray-700 dark:text-gray-300 truncate">{product.name}</span>
      </nav>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority
              style={{ objectFit: 'cover' }}
            />
            
            {isOnSale && (
              <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1">
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className="relative aspect-square rounded-md overflow-hidden border border-gray-200 dark:border-gray-800 cursor-pointer"
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {product.name}
          </h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-400 mr-3">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${i < Math.round(averageRating) ? 'fill-current' : 'stroke-current fill-transparent'}`} 
                />
              ))}
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                {(+averageRating).toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${(+product.price).toFixed(2)}
              </span>
              
              {isOnSale && (
                <span className="ml-3 text-lg text-gray-500 line-through">
                  ${(+product.originalPrice as number)?.toFixed(2)}
                </span>
              )}
            </div>
            
            {isOnSale && (
              <p className="text-green-600 dark:text-green-400 mt-1">
                You save ${(product.originalPrice! - product.price).toFixed(2)} ({discountPercentage}%)
              </p>
            )}
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {product.description}
          </p>
          
          <div className="mb-6">
            <AddToCartButton product={product} />
          </div>
          
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-800 pt-6">
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Orders over $50 qualify for free shipping.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <ArrowUpDown className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Easy Returns</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  30 day return policy. Free returns.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Package className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">In Stock</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Ships within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mb-12">
        <Tabs defaultValue="features">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="features" className="py-6">
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold mb-4">Product Features</h3>
              <ul className="space-y-2">
                {product.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="py-6">
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex border-b border-gray-200 dark:border-gray-800 py-2">
                    <span className="font-medium w-1/3">{key}</span>
                    <span className="text-gray-600 dark:text-gray-400 w-2/3">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="py-6">
            <div className="space-y-8">
              <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>
              
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 dark:border-gray-800 pb-6">
                      <div className="flex justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.userName}</p>
                          <div className="flex items-center">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'stroke-current fill-transparent'}`} 
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                              {new Date(review.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="font-medium mb-2">{review.title}</h4>
                      <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  There are no reviews for this product yet. Be the first to leave a review!
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <ProductCarousel products={relatedProducts} />
        </div>
      )}
    </div>
  )
}