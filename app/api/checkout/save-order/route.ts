import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received order data:', body); // Debug log
    const {
      userId,
      userName,
      userEmail,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      cardLast4,
      subtotal,
      tax,
      shipping,
      total,
      status = 'processing',
    } = body;

    const orderId = uuidv4();
    const createdAt = new Date().toISOString();

    // Insert order
    await query(
      "INSERT INTO `order` (id, user_id, user_name, user_email, payment_method, card_last4, subtotal, tax, shipping, total, status, created_at, " +
      "shipping_first_name, shipping_last_name, shipping_address_line1, shipping_address_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country, shipping_phone, " +
      "billing_first_name, billing_last_name, billing_address_line1, billing_address_line2, billing_city, billing_state, billing_postal_code, billing_country, billing_phone) " +
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        orderId,
        userId,
        userName,
        userEmail,
        paymentMethod,
        cardLast4,
        subtotal,
        tax,
        shipping,
        total,
        status,
        createdAt,
        shippingAddress.firstName,
        shippingAddress.lastName,
        shippingAddress.addressLine1,
        shippingAddress.addressLine2 || '',
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.postalCode,
        shippingAddress.country,
        shippingAddress.phone,
        billingAddress.firstName,
        billingAddress.lastName,
        billingAddress.addressLine1,
        billingAddress.addressLine2 || '',
        billingAddress.city,
        billingAddress.state,
        billingAddress.postalCode,
        billingAddress.country,
        billingAddress.phone,
      ]
    );

    // Insert order items
    for (const item of items) {
      await query(
        `INSERT INTO order_item (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)` ,
        [orderId, item.productId, item.productName, item.quantity, item.price]
      );
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    console.error('Save order error:', error); // Debug log
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
