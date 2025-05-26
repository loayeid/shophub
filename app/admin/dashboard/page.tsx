"use client";
import { useEffect, useState, useRef } from "react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { StaffUser } from '@/types';

export default function AdminDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'manager' });

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    images: "",
    categoryId: "",
    stock: "",
    specifications: ""
  });
  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    image: "",
    description: ""
  });

  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [searchProduct, setSearchProduct] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean, type: "product"|"category"|null, id: string|null }>({ open: false, type: null, id: null });

  // Pagination state
  const [productPage, setProductPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const itemsPerPage = 8;
  const [editProductId, setEditProductId] = useState<string|null>(null);
  const [editCategoryId, setEditCategoryId] = useState<string|null>(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/unauthorized");
      return;
    }
    fetchData();
    // eslint-disable-next-line
  }, [user]);

  async function fetchData() {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/categories")
    ]);
    const prodData = await prodRes.json();
    const catData = await catRes.json();
    setProducts(Array.isArray(prodData) ? prodData : prodData.products || []);
    setCategories(Array.isArray(catData) ? catData : catData.categories || []);
    setLoading(false);
  }

  useEffect(() => {
    fetch('/api/admin/staff')
      .then(res => res.json())
      .then(data => { setStaff(data.staff || []); setStaffLoading(false); });
  }, []);

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/product/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
          images: productForm.images.split(",").map((img) => img.trim()),
          specifications: productForm.specifications ? JSON.parse(productForm.specifications) : {}
        })
      });
      if (res.ok) {
        toast({ title: "Product added" });
        setProductForm({ name: "", slug: "", description: "", price: "", originalPrice: "", images: "", categoryId: "", stock: "", specifications: "" });
        fetchData();
      } else {
        toast({ title: "Error", description: "Failed to add product", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Invalid product data", variant: "destructive" });
    }
  }

  async function handleRemoveProduct(id: string) {
    const res = await fetch("/api/admin/product/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    if (res.ok) {
      toast({ title: "Product removed" });
      fetchData();
    } else {
      toast({ title: "Error", description: "Failed to remove product", variant: "destructive" });
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/category/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryForm)
    });
    if (res.ok) {
      toast({ title: "Category added" });
      setCategoryForm({ name: "", slug: "", image: "", description: "" });
      fetchData();
    } else {
      toast({ title: "Error", description: "Failed to add category", variant: "destructive" });
    }
  }

  async function handleRemoveCategory(id: string) {
    const res = await fetch("/api/admin/category/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    if (res.ok) {
      toast({ title: "Category removed" });
      fetchData();
    } else {
      toast({ title: "Error", description: "Failed to remove category", variant: "destructive" });
    }
  }

  async function handleInviteStaff(e: React.FormEvent) {
    e.preventDefault();
    setStaffLoading(true);
    const res = await fetch('/api/admin/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inviteForm)
    });
    if (res.ok) {
      setInviteForm({ name: '', email: '', role: 'manager' });
      const { staff: newStaff } = await res.json();
      setStaff(s => [...s, newStaff]);
      toast({ title: 'Staff invited' });
    } else {
      toast({ title: 'Error', description: 'Failed to invite staff', variant: 'destructive' });
    }
    setStaffLoading(false);
  }

  async function handleRoleChange(userId: string, role: 'admin'|'manager') {
    setStaffLoading(true);
    const res = await fetch('/api/admin/staff', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role })
    });
    if (res.ok) {
      setStaff(s => s.map(u => u.id === userId ? { ...u, role } : u));
      toast({ title: 'Role updated' });
    } else {
      toast({ title: 'Error', description: 'Failed to update role', variant: 'destructive' });
    }
    setStaffLoading(false);
  }

  async function handleRemoveStaff(userId: string) {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    setStaffLoading(true);
    const res = await fetch('/api/admin/staff', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    if (res.ok) {
      setStaff(s => s.filter(u => u.id !== userId));
      toast({ title: 'Staff removed' });
    } else {
      toast({ title: 'Error', description: 'Failed to remove staff', variant: 'destructive' });
    }
    setStaffLoading(false);
  }

  // Filtered lists
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase()));
  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchCategory.toLowerCase()));
  // Pagination logic
  const paginatedProducts = filteredProducts.slice((productPage-1)*itemsPerPage, productPage*itemsPerPage);
  const paginatedCategories = filteredCategories.slice((categoryPage-1)*itemsPerPage, categoryPage*itemsPerPage);
  const totalProductPages = Math.ceil(filteredProducts.length/itemsPerPage) || 1;
  const totalCategoryPages = Math.ceil(filteredCategories.length/itemsPerPage) || 1;

  // Edit handlers
  function startEditProduct(id: string) {
    setEditProductId(id);
    const prod = products.find(p => p.id === id);
    if (prod) setProductForm({
      name: prod.name,
      slug: prod.slug,
      description: prod.description,
      price: prod.price.toString(),
      originalPrice: prod.originalPrice?.toString() || "",
      images: prod.images?.join ? prod.images.join(",") : "",
      categoryId: prod.category?.id || prod.categoryId || "",
      stock: prod.stock?.toString() || "",
      specifications: prod.specifications ? JSON.stringify(prod.specifications) : ""
    });
    setShowProductForm(true);
  }
  function cancelEditProduct() {
    setEditProductId(null);
    setProductForm({ name: "", slug: "", description: "", price: "", originalPrice: "", images: "", categoryId: "", stock: "", specifications: "" });
  }
  async function handleEditProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editProductId) return;
    try {
      const res = await fetch("/api/admin/product/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editProductId,
          ...productForm,
          price: parseFloat(productForm.price),
          originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
          images: productForm.images.split(",").map((img) => img.trim()),
          specifications: productForm.specifications ? JSON.parse(productForm.specifications) : {}
        })
      });
      if (res.ok) {
        toast({ title: "Product updated" });
        cancelEditProduct();
        fetchData();
      } else {
        toast({ title: "Error", description: "Failed to update product", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Invalid product data", variant: "destructive" });
    }
  }
  function startEditCategory(id: string) {
    setEditCategoryId(id);
    const cat = categories.find(c => c.id === id);
    if (cat) setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      image: cat.image || "",
      description: cat.description || ""
    });
    setShowCategoryForm(true);
  }
  function cancelEditCategory() {
    setEditCategoryId(null);
    setCategoryForm({ name: "", slug: "", image: "", description: "" });
  }
  async function handleEditCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!editCategoryId) return;
    // TODO: Implement /api/admin/category/edit endpoint
    toast({ title: "Edit API not implemented", description: "You need to create /api/admin/category/edit" });
    cancelEditCategory();
  }
  // Confirmation dialog handlers
  function openConfirm(type: "product"|"category", id: string) {
    setConfirmDialog({ open: true, type, id });
  }
  function closeConfirm() {
    setConfirmDialog({ open: false, type: null, id: null });
  }
  async function handleConfirmRemove() {
    if (confirmDialog.type === "product" && confirmDialog.id) {
      await handleRemoveProduct(confirmDialog.id);
    } else if (confirmDialog.type === "category" && confirmDialog.id) {
      await handleRemoveCategory(confirmDialog.id);
    }
    closeConfirm();
  }

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <div className="mb-6 flex gap-4">
        <Button onClick={() => router.push('/admin/dashboard/analytics')} variant="outline">View Analytics</Button>
        {/* You can add more quick links here */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Management */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Products</h2>
            <Button onClick={() => { setShowProductForm(v => !v); cancelEditProduct(); }} className="bg-primary text-white font-bold px-4 py-2 rounded shadow">{showProductForm ? (editProductId ? "Cancel Edit" : "Hide Add") : "Add Product"}</Button>
          </div>
          <div className="mb-4">
            <Input placeholder="Search products..." value={searchProduct} onChange={e => setSearchProduct(e.target.value)} />
          </div>
          {showProductForm && (
            <Card className="p-6 mb-6 animate-in fade-in zoom-in-95">
              <h3 className="text-lg font-semibold mb-2">{editProductId ? "Edit Product" : "Add Product"}</h3>
              <form onSubmit={editProductId ? handleEditProduct : handleAddProduct} className="space-y-2">
                <Input placeholder="Name" value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} required />
                <Input placeholder="Slug" value={productForm.slug} onChange={e => setProductForm(f => ({ ...f, slug: e.target.value }))} required />
                <Input placeholder="Description" value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} />
                <Input placeholder="Price" type="number" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} required />
                <Input placeholder="Original Price" type="number" value={productForm.originalPrice} onChange={e => setProductForm(f => ({ ...f, originalPrice: e.target.value }))} />
                <Input placeholder="Images (comma separated URLs)" value={productForm.images} onChange={e => setProductForm(f => ({ ...f, images: e.target.value }))} />
                <select className="w-full border rounded p-2" value={productForm.categoryId} onChange={e => setProductForm(f => ({ ...f, categoryId: e.target.value }))} required>
                  <option value="">Select Category</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <Input placeholder="Stock" type="number" value={productForm.stock} onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))} required />
                <div className="flex gap-2">
                  <Button type="submit">{editProductId ? "Save Changes" : "Add Product"}</Button>
                  {editProductId && <Button type="button" variant="outline" onClick={cancelEditProduct}>Cancel</Button>}
                </div>
              </form>
            </Card>
          )}
          <Card className="p-6">
            <ul className="space-y-2 max-h-[400px] overflow-y-auto">
              {paginatedProducts.length === 0 && <li className="text-gray-500">No products found.</li>}
              {paginatedProducts.map((p) => (
                <li key={p.id} className="flex justify-between items-center border-b py-2">
                  <span>{p.name}</span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => startEditProduct(p.id)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => openConfirm("product", p.id)}>Remove</Button>
                  </div>
                </li>
              ))}
            </ul>
            {/* Pagination controls */}
            <div className="flex justify-center gap-2 mt-4">
              <Button size="sm" disabled={productPage === 1} onClick={() => setProductPage(p => Math.max(1, p-1))}>Prev</Button>
              <span className="px-2">Page {productPage} of {totalProductPages}</span>
              <Button size="sm" disabled={productPage === totalProductPages} onClick={() => setProductPage(p => Math.min(totalProductPages, p+1))}>Next</Button>
            </div>
          </Card>
        </div>
        {/* Category Management */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Categories</h2>
            <Button onClick={() => { setShowCategoryForm(v => !v); cancelEditCategory(); }} className="bg-primary text-white font-bold px-4 py-2 rounded shadow">{showCategoryForm ? (editCategoryId ? "Cancel Edit" : "Hide Add") : "Add Category"}</Button>
          </div>
          <div className="mb-4">
            <Input placeholder="Search categories..." value={searchCategory} onChange={e => setSearchCategory(e.target.value)} />
          </div>
          {showCategoryForm && (
            <Card className="p-6 mb-6 animate-in fade-in zoom-in-95">
              <h3 className="text-lg font-semibold mb-2">{editCategoryId ? "Edit Category" : "Add Category"}</h3>
              <form onSubmit={editCategoryId ? handleEditCategory : handleAddCategory} className="space-y-2">
                <Input placeholder="Name" value={categoryForm.name} onChange={e => setCategoryForm(f => ({ ...f, name: e.target.value }))} required />
                <Input placeholder="Slug" value={categoryForm.slug} onChange={e => setCategoryForm(f => ({ ...f, slug: e.target.value }))} required />
                <Input placeholder="Image URL" value={categoryForm.image} onChange={e => setCategoryForm(f => ({ ...f, image: e.target.value }))} />
                <Input placeholder="Description" value={categoryForm.description} onChange={e => setCategoryForm(f => ({ ...f, description: e.target.value }))} />
                <div className="flex gap-2">
                  <Button type="submit">{editCategoryId ? "Save Changes" : "Add Category"}</Button>
                  {editCategoryId && <Button type="button" variant="outline" onClick={cancelEditCategory}>Cancel</Button>}
                </div>
              </form>
            </Card>
          )}
          <Card className="p-6">
            <ul className="space-y-2 max-h-[400px] overflow-y-auto">
              {paginatedCategories.length === 0 && <li className="text-gray-500">No categories found.</li>}
              {paginatedCategories.map((c) => (
                <li key={c.id} className="flex justify-between items-center border-b py-2">
                  <span>{c.name}</span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => startEditCategory(c.id)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => openConfirm("category", c.id)}>Remove</Button>
                  </div>
                </li>
              ))}
            </ul>
            {/* Pagination controls */}
            <div className="flex justify-center gap-2 mt-4">
              <Button size="sm" disabled={categoryPage === 1} onClick={() => setCategoryPage(p => Math.max(1, p-1))}>Prev</Button>
              <span className="px-2">Page {categoryPage} of {totalCategoryPages}</span>
              <Button size="sm" disabled={categoryPage === totalCategoryPages} onClick={() => setCategoryPage(p => Math.min(totalCategoryPages, p+1))}>Next</Button>
            </div>
          </Card>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Staff & Manager Control</h2>
        <Card className="p-6 mb-6">
          <form className="flex flex-wrap gap-2 items-end" onSubmit={handleInviteStaff}>
            <Input required placeholder="Name" value={inviteForm.name} onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))} />
            <Input required type="email" placeholder="Email" value={inviteForm.email} onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))} />
            <select className="border rounded px-2 py-1" value={inviteForm.role} onChange={e => setInviteForm(f => ({ ...f, role: e.target.value as 'admin'|'manager' }))}>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <Button type="submit">Invite Staff</Button>
          </form>
        </Card>
        <Card className="p-6">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffLoading ? (
                <tr><td colSpan={4} className="text-center py-4">Loading...</td></tr>
              ) : staff.length ? (
                staff.map(u => (
                  <tr key={u.id}>
                    <td className="px-4 py-2 border">{u.name}</td>
                    <td className="px-4 py-2 border">{u.email}</td>
                    <td className="px-4 py-2 border">
                      <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value as 'admin'|'manager')} className="border rounded px-2 py-1">
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 border">
                      {u.role === 'manager' ? (
                        <Button size="sm" variant="destructive" onClick={() => handleRemoveStaff(u.id)}>Remove</Button>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="text-center py-4">No staff found</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={open => { if (!open) closeConfirm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              {confirmDialog.type === "product" ? "This will permanently remove the product." : "This will permanently remove the category."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeConfirm}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmRemove}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
