"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCart } from '@/context/cart-context'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@/context/user-context'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, setUser, loading, refreshUser } = useUser()
  const router = useRouter()
  const { cart } = useCart()
  
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
    router.push('/login')
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }
  
  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home & Kitchen', slug: 'home-kitchen' },
    { name: 'Books', slug: 'books' },
    { name: 'Beauty', slug: 'beauty' },
  ]
  
  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        isScrolled ? "bg-white/95 backdrop-blur shadow-sm dark:bg-gray-950/95" : "bg-transparent"
      )}
    >
      {/* Top bar */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6">
            <h1 className="text-2xl font-bold text-primary">ShopHub</h1>
          </Link>
          
          <div className="hidden md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-2">
                  Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.slug} asChild>
                    <Link href={`/category/${category.slug}`}>{category.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/ai" className="ml-4">
              <Button variant="ghost" className="px-2">
                Chatbot
              </Button>
            </Link>
            {user && user.role === "admin" && (
              <Link href="/admin/orders" className="ml-4">
                <Button variant="ghost" className="px-2">
                  Dashboard
                </Button>
              </Link>
            )}
            {user && user.role === "admin" && (
              <Link href="/admin/dashboard" className="ml-4">
                <Button variant="ghost" className="px-2 text-red-600 font-semibold">
                  Admin Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearch} className="flex w-full max-w-xl">
            <Input
              type="text"
              placeholder="Search products..."
              className="rounded-r-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="rounded-l-none">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
        
        <div className="flex items-center space-x-1">
          {loading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Avatar>
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user && (
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/account">My Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
          
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile search bar */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-2">
          <form onSubmit={handleSearch} className="flex w-full">
            <Input
              type="text"
              placeholder="Search products..."
              className="rounded-r-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="rounded-l-none">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <nav className="container mx-auto px-4 py-3">
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link 
                    href={`/category/${category.slug}`}
                    className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  href="/admin/ai"
                  className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  AI Tools
                </Link>
              </li>
              {user && user.role === "admin" && (
                <li>
                  <Link 
                    href="/admin/orders"
                    className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              {user && user.role === "admin" && (
                <li>
                  <Link 
                    href="/admin/dashboard"
                    className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-red-600 font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                </li>
              )}
              {user && (
                <li>
                  <Link 
                    href="/wishlist"
                    className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                </li>
              )}
              <li>
                <Link 
                  href="/account"
                  className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header