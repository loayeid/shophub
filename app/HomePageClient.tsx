"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/product-card';
import ProductCarousel from '@/components/product/product-carousel';

interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  active: boolean;
  createdAt?: string;
}

interface HomePageProps {
  featuredProducts: any[];
  categories: any[];
  deals: any[];
  discountCodes: DiscountCode[];
}

export default function HomePage({ featuredProducts, categories, deals, discountCodes }: HomePageProps) {
  const [copied, setCopied] = useState<string | null>(null);
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="relative h-[600px] flex items-center">
        {/* Our Discount Button */}
        <div className="absolute top-6 right-6 z-20">
          <Button size="lg" variant="default" asChild>
            <Link href="#discount-section">Our Discount</Link>
          </Button>
        </div>
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Hero background"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        </div>
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Summer Sale Is Now Live
            </h1>
            <p className="text-xl mb-8">
              Discover amazing deals on your favorite products. Up to 40% off on select items.
            </p>
            <div className="flex space-x-4">
              <Button size="lg" asChild>
                <Link href="/category/electronics">Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Categories section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                href={`/category/${category.slug}`}
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg"
              >
                <div className="relative h-48">
                  <Image
                    src={category.image || "https://images.pexels.com/photos/5926377/pexels-photo-5926377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                    alt={category.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Featured products section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      {/* Deals section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Top Deals</h2>
          </div>
          <ProductCarousel products={deals} />
        </div>
      </section>
      {/* Discount Codes section */}
      <section id="discount-section" className="py-8 bg-yellow-50 dark:bg-yellow-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4 text-yellow-800 dark:text-yellow-200">Available Discount Codes</h2>
          {discountCodes.length === 0 ? (
            <div className="text-gray-600 dark:text-gray-300 text-center py-8 text-lg">
              No discount codes are available at the moment. Please check back later!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {discountCodes.map((code) => (
                <div key={code.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-yellow-200 dark:border-yellow-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-2xl text-yellow-700 dark:text-yellow-300 tracking-widest">{code.code}</span>
                    <Button
                      size="sm"
                      className="ml-2 px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-700"
                      onClick={() => {
                        navigator.clipboard.writeText(code.code);
                        setCopied(code.code);
                        setTimeout(() => setCopied(null), 1500);
                      }}
                    >
                      {copied === code.code ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <div className="text-lg font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
                    {code.type === 'percentage' ? `${code.value}% off` : `$${code.value} off`}
                  </div>
                  {code.minOrder !== undefined && code.minOrder !== null && (
                    <div className="text-xs text-gray-500 mb-1">Min order: ${code.minOrder}</div>
                  )}
                  {code.maxDiscount !== undefined && code.maxDiscount !== null && (
                    <div className="text-xs text-gray-500 mb-1">Max discount: ${code.maxDiscount}</div>
                  )}
                  {code.endDate && (
                    <div className="text-xs text-gray-500">Valid until: {new Date(code.endDate).toLocaleDateString()}</div>
                  )}
                  {code.usageLimit && (
                    <div className="text-xs text-gray-500">Usage limit: {code.usageLimit}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
