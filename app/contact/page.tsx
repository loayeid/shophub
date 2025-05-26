"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/user-context";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setIsLoading(false);
      if (res.ok && data.success) {
        setSent(true);
        toast({ title: "Message sent!", description: "We will get back to you soon." });
        setForm({ name: "", email: "", message: "" });
      } else {
        toast({ title: "Error", description: data.message || "Failed to send message.", variant: "destructive" });
      }
    } catch (err) {
      setIsLoading(false);
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Email: <a href="mailto:hupshob275@gmail.com" className="underline">hupshob275@gmail.com</a><br />
            Phone: <a href="tel:76700983" className="underline">76700983</a>
          </CardDescription>
        </CardHeader>
        {user ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required disabled={isLoading || sent} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required disabled={isLoading || sent} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" value={form.message} onChange={handleChange} rows={4} required disabled={isLoading || sent} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading || sent}>
                {isLoading ? "Sending..." : sent ? "Sent!" : "Send Message"}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded mb-4 text-center">
              You must <a href="/login" className="text-primary underline">log in</a> to send a message.
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
