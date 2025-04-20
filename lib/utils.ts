import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number, 
  options: { 
    currency?: 'USD' | 'EUR' | 'GBP', 
    notation?: Intl.NumberFormatOptions['notation'] 
  } = {}
) {
  const { currency = 'USD', notation = 'standard' } = options;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(price);
}

export function truncate(str: string, length: number) {
  if (str.length <= length) {
    return str;
  }
  
  return `${str.slice(0, length)}...`;
}

export function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calculateDiscountPercentage(originalPrice: number, price: number) {
  if (originalPrice <= 0 || price <= 0 || originalPrice <= price) {
    return 0;
  }
  
  const discount = originalPrice - price;
  const percentage = (discount / originalPrice) * 100;
  
  // Round to the nearest integer
  return Math.round(percentage);
}

export function getRandomSubset<T>(array: T[], count: number): T[] {
  if (count >= array.length) {
    return [...array];
  }
  
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function parseImages(imageStr: string | null): string[] {
  return imageStr ? imageStr.split(',') : [];
}