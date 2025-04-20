"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, MapPin, CreditCard, User, LogOut, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

// Mock data
const mockUser = {
  id: 'user1',
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1600',
}

const mockOrders = [
  {
    id: 'ORD-12345',
    date: '2023-11-15',
    status: 'delivered',
    total: 329.97,
    items: [
      {
        id: '1',
        name: 'Wireless Noise-Cancelling Headphones',
        price: 299.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
    ],
  },
  {
    id: 'ORD-12346',
    date: '2023-10-28',
    status: 'shipped',
    total: 149.99,
    items: [
      {
        id: '3',
        name: 'Premium Leather Messenger Bag',
        price: 149.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/2996381/pexels-photo-2996381.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
    ],
  },
]

const mockAddresses = [
  {
    id: 'addr1',
    type: 'Home',
    name: 'Jane Smith',
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
    phone: '(555) 123-4567',
    isDefault: true,
  },
  {
    id: 'addr2',
    type: 'Work',
    name: 'Jane Smith',
    street: '456 Market Avenue',
    city: 'New York',
    state: 'NY',
    postalCode: '10002',
    country: 'United States',
    phone: '(555) 987-6543',
    isDefault: false,
  },
]

export default function AccountPage() {
  const { toast } = useToast()
  const [user, setUser] = useState(mockUser)
  const [orders] = useState(mockOrders)
  const [addresses] = useState(mockAddresses)
  const [isEditing, setIsEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  })
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setUser({
      ...user,
      name: formData.name,
      email: formData.email,
    })
    setIsEditing(false)
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="hidden md:block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3 mb-6">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
            
            <Separator className="mb-4" />
            
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="#profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="#orders">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Orders
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="#addresses">
                  <MapPin className="mr-2 h-4 w-4" />
                  Addresses
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="#payment-methods">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Link>
              </Button>
              <Separator className="my-2" />
              <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-4 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="payment" className="hidden md:inline-flex">Payment</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>
                    Manage your personal information and preferences
                  </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      
                      {!isEditing ? (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                          Change Avatar
                        </Button>
                      ) : (
                        <Input type="file" className="max-w-xs" />
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        ) : (
                          <p className="p-2 border rounded-md bg-gray-50 dark:bg-gray-900">{user.name}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        ) : (
                          <p className="p-2 border rounded-md bg-gray-50 dark:bg-gray-900">{user.email}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end space-x-4">
                    {isEditing ? (
                      <>
                        <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    )}
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Your Orders</CardTitle>
                  <CardDescription>
                    View and track your recent orders
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-50 dark:bg-gray-900 p-4 flex flex-wrap justify-between items-center gap-2">
                            <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Placed on {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="font-medium">${(+order.total).toFixed(2)}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                  {order.status}
                                </p>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/account/orders/${order.id}`}>
                                  View Order
                                </Link>
                              </Button>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-col sm:flex-row gap-4 items-center sm:items-start"
                              >
                                <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                  />
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Qty: {item.quantity} × ${(+item.price).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        You haven't placed any orders yet.
                      </p>
                      <Button asChild>
                        <Link href="/">Start Shopping</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your Addresses</CardTitle>
                    <CardDescription>
                      Manage your shipping and billing addresses
                    </CardDescription>
                  </div>
                  <Button size="sm">Add New Address</Button>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="border rounded-lg p-4 relative"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <span className="font-medium">{address.type}</span>
                            {address.isDefault && (
                              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                              Delete
                            </Button>
                          </div>
                        </div>
                        
                        <p className="font-medium">{address.name}</p>
                        <p>{address.street}</p>
                        <p>
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p>{address.country}</p>
                        <p className="mt-2">{address.phone}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Payment Methods Tab */}
            <TabsContent value="payment">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      Manage your saved payment methods
                    </CardDescription>
                  </div>
                  <Button size="sm">Add Payment Method</Button>
                </CardHeader>
                
                <CardContent className="py-8 text-center">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No payment methods saved</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                    You haven't saved any payment methods yet. Add a payment method to speed up checkout.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}