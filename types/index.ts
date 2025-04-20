// Product Types
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: Category
  rating: number
  stock: number
  features?: string[]
  specifications?: Record<string, string>
  relatedProducts?: string[]
}

export interface Category {
  id: string
  name: string
  slug: string
  image?: string
  description?: string
}

// Review Types
export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title: string
  content: string
  date: string
  helpful: number
}

// User Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

// Order Types
export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: OrderStatus
  createdAt: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface Address {
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'