"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';

// Define the Order type
interface Order {
  id: string | number;
  userId?: string | number;
  user_id?: string | number;
  total: number;
  status: string;
  createdAt?: string;
  created_at?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const res = await fetch("/api/admin/order/list");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">User ID</th>
              <th className="px-4 py-2 border">Total</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-2 border">{order.id}</td>
                  <td className="px-4 py-2 border">{order.userId || order.user_id}</td>
                  <td className="px-4 py-2 border">${order.total}</td>
                  <td className="px-4 py-2 border">{order.status}</td>
                  <td className="px-4 py-2 border">{order.createdAt || order.created_at}</td>
                  <td className="px-4 py-2 border">
                    <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={!!selectedOrder} onOpenChange={open => { if (!open) setSelectedOrder(null); }}>
        {selectedOrder && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <div><b>Order ID:</b> {selectedOrder.id}</div>
              <div><b>User ID:</b> {selectedOrder.userId || selectedOrder.user_id}</div>
              <div><b>Status:</b> {selectedOrder.status}</div>
              <div><b>Total:</b> ${selectedOrder.total}</div>
              <div><b>Created At:</b> {selectedOrder.createdAt || selectedOrder.created_at}</div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
