import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// Helper to ensure no undefined values are passed to SQL
function safe(val: any) {
  return val === undefined ? null : val;
}

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
        safe(userId),
        safe(userName),
        safe(userEmail),
        safe(paymentMethod),
        safe(cardLast4),
        safe(subtotal),
        safe(tax),
        safe(shipping),
        safe(total),
        safe(status),
        safe(createdAt),
        safe(shippingAddress?.firstName),
        safe(shippingAddress?.lastName),
        safe(shippingAddress?.addressLine1),
        safe(shippingAddress?.addressLine2),
        safe(shippingAddress?.city),
        safe(shippingAddress?.state),
        safe(shippingAddress?.postalCode),
        safe(shippingAddress?.country),
        safe(shippingAddress?.phone),
        safe(billingAddress?.firstName),
        safe(billingAddress?.lastName),
        safe(billingAddress?.addressLine1),
        safe(billingAddress?.addressLine2),
        safe(billingAddress?.city),
        safe(billingAddress?.state),
        safe(billingAddress?.postalCode),
        safe(billingAddress?.country),
        safe(billingAddress?.phone),
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
