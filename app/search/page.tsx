"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter, Search as SearchIcon, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Product, Category } from '@/types'
import ProductCard from '@/components/product/product-card'
import { getCategories, searchProducts, getProducts } from '@/lib/api'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortOption, setSortOption] = useState('relevance')
  const [brands, setBrands] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)

  // Fetch brands from products
  useEffect(() => {
    if (products.length > 0) {
      const uniqueBrands = Array.from(new Set(products.map(p => (p as any).brand).filter(Boolean)))
      setBrands(uniqueBrands)
    }
  }, [products])

  // Fetch products and categories (with filters)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const categoryData = await getCategories()
        setCategories(categoryData)

        // Build query params for backend faceted search
        const params = new URLSearchParams()
        if (selectedBrands.length > 0) params.set('brand', selectedBrands[0]) // Only one brand for now
        if (priceRange[0] !== 0) params.set('minPrice', String(priceRange[0]))
        if (priceRange[1] !== 1000) params.set('maxPrice', String(priceRange[1]))
        if (selectedRating) params.set('rating', String(selectedRating))
        // TODO: Add shippingSpeed if needed
        let url = '/api/products'
        if (params.toString()) url += `?${params.toString()}`
        let productData: Product[]
        if (initialQuery) {
          // If searching, use searchProducts (client-side filter for now)
          productData = await searchProducts(initialQuery)
        } else {
          const res = await fetch(url)
          productData = await res.json()
        }
        setProducts(productData)
        if (productData.length > 0) {
          const prices = productData.map(p => p.price)
          const minPrice = Math.floor(Math.min(...prices))
          const maxPrice = Math.ceil(Math.max(...prices))
          setPriceRange([minPrice, maxPrice])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [initialQuery, selectedBrands, priceRange, selectedRating])

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    setLoading(true)
    try {
      const results = await searchProducts(query)
      setProducts(results)
    } catch (error) {
      console.error('Error searching products:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Brand filter toggle
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])
  }

  // Rating filter
  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating === selectedRating ? null : rating)
  }
  
  // Filter and sort products
  const filteredAndSortedProducts = products
    // Apply category filter
    .filter(product => 
      selectedCategories.length === 0 || selectedCategories.includes(product.category.id)
    )
    // Apply price filter
    .filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    // Restrict search to only products and categories
    .filter(product => {
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      const inProduct = product.name.toLowerCase().includes(q);
      const inCategory = product.category.name.toLowerCase().includes(q);
      return inProduct || inCategory;
    })
    // Apply sorting
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        default: // relevance, already sorted by API
          return 0
      }
    })
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">
          {initialQuery 
            ? `Search results for "${initialQuery}"`
            : "All Products"
          }
        </h1>
        
        <form onSubmit={handleSearch} className="flex max-w-lg">
          <Input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-r-none"
          />
          <Button type="submit" className="rounded-l-none">
            <SearchIcon className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="font-semibold text-lg mb-4">Filters</h2>
            
            <div className="space-y-6">
              {/* Category filter */}
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price range filter */}
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={1000}
                    step={5}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="mb-6"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">${priceRange[0]}</span>
                    <span className="text-sm">${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Brand filter */}
              <div>
                <h3 className="font-medium mb-3">Brand</h3>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <div key={brand} className="flex items-center">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => toggleBrand(brand)}
                      />
                      <label htmlFor={`brand-${brand}`} className="ml-2 text-sm font-medium leading-none">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating filter */}
              <div>
                <h3 className="font-medium mb-3">Rating</h3>
                <div className="flex gap-2">
                  {[5,4,3,2,1].map(rating => (
                    <Button
                      key={rating}
                      variant={selectedRating === rating ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleRatingChange(rating)}
                    >
                      {rating}★
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Filters */}
        <div className="lg:hidden mb-4 flex justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Narrow down your product search
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-4 space-y-6">
                {/* Category filter */}
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center">
                        <Checkbox
                          id={`mobile-category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <label
                          htmlFor={`mobile-category-${category.id}`}
                          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price range filter */}
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={priceRange}
                      min={0}
                      max={1000}
                      step={5}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-6"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">${priceRange[0]}</span>
                      <span className="text-sm">${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Brand filter */}
                <div>
                  <h3 className="font-medium mb-3">Brand</h3>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <div key={brand} className="flex items-center">
                        <Checkbox
                          id={`mobile-brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <label htmlFor={`mobile-brand-${brand}`} className="ml-2 text-sm font-medium leading-none">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating filter */}
                <div>
                  <h3 className="font-medium mb-3">Rating</h3>
                  <div className="flex gap-2">
                    {[5,4,3,2,1].map(rating => (
                      <Button
                        key={rating}
                        variant={selectedRating === rating ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleRatingChange(rating)}
                      >
                        {rating}★
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Select
            value={sortOption}
            onValueChange={setSortOption}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Product grid */}
        <div className="flex-1">
          <div className="hidden lg:flex justify-between items-center mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredAndSortedProducts.length} results
            </p>
            
            <Select
              value={sortOption}
              onValueChange={setSortOption}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading products...</p>
            </div>
          ) : filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No products or categories found.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategories([])
                  setPriceRange([0, 1000])
                  setSortOption('relevance')
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}