"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/context/user-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Order, OrderStatus } from "@/types";

const ORDER_STATUSES: OrderStatus[] = [
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded" // allow for refunded status
];

export default function AdminOrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const canEdit = user && (user.role === "admin" || user.role === "manager");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/order/list");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        } else {
          toast({ title: "Error", description: "Failed to fetch orders", variant: "destructive" });
        }
      } catch {
        toast({ title: "Error", description: "Failed to fetch orders", variant: "destructive" });
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    const res = await fetch("/api/admin/order/edit", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus })
    });
    if (res.ok) {
      setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast({ title: "Order status updated" });
    } else {
      toast({ title: "Error", description: "Failed to update order", variant: "destructive" });
    }
    setUpdating(null);
  };

  const handleRefund = async (orderId: string) => {
    setUpdating(orderId);
    const res = await fetch("/api/admin/order/edit", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, refund: true })
    });
    if (res.ok) {
      setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status: "refunded" as OrderStatus } : o));
      toast({ title: "Order refunded" });
    } else {
      toast({ title: "Error", description: "Failed to refund order", variant: "destructive" });
    }
    setUpdating(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>
      <Card className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">User ID</th>
              <th className="px-4 py-2 border">Total</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Created At</th>
              {canEdit && <th className="px-4 py-2 border">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={canEdit ? 6 : 5} className="text-center py-4">Loading...</td></tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-2 border">{order.id}</td>
                  <td className="px-4 py-2 border">{order.userId}</td>
                  <td className="px-4 py-2 border">${order.total}</td>
                  <td className="px-4 py-2 border">
                    {canEdit ? (
                      <Select
                        value={order.status}
                        onValueChange={val => handleStatusChange(order.id, val as OrderStatus)}
                        disabled={updating === order.id || order.status === "refunded"}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map(status => (
                            <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      order.status
                    )}
                  </td>
                  <td className="px-4 py-2 border">{order.createdAt}</td>
                  {canEdit && (
                    <td className="px-4 py-2 border">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updating === order.id || order.status === "refunded"}
                        onClick={() => handleRefund(order.id)}
                      >
                        Refund
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canEdit ? 6 : 5} className="text-center py-4">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
