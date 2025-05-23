'use server';

import { Product, Category, Review, DiscountCode } from '@/types'
import { query, queryOne } from './db'
import { parseImages } from './utils';

// Fetch all products from the database, with optional filters
export async function getProducts(filters: any = {}): Promise<Product[]> {
  let where: string[] = [];
  let params: any[] = [];
  if (filters.brand) {
    where.push('p.brand = ?');
    params.push(filters.brand);
  }
  if (filters.minPrice) {
    where.push('p.price >= ?');
    params.push(filters.minPrice);
  }
  if (filters.maxPrice) {
    where.push('p.price <= ?');
    params.push(filters.maxPrice);
  }
  if (filters.rating) {
    where.push('p.rating >= ?');
    params.push(filters.rating);
  }
  if (filters.shippingSpeed) {
    where.push('p.shipping_speed = ?');
    params.push(filters.shippingSpeed);
  }
  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const rows = await query(`
    SELECT p.*, c.id as categoryId, c.name as categoryName, c.slug as categorySlug, c.image as categoryImage, c.description as categoryDescription,
    GROUP_CONCAT(pi.url ORDER BY pi.position) AS images
    FROM products p
    JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    ${whereClause}
    GROUP BY p.id
  `, params);
  return (rows as any[]).map(row => ({
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price,
    images: row.images ? parseImages(row.images) : [],
    category: {
      id: String(row.categoryId),
      name: row.categoryName,
      slug: row.categorySlug,
      image: row.categoryImage,
      description: row.categoryDescription,
    },
    rating: row.rating,
    stock: row.stock,
    features: row.features ? JSON.parse(row.features) : [],
    specifications: row.specifications ? JSON.parse(row.specifications) : {},
    relatedProducts: row.related_products ? JSON.parse(row.related_products) : [],
  }));
}

// Fetch a single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await queryOne(`
    SELECT p.*, c.id as categoryId, c.name as categoryName, c.slug as categorySlug, c.image as categoryImage, c.description as categoryDescription,
    GROUP_CONCAT(pi.url ORDER BY pi.position) AS images
    FROM products p
    JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.slug = ?
    GROUP BY p.id
    LIMIT 1
  `, [slug]);
  if (!row) return null;
  return {
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price,
    images: row.images ? parseImages(row.images) : [],
    category: {
      id: String(row.categoryId),
      name: row.categoryName,
      slug: row.categorySlug,
      image: row.categoryImage,
      description: row.categoryDescription,
    },
    rating: row.rating,
    stock: row.stock,
    features: row.features ? JSON.parse(row.features) : [],
    specifications: row.specifications ? JSON.parse(row.specifications) : {},
    relatedProducts: row.related_products ? JSON.parse(row.related_products) : [],
  };
}

// Fetch products by category slug
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const rows = await query(`
    SELECT p.*, c.id as categoryId, c.name as categoryName, c.slug as categorySlug, c.image as categoryImage, c.description as categoryDescription,
    GROUP_CONCAT(pi.url ORDER BY pi.position) AS images
    FROM products p
    JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE c.slug = ?
    GROUP BY p.id
  `, [categorySlug]);
  return (rows as any[]).map(row => ({
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price,
    images: row.images ? parseImages(row.images) : [],
    category: {
      id: String(row.categoryId),
      name: row.categoryName,
      slug: row.categorySlug,
      image: row.categoryImage,
      description: row.categoryDescription,
    },
    rating: row.rating,
    stock: row.stock,
    features: row.features ? JSON.parse(row.features) : [],
    specifications: row.specifications ? JSON.parse(row.specifications) : {},
    relatedProducts: row.related_products ? JSON.parse(row.related_products) : [],
  }));
}

// Search products by query (name or description)
export async function searchProducts(queryStr: string): Promise<Product[]> {
  const q = `%${queryStr.toLowerCase()}%`;
  const rows = await query(`
    SELECT p.*, c.id as categoryId, c.name as categoryName, c.slug as categorySlug, c.image as categoryImage, c.description as categoryDescription,
    GROUP_CONCAT(pi.url ORDER BY pi.position) AS images
    FROM products p
    JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ?
    GROUP BY p.id
  `, [q, q]);
  return (rows as any[]).map(row => ({
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price,
    images: row.images ? parseImages(row.images) : [],
    category: {
      id: String(row.categoryId),
      name: row.categoryName,
      slug: row.categorySlug,
      image: row.categoryImage,
      description: row.categoryDescription,
    },
    rating: row.rating,
    stock: row.stock,
    features: row.features ? JSON.parse(row.features) : [],
    specifications: row.specifications ? JSON.parse(row.specifications) : {},
    relatedProducts: row.related_products ? JSON.parse(row.related_products) : [],
  }));
}

// Fetch all categories
export async function getCategories(): Promise<Category[]> {
  const rows = await query('SELECT * FROM categories');
  return (rows as any[]).map(row => ({
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    image: row.image,
    description: row.description,
  }));
}

// Fetch a single category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const row = await queryOne('SELECT * FROM categories WHERE slug = ? LIMIT 1', [slug]);
  if (!row) return null;
  return {
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    image: row.image,
    description: row.description,
  };
}

// Fetch reviews for a product
export async function getProductReviews(productId: string): Promise<Review[]> {
  const rows = await query('SELECT * FROM reviews WHERE product_id = ?', [productId]);
  return (rows as any[]).map(row => ({
    id: String(row.id),
    productId: String(row.product_id),
    userId: String(row.user_id),
    userName: row.user_name,
    rating: row.rating,
    title: row.title,
    content: row.content,
    date: row.date,
    helpful: row.helpful,
  }));
}

// Featured products (top rated)
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const rows = await query(`
    SELECT p.*, c.id as categoryId, c.name as categoryName, c.slug as categorySlug, c.image as categoryImage, c.description as categoryDescription,
    GROUP_CONCAT(pi.url ORDER BY pi.position) AS images
    FROM products p
    JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    GROUP BY p.id
    ORDER BY p.rating DESC
    LIMIT ?
  `, [limit]);
  
  return (rows as any[]).map(row => ({
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price,
    images: row.images ? parseImages(row.images) : [],
    category: {
      id: String(row.categoryId),
      name: row.categoryName,
      slug: row.categorySlug,
      image: row.categoryImage,
      description: row.categoryDescription,
    },
    rating: row.rating,
    stock: row.stock,
    features: row.features ? JSON.parse(row.features) : [],
    specifications: row.specifications ? JSON.parse(row.specifications) : {},
    relatedProducts: row.related_products ? JSON.parse(row.related_products) : [],
  }));
}

// Related products (same category, exclude current)
export async function getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
  // Get the category of the product
  const product = await queryOne('SELECT * FROM products WHERE id = ?', [productId]);
  if (!product) return [];
  const rows = await query(`
    SELECT p.*, c.id as categoryId, c.name as categoryName, c.slug as categorySlug, c.image as categoryImage, c.description as categoryDescription,
    GROUP_CONCAT(pi.url ORDER BY pi.position) AS images
    FROM products p
    JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.category_id = ? AND p.id != ?
    GROUP BY p.id
    LIMIT ?
  `, [product.category_id, productId, limit]);
  return (rows as any[]).map(row => ({
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price,
    images: row.images ? parseImages(row.images) : [],
    category: {
      id: String(row.categoryId),
      name: row.categoryName,
      slug: row.categorySlug,
      image: row.categoryImage,
      description: row.categoryDescription,
    },
    rating: row.rating,
    stock: row.stock,
    features: row.features ? JSON.parse(row.features) : [],
    specifications: row.specifications ? JSON.parse(row.specifications) : {},
    relatedProducts: row.related_products ? JSON.parse(row.related_products) : [],
  }));
}

// Deals (products with originalPrice, sorted by discount)
export async function getDeals(limit = 6): Promise<Product[]> {
  const rows = await query(`
    SELECT p.*, c.id as categoryId, c.name as categoryName, c.slug as categorySlug, c.image as categoryImage, c.description as categoryDescription,
    GROUP_CONCAT(pi.url ORDER BY pi.position) AS images
    FROM products p
    JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.original_price IS NOT NULL
    GROUP BY p.id
    ORDER BY (p.original_price - p.price) DESC
    LIMIT ?
  `, [limit]);
  return (rows as any[]).map(row => ({
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price,
    images: row.images ? parseImages(row.images) : [],
    category: {
      id: String(row.categoryId),
      name: row.categoryName,
      slug: row.categorySlug,
      image: row.categoryImage,
      description: row.categoryDescription,
    },
    rating: row.rating,
    stock: row.stock,
    features: row.features ? JSON.parse(row.features) : [],
    specifications: row.specifications ? JSON.parse(row.specifications) : {},
    relatedProducts: row.related_products ? JSON.parse(row.related_products) : [],
  }));
}

// Fetch active discount codes for display (e.g., on homepage)
export async function getActiveDiscountCodes(): Promise<DiscountCode[]> {
  const rows = await query('SELECT * FROM discounts WHERE active = 1 AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()) ORDER BY created_at DESC');
  return (rows as any[]).map((row: any) => ({
    id: row.id,
    code: row.code,
    type: row.type,
    value: row.value,
    minOrder: row.min_order,
    maxDiscount: row.max_discount,
    startDate: row.start_date,
    endDate: row.end_date,
    usageLimit: row.usage_limit,
    active: !!row.active,
    createdAt: row.created_at,
  }));
}