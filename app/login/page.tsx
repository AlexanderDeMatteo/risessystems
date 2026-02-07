'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Dumbbell } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState<'gym' | 'admin'>('gym')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Simple demo validation
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    
    // Demo: redirect based on user type
    setLoading(true)
    setTimeout(() => {
      if (userType === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-lg p-3 neon-glow">
              <Dumbbell className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-wider">RISESYSTEM</h1>
          <p className="text-muted-foreground mt-2 uppercase text-xs tracking-widest">Gym Management Platform</p>
        </div>

        {/* Login card */}
        <Card className="card-cyber border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl tracking-wider uppercase">SIGN IN</CardTitle>
            <CardDescription className="uppercase text-xs tracking-widest">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label className="uppercase text-xs tracking-wider">User Type</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={userType === 'gym' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setUserType('gym')}
                  >
                    Gym Owner
                  </Button>
                  <Button
                    type="button"
                    variant={userType === 'admin' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setUserType('admin')}
                  >
                    Administrator
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="uppercase text-xs tracking-wider">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="border-border/50 focus:border-primary focus:shadow-[0_0_12px_rgba(163,230,53,0.2)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="uppercase text-xs tracking-wider">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="border-border/50 focus:border-primary focus:shadow-[0_0_12px_rgba(163,230,53,0.2)]"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary hover:underline font-semibold">
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          © 2026 RisesSystem. All rights reserved.
        </p>
      </div>
    </div>
  )
}
