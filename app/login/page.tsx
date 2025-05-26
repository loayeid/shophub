"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useUser } from '@/context/user-context'

// Type for PasswordInput props
interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
}

const PasswordInput = ({ label, value, onChange, showPassword, togglePasswordVisibility }: PasswordInputProps) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        required
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3"
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  </div>
)

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { refreshUser } = useUser()

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  // Register form state
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isRegisterLoading, setIsRegisterLoading] = useState(false)

  // Auto redirect if logged in
  useEffect(() => {
    // TODO: Implement your own authentication check here if needed
    // For now, this effect does nothing
    // Example: if (userIsAuthenticated()) { router.push('/') }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoginLoading(true)

    // Sanitize and trim input
    const trimmedEmail = loginEmail.trim()
    const trimmedPassword = loginPassword.trim()

    // Client-side validation
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      toast({ title: 'Invalid email format', variant: 'destructive' })
      setIsLoginLoading(false)
      return
    }
    if (trimmedPassword.length < 6) {
      toast({ title: 'Weak password', description: 'Use 6+ characters.', variant: 'destructive' })
      setIsLoginLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword })
      })
      const data = await res.json()
      setIsLoginLoading(false)
      if (data.success) {
        toast({ title: 'Logged in successfully', description: `Welcome back, ${data.user.name}!` })
        await refreshUser()
        router.push('/')
      } else {
        toast({ title: 'Login failed', description: data.message || 'Invalid credentials', variant: 'destructive' })
      }
    } catch (err) {
      setIsLoginLoading(false)
      toast({ title: 'Login error', description: 'Something went wrong. Please try again.', variant: 'destructive' })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords match
    if (registerPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure your passwords match.", variant: "destructive" })
      return
    }

    // Sanitize and trim input
    const trimmedName = registerName.trim()
    const trimmedEmail = registerEmail.trim()
    const trimmedPassword = registerPassword.trim()

    // Client-side validation
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      toast({ title: 'Invalid email format', variant: 'destructive' })
      return
    }
    if (trimmedPassword.length < 6) {
      toast({ title: 'Weak password', description: 'Use 6+ characters.', variant: 'destructive' })
      return
    }

    setIsRegisterLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, password: trimmedPassword })
      })
      const data = await res.json()
      setIsRegisterLoading(false)
      if (!res.ok) {
        toast({ title: 'Registration failed', description: data?.message || 'Could not register', variant: 'destructive' })
        return
      }
      if (data.success) {
        toast({ title: 'Registration successful', description: 'Your account has been created. You can now log in.' })
        router.push('/login')
      } else {
        toast({ title: 'Registration failed', description: data.message || 'Could not register', variant: 'destructive' })
      }
    } catch (err) {
      setIsRegisterLoading(false)
      toast({ title: 'Registration error', description: 'Something went wrong. Please try again.', variant: 'destructive' })
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>Enter your email and password to access your account</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <PasswordInput
                  label="Password"
                  value={loginPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginPassword(e.target.value)}
                  showPassword={showLoginPassword}
                  togglePasswordVisibility={() => setShowLoginPassword(!showLoginPassword)}
                />
                <div className="text-right">
                  <Link href="/forgot-password" className="text-primary text-sm hover:underline">Forgot Password?</Link>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoginLoading}>
                  {isLoginLoading ? "Logging in..." : "Login"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Enter your details to create a new account</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={registerName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={registerEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <PasswordInput
                  label="Password"
                  value={registerPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterPassword(e.target.value)}
                  showPassword={showRegisterPassword}
                  togglePasswordVisibility={() => setShowRegisterPassword(!showRegisterPassword)}
                />
                <PasswordInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  showPassword={showConfirmPassword}
                  togglePasswordVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  By registering, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isRegisterLoading}>
                  {isRegisterLoading ? "Creating account..." : "Create account"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
