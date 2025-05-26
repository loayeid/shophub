"use client"

import { useState } from 'react'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { Product } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { useUser } from '@/context/user-context'

interface AddToCartButtonProps {
  product: Product
}

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { user } = useUser()
  
  const handleQuantityChange = (value: number) => {
    // Ensure quantity is between 1 and stock limit
    const newQuantity = Math.max(1, Math.min(product.stock, quantity + value))
    setQuantity(newQuantity)
  }
  
  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: 'You must log in to add items to your cart',
        description: 'Please log in to continue.',
        variant: 'destructive',
        duration: 3000,
      })
      return
    }
    addToCart(product, quantity)
    
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} has been added to your cart.`,
      duration: 3000,
    })
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity === 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <span className="w-12 text-center font-medium">{quantity}</span>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(1)}
          disabled={quantity === product.stock}
        >
          <Plus className="h-4 w-4" />
        </Button>
        
        <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
          {product.stock} available
        </span>
      </div>
      
      <Button 
        size="lg" 
        className="w-full"
        onClick={handleAddToCart}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
    </div>
  )
}

export default AddToCartButton