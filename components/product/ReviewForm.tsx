"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { useToast } from "@/hooks/use-toast"

interface ReviewFormProps {
  productId: string
  onReviewAdded: (review: any) => void
}

export default function ReviewForm({ productId, onReviewAdded }: ReviewFormProps) {
  const { user } = useUser()
  const { toast } = useToast()
  const [form, setForm] = useState({
    userName: user?.name || "",
    rating: "",
    title: "",
    content: ""
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.userName || !form.rating || !form.title || !form.content) {
      toast({ title: "All fields are required", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/review/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userId: user?.id,
          userName: form.userName,
          rating: form.rating,
          title: form.title,
          content: form.content
        })
      })
      let data = null
      try {
        data = await res.json()
      } catch {}
      if (res.ok && data?.success) {
        toast({ title: "Review submitted!" })
        onReviewAdded({
          id: data.id,
          productId,
          userId: user?.id,
          userName: form.userName,
          rating: Number(form.rating),
          title: form.title,
          content: form.content,
          date: new Date().toISOString()
        })
        setForm({ userName: user?.name || "", rating: "", title: "", content: "" })
      } else {
        toast({ title: "Error", description: data?.message || res.statusText || "Failed to submit review", variant: "destructive" })
      }
    } catch (err: any) {
      toast({ title: "Network error", description: err?.message || String(err), variant: "destructive" })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-gray-900 p-4 rounded border">
      <div>
        <label className="block font-medium mb-1">Your Name</label>
        <Input name="userName" value={form.userName} onChange={handleChange} required />
      </div>
      <div>
        <label className="block font-medium mb-1">Rating</label>
        <select name="rating" className="w-full border rounded p-2" value={form.rating} onChange={handleChange} required>
          <option value="">Select rating</option>
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Title</label>
        <Input name="title" value={form.title} onChange={handleChange} required />
      </div>
      <div>
        <label className="block font-medium mb-1">Review</label>
        <Textarea name="content" value={form.content} onChange={handleChange} rows={3} required />
      </div>
      <Button type="submit" className="bg-primary text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
