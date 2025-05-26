"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/types'
import { useCart } from '@/context/cart-context'
import { useToast } from '@/hooks/use-toast'
import WishlistButton from './wishlist-button'
import { useUser } from '@/context/user-context'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {  
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { user } = useUser()
  
  const isOnSale = product.originalPrice && product.originalPrice > product.price
  const discountPercentage = isOnSale
    ? Math.round((((product.originalPrice as number) - product.price) / (product.originalPrice as number)) * 100)
    : 0
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: 'You must log in to add items to your cart',
        description: 'Please log in to continue.',
        variant: 'destructive',
        duration: 3000,
      })
      return
    }
    addToCart(product, 1)
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    })
  }
  
  return (
    <Link 
      href={`/product/${product.slug}`}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product image */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          style={{ 
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 300ms ease-in-out'
          }}
        />
        
        {/* Wishlist Button (only for logged-in users) */}
        <WishlistButton productId={product.id} />
        
        {isOnSale && (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
            -{discountPercentage}%
          </Badge>
        )}
        
        <div 
          className={`absolute inset-0 bg-black bg-opacity-0 ${isHovered ? 'bg-opacity-10' : ''} transition-opacity duration-300`}
        />
        
        <Button 
          variant="secondary"
          size="sm"
          className={`absolute right-2 bottom-2 opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity duration-300`}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
      
      {/* Product info */}
      <div className="p-4">
        <div className="flex items-center mb-1">
          <div className="flex items-center text-yellow-400 mr-2">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-gray-800 dark:text-gray-200 text-sm ml-1 font-medium">
              {(+product.rating).toFixed(1)}
            </span>
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {product.category.name}
          </span>
        </div>
        
        <h3 className="font-medium text-gray-900 dark:text-white mb-1 truncate">
          {product.name}
        </h3>
        
        <div className="flex items-end">
          <span className="text-lg font-semibold">${(+product.price).toFixed(2)}</span>
          {isOnSale && product.originalPrice !== undefined && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
              ${(+product.originalPrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard