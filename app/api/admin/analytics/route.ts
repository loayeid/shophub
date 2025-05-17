import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  // Total sales and total orders
  const salesResult = await query(
    'SELECT COUNT(*) as totalOrders, SUM(total) as totalSales FROM `order` WHERE status != "cancelled"'
  ) as { totalOrders: number; totalSales: number }[];
  const salesRow = salesResult[0] || { totalOrders: 0, totalSales: 0 };
  // Sales by month (last 12 months)
  const salesByMonth = await query(`
    SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total) as sales, COUNT(*) as orders
    FROM \`order\`
    WHERE status != "cancelled"
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12
  `);
  // Top 5 products by sales
  const topProducts = await query(`
    SELECT p.id, p.name, p.stock, SUM(oi.quantity) as totalSold, SUM(oi.price * oi.quantity) as totalRevenue
    FROM order_item oi
    JOIN products p ON oi.product_id = p.id
    JOIN \`order\` o ON oi.order_id = o.id
    WHERE o.status != "cancelled"
    GROUP BY p.id, p.name, p.stock
    ORDER BY totalRevenue DESC
    LIMIT 5
  `);
  // All products for inventory
  const allProducts = await query('SELECT id, name, stock FROM products ORDER BY name');
  // Recent reviews (with product and user name, and moderation status)
  const reviews = await query(`
    SELECT r.id, r.product_id, p.name as productName, u.name as userName, r.user_id, r.rating, r.title, r.content, r.helpful_count, r.created_at, r.status
    FROM reviews r
    JOIN products p ON r.product_id = p.id
    LEFT JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
    LIMIT 20
  `);
  // Audit logs (last 20) - only if table exists
  let auditLogs: any = [];
  try {
    const logs = await query('SELECT * FROM audit_logs ORDER BY date DESC LIMIT 20');
    auditLogs = Array.isArray(logs) ? logs : [];
  } catch (e) {
    auditLogs = [];
  }
  return NextResponse.json({
    totalOrders: salesRow.totalOrders || 0,
    totalSales: salesRow.totalSales || 0,
    salesByMonth: (salesByMonth as any[]).reverse(), // chronological order
    topProducts,
    allProducts,
    reviews,
    auditLogs,
  });
}
