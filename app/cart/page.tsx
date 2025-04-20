"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/context/cart-context'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart()
  
  // Calculate tax and total
  const tax = subtotal * 0.08 // 8% tax rate
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + tax + shipping
  
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 mb-4 text-gray-400 dark:text-gray-600">
            <ShoppingCart className="w-16 h-16" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="relative w-full sm:w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <Link 
                          href={`/product/${item.slug}`}
                          className="text-lg font-semibold hover:text-primary transition-colors"
                        >
                          {item.name}
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-gray-500 hover:text-red-500 -mt-1 -mr-1"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {item.category.name}
                      </p>
                      
                      <div className="flex flex-wrap justify-between items-center">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="w-8 text-center">{item.quantity}</span>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right mt-2 sm:mt-0">
                          <p className="text-lg font-semibold">
                            ${((+item.price) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ${(+item.price).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6">
            <Button variant="outline" asChild className="flex items-center">
              <Link href="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                Review your order details before checkout
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${(+subtotal).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>${(+tax).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 dark:text-green-400">Free</span>
                    ) : (
                      `$${(+shipping).toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${(+total).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <p>• Free shipping on orders over $50</p>
            <p>• Estimated delivery: 2-5 business days</p>
            <p>• Secure payments with SSL encryption</p>
          </div>
        </div>
      </div>
    </div>
  )
}