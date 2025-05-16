"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/context/user-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Product } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function AdminProductsPage() {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const canEdit = user && (user.role === "admin" || user.role === "manager");
  const [showAdd, setShowAdd] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting, errors }, getValues } = useForm();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        } else {
          toast({ title: "Error", description: "Failed to fetch products", variant: "destructive" });
        }
      } catch {
        toast({ title: "Error", description: "Failed to fetch products", variant: "destructive" });
      }
      setLoading(false);
    };
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data || []);
        }
      } catch {}
    };
    fetchProducts();
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setShowAdd(true);
  };

  const onAddSubmit = async (data: any) => {
    try {
      const res = await fetch("/api/admin/product/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
          stock: parseInt(data.stock, 10),
          images: data.images ? data.images.split(",").map((s: string) => s.trim()) : [],
          features: data.features ? data.features.split(",").map((s: string) => s.trim()) : [],
          specifications: {}, // You can extend this to support specifications
        })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setProducts(products => [
          {
            id: result.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            price: parseFloat(data.price),
            originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
            images: data.images ? data.images.split(",").map((s: string) => s.trim()) : [],
            category: { id: data.categoryId, name: data.categoryId, slug: data.categoryId }, // You may want to fetch category name
            rating: 0,
            stock: parseInt(data.stock, 10),
            features: data.features ? data.features.split(",").map((s: string) => s.trim()) : [],
            specifications: {},
            relatedProducts: [],
          },
          ...products
        ]);
        toast({ title: "Success", description: result.message || "Product added successfully" });
        setShowAdd(false);
        reset();
      } else {
        toast({ title: "Error", description: result.message || "Failed to add product", variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to add product", variant: "destructive" });
    }
  };

  const handleEdit = (id: string) => {
    // TODO: Show edit product modal/form
    toast({ title: "Edit Product", description: `Not implemented for ${id}` });
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(`/api/admin/product/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id })
    });
    if (res.ok) {
      setProducts(products => products.filter(p => p.id !== id));
      toast({ title: "Product deleted" });
    } else {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>
      {canEdit && (
        <Button className="mb-4" onClick={handleAdd}>Add Product</Button>
      )}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-4">
            <Input placeholder="Name" {...register("name", { required: "Name is required" })} />
            {errors.name && <div className="text-sm text-red-500">{typeof errors.name.message === 'string' ? errors.name.message : 'Invalid'}</div>}
            <Input placeholder="Slug" {...register("slug", { required: "Slug is required" })} />
            {errors.slug && <div className="text-sm text-red-500">{typeof errors.slug.message === 'string' ? errors.slug.message : 'Invalid'}</div>}
            <Input placeholder="Description" {...register("description", { required: "Description is required" })} />
            {errors.description && <div className="text-sm text-red-500">{typeof errors.description.message === 'string' ? errors.description.message : 'Invalid'}</div>}
            <Input placeholder="Price" type="number" step="0.01" {...register("price", { required: "Price is required", valueAsNumber: true, validate: v => v > 0 || "Price must be greater than 0" })} />
            {errors.price && <div className="text-sm text-red-500">{typeof errors.price.message === 'string' ? errors.price.message : 'Invalid'}</div>}
            <Input placeholder="Original Price" type="number" step="0.01" {...register("originalPrice", { valueAsNumber: true })} />
            <Input placeholder="Stock" type="number" {...register("stock", { required: "Stock is required", valueAsNumber: true, validate: v => v >= 0 || "Stock must be 0 or more" })} />
            {errors.stock && <div className="text-sm text-red-500">{typeof errors.stock.message === 'string' ? errors.stock.message : 'Invalid'}</div>}
            {/* Category dropdown */}
            <Select {...register("categoryId", { required: "Category is required" })} value={undefined} onValueChange={val => { reset({ ...getValues(), categoryId: val }); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <div className="text-sm text-red-500">{typeof errors.categoryId.message === 'string' ? errors.categoryId.message : 'Invalid'}</div>}
            <Input placeholder="Images (comma separated URLs)" {...register("images")} />
            <Input placeholder="Features (comma separated)" {...register("features")} />
            {/* You can add more fields for specifications, etc. */}
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>Add</Button>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Card className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Category</th>
              {canEdit && <th className="px-4 py-2 border">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={canEdit ? 6 : 5} className="text-center py-4">Loading...</td></tr>
            ) : products.length > 0 ? (
              products.map(product => (
                <tr key={product.id}>
                  <td className="px-4 py-2 border">{product.id}</td>
                  <td className="px-4 py-2 border">{product.name}</td>
                  <td className="px-4 py-2 border">${product.price}</td>
                  <td className="px-4 py-2 border">{product.stock}</td>
                  <td className="px-4 py-2 border">{product.category?.name || "-"}</td>
                  {canEdit && (
                    <td className="px-4 py-2 border">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(product.id)} className="mr-2">Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>Delete</Button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canEdit ? 6 : 5} className="text-center py-4">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
