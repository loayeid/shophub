"use client";
import { useEffect, useState } from "react";

export default function DebugPanel() {
  const [user, setUser] = useState<any>(null);
  const [cookie, setCookie] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCookie(document.cookie);
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ marginTop: 32, padding: 16, background: "#f5f5f5", border: "1px solid #ccc", borderRadius: 8 }}>
      <div><b>Cookie:</b> <code>{cookie || "(none)"}</code></div>
      <div><b>User:</b> {loading ? "Loading..." : user ? JSON.stringify(user) : "(none)"}</div>
    </div>
  );
}
