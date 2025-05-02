'use client';
import React, { createContext, useContext, useState, useEffect } from 'react'

export interface AuthUser {
  id: string
  name: string
  email: string
}

interface UserContextType {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  loading: boolean
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        if (data.success) setUser(data.user)
        else setUser(null)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within a UserProvider')
  return ctx
}
