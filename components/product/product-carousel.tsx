"use client"

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/product/product-card'
import { Product } from '@/types'

interface ProductCarouselProps {
  products: Product[]
}

const ProductCarousel = ({ products }: ProductCarouselProps) => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const updateMaxScroll = () => {
      if (carouselRef.current) {
        setMaxScroll(
          carouselRef.current.scrollWidth - carouselRef.current.clientWidth
        )
      }
    }
    
    // Update on initial render and window resize
    updateMaxScroll()
    window.addEventListener('resize', updateMaxScroll)
    
    return () => {
      window.removeEventListener('resize', updateMaxScroll)
    }
  }, [products])
  
  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return
    
    const scrollAmount = carouselRef.current.clientWidth * 0.8
    const newPosition = direction === 'left'
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(maxScroll, scrollPosition + scrollAmount)
    
    carouselRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    })
    
    setScrollPosition(newPosition)
  }
  
  const handleScroll = () => {
    if (carouselRef.current) {
      setScrollPosition(carouselRef.current.scrollLeft)
    }
  }
  
  return (
    <div className="relative">
      {/* Navigation buttons */}
      {scrollPosition > 0 && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white dark:bg-gray-950 shadow-md"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
      
      {scrollPosition < maxScroll && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white dark:bg-gray-950 shadow-md"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
      
      {/* Carousel container */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-6 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={handleScroll}
      >
        {products.map((product) => (
          <div 
            key={product.id} 
            className="min-w-[280px] sm:min-w-[320px] snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductCarousel