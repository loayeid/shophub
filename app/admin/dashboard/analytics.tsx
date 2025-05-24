"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface AnalyticsData {
  totalOrders: number;
  totalSales: number;
  salesByMonth: { month: string; sales: number; orders: number }[];
  topProducts: { id: string; name: string; totalSold: number; totalRevenue: number; stock?: number }[];
  allProducts: { id: string; name: string; stock?: number }[];
  reviews: { id: string; productName: string; userName: string; rating: number; text: string; status: string }[];
  auditLogs?: { id: string; userName: string; action: string; target: string; date: string }[];
}

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
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [discountLoading, setDiscountLoading] = useState(true);
  const [newDiscount, setNewDiscount] = useState<Partial<DiscountCode>>({ code: '', type: 'percentage', value: 0, active: true });

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          setData(await res.json());
        } else {
          toast({ title: "Error", description: "Failed to fetch analytics", variant: "destructive" });
        }
      } catch {
        toast({ title: "Error", description: "Failed to fetch analytics", variant: "destructive" });
      }
      setLoading(false);
    };
    fetchAnalytics();

    const fetchDiscounts = async () => {
      setDiscountLoading(true);
      try {
        const res = await fetch('/api/admin/discount');
        if (res.ok) {
          const { codes } = await res.json();
          setDiscountCodes(codes);
        }
      } finally {
        setDiscountLoading(false);
      }
    };
    fetchDiscounts();
  }, []);

  function handleReviewAction(id: string, status: 'approved' | 'rejected') {
    fetch('/api/admin/review/moderate', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    })
      .then(res => {
        if (res.ok) {
          toast({ title: `Review ${status}` });
          setData((prev: any) => prev && prev.reviews ? { ...prev, reviews: prev.reviews.map((r: any) => r.id === id ? { ...r, status } : r) } : prev);
        } else {
          toast({ title: 'Error', description: 'Failed to update review', variant: 'destructive' });
        }
      });
  }

  async function handleAddDiscount(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/discount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDiscount)
    });
    if (res.ok) {
      toast({ title: 'Discount code added' });
      setNewDiscount({ code: '', type: 'percentage', value: 0, active: true });
      const { codes } = await (await fetch('/api/admin/discount')).json();
      setDiscountCodes(codes);
    } else {
      toast({ title: 'Error', description: 'Failed to add discount', variant: 'destructive' });
    }
  }

  async function handleDeleteDiscount(id: string) {
    const res = await fetch('/api/admin/discount', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) {
      toast({ title: 'Discount code deleted' });
      setDiscountCodes(discountCodes.filter(d => d.id !== id));
    } else {
      toast({ title: 'Error', description: 'Failed to delete discount', variant: 'destructive' });
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sales Analytics</h1>
      <Card className="mb-6 p-6 flex gap-8">
        <div>
          <div className="text-lg font-semibold">Total Sales</div>
          <div className="text-2xl font-bold">${data?.totalSales?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '--'}</div>
        </div>
        <div>
          <div className="text-lg font-semibold">Total Orders</div>
          <div className="text-2xl font-bold">{data?.totalOrders ?? '--'}</div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="text-lg font-semibold mb-4">Sales by Month (last 12 months)</div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Month</th>
              <th className="px-4 py-2 border">Sales</th>
              <th className="px-4 py-2 border">Orders</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-4">Loading...</td></tr>
            ) : data?.salesByMonth?.length ? (
              data.salesByMonth.map((row) => (
                <tr key={row.month}>
                  <td className="px-4 py-2 border">{row.month}</td>
                  <td className="px-4 py-2 border">${row.sales?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-2 border">{row.orders}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3} className="text-center py-4">No data</td></tr>
            )}
          </tbody>
        </table>
      </Card>
      <Card className="p-6 mt-6">
        <div className="text-lg font-semibold mb-4">Top 5 Products by Sales</div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Product</th>
              <th className="px-4 py-2 border">Total Sold</th>
              <th className="px-4 py-2 border">Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-4">Loading...</td></tr>
            ) : data?.topProducts?.length ? (
              data.topProducts.map((row: any) => (
                <tr key={row.id}>
                  <td className="px-4 py-2 border">{row.name}</td>
                  <td className="px-4 py-2 border">{row.totalSold}</td>
                  <td className="px-4 py-2 border">${Number(row.totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3} className="text-center py-4">No data</td></tr>
            )}
          </tbody>
        </table>
      </Card>
      <Card className="p-6 mt-6">
        <div className="text-lg font-semibold mb-4">Inventory Management</div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Product</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Low Stock?</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-4">Loading...</td></tr>
            ) : data?.topProducts?.length ? (
              data.topProducts.map((row: any) => (
                <tr key={row.id} className={row.stock !== undefined && row.stock <= 5 ? 'bg-yellow-100' : ''}>
                  <td className="px-4 py-2 border">{row.name}</td>
                  <td className="px-4 py-2 border">{row.stock !== undefined ? row.stock : '--'}</td>
                  <td className="px-4 py-2 border">{row.stock !== undefined && row.stock <= 5 ? 'Low' : ''}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3} className="text-center py-4">No data</td></tr>
            )}
          </tbody>
        </table>
      </Card>
      <Card className="p-6 mt-6">
        <div className="text-lg font-semibold mb-4">Inventory Management (All Products)</div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Product</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Low Stock?</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-4">Loading...</td></tr>
            ) : data?.allProducts?.length ? (
              data.allProducts.map((row: any) => (
                <tr key={row.id} className={row.stock !== undefined && row.stock <= 5 ? 'bg-yellow-100' : ''}>
                  <td className="px-4 py-2 border">{row.name}</td>
                  <td className="px-4 py-2 border">{row.stock !== undefined ? row.stock : '--'}</td>
                  <td className="px-4 py-2 border">{row.stock !== undefined && row.stock <= 5 ? 'Low' : ''}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3} className="text-center py-4">No data</td></tr>
            )}
          </tbody>
        </table>
      </Card>
  <Card className="p-6 mt-6">
    <div className="text-lg font-semibold mb-4">Recent Product Reviews</div>
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Product</th>
          <th className="px-4 py-2 border">User</th>
          <th className="px-4 py-2 border">Rating</th>
          <th className="px-4 py-2 border">Review</th>
          <th className="px-4 py-2 border">Status</th>
          <th className="px-4 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
        ) : data?.reviews?.length ? (
          data.reviews.map((review: any) => (
            <tr key={review.id} className={review.status === 'pending' ? 'bg-yellow-100' : ''}>
              <td className="px-4 py-2 border">{review.productName}</td>
              <td className="px-4 py-2 border">{review.userName}</td>
              <td className="px-4 py-2 border">{review.rating}</td>
              <td className="px-4 py-2 border">{review.text}</td>
              <td className="px-4 py-2 border">{review.status}</td>
              <td className="px-4 py-2 border">
                {review.status === 'pending' ? (
                  <div>
                    <button className="text-green-600 hover:underline mr-2" onClick={() => handleReviewAction(review.id, 'approved')}>Approve</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleReviewAction(review.id, 'rejected')}>Reject</button>
                  </div>
                ) : null}
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan={6} className="text-center py-4">No data</td></tr>
        )}
      </tbody>
    </table>
  </Card>
      <Card className="p-6 mt-6">
        <div className="text-lg font-semibold mb-4">Access Audit Logs</div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">Action</th>
              <th className="px-4 py-2 border">Target</th>
              <th className="px-4 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-4">Loading...</td></tr>
            ) : data?.auditLogs?.length ? (
              data.auditLogs.map((log: any) => {
                return (
                  <tr key={log.id}>
                    <td className="px-4 py-2 border">{log.userName}</td>
                    <td className="px-4 py-2 border">{log.action}</td>
                    <td className="px-4 py-2 border">{log.target}</td>
                    <td className="px-4 py-2 border">{new Date(log.date).toLocaleString()}</td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={4} className="text-center py-4">No logs</td></tr>
            )}
          </tbody>
        </table>
      </Card>
      <Card className="p-6 mt-6">
        <div className="text-lg font-semibold mb-4">Discount Codes / Coupons</div>
        <form className="mb-4 flex flex-wrap gap-2 items-end" onSubmit={handleAddDiscount}>
          <input className="border px-2 py-1 rounded" required placeholder="Code" value={newDiscount.code} onChange={e => setNewDiscount({ ...newDiscount, code: e.target.value })} />
          <select className="border px-2 py-1 rounded" value={newDiscount.type} onChange={e => setNewDiscount({ ...newDiscount, type: e.target.value as 'percentage' | 'fixed' })}>
            <option value="percentage">%</option>
            <option value="fixed">$</option>
          </select>
          <input className="border px-2 py-1 rounded" required type="number" min="0" placeholder="Value" value={newDiscount.value} onChange={e => setNewDiscount({ ...newDiscount, value: Number(e.target.value) })} />
          <input className="border px-2 py-1 rounded" type="number" min="0" placeholder="Min Order" value={newDiscount.minOrder || ''} onChange={e => setNewDiscount({ ...newDiscount, minOrder: Number(e.target.value) })} />
          <input className="border px-2 py-1 rounded" type="number" min="0" placeholder="Max Discount" value={newDiscount.maxDiscount || ''} onChange={e => setNewDiscount({ ...newDiscount, maxDiscount: Number(e.target.value) })} />
          <input className="border px-2 py-1 rounded" type="date" placeholder="Start" value={newDiscount.startDate || ''} onChange={e => setNewDiscount({ ...newDiscount, startDate: e.target.value })} />
          <input className="border px-2 py-1 rounded" type="date" placeholder="End" value={newDiscount.endDate || ''} onChange={e => setNewDiscount({ ...newDiscount, endDate: e.target.value })} />
          <input className="border px-2 py-1 rounded" type="number" min="0" placeholder="Usage Limit" value={newDiscount.usageLimit || ''} onChange={e => setNewDiscount({ ...newDiscount, usageLimit: Number(e.target.value) })} />
          <label className="flex items-center gap-1"><input type="checkbox" checked={!!newDiscount.active} onChange={e => setNewDiscount({ ...newDiscount, active: e.target.checked })} />Active</label>
          <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">Add</button>
        </form>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Code</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Value</th>
              <th className="px-4 py-2 border">Min Order</th>
              <th className="px-4 py-2 border">Max Discount</th>
              <th className="px-4 py-2 border">Start</th>
              <th className="px-4 py-2 border">End</th>
              <th className="px-4 py-2 border">Usage Limit</th>
              <th className="px-4 py-2 border">Active</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discountLoading ? (
              <tr><td colSpan={10} className="text-center py-4">Loading...</td></tr>
            ) : discountCodes.length ? (
              discountCodes.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-2 border">{d.code}</td>
                  <td className="px-4 py-2 border">{d.type}</td>
                  <td className="px-4 py-2 border">{d.value}</td>
                  <td className="px-4 py-2 border">{d.minOrder ?? ''}</td>
                  <td className="px-4 py-2 border">{d.maxDiscount ?? ''}</td>
                  <td className="px-4 py-2 border">{d.startDate ?? ''}</td>
                  <td className="px-4 py-2 border">{d.endDate ?? ''}</td>
                  <td className="px-4 py-2 border">{d.usageLimit ?? ''}</td>
                  <td className="px-4 py-2 border">{d.active ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 border"><button className="text-red-600 hover:underline" onClick={() => handleDeleteDiscount(d.id)}>Delete</button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={10} className="text-center py-4">No codes</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
