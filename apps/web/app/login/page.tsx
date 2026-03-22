'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
    } catch {
      // Error is handled by loginError from useAuth
    }
  }

  const errorMessage =
    loginError && 'response' in loginError
      ? (loginError as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Invalid credentials'
      : loginError
        ? 'Something went wrong. Please try again.'
        : null

  return (
    <div className="min-h-screen bg-gray-950 bg-grid flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-fabric-600/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-textile-500 to-fabric-600 shadow-lg shadow-fabric-900/40">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-2xl font-semibold bg-gradient-to-r from-textile-300 to-fabric-400 bg-clip-text text-transparent">
              TextileAI
            </span>
          </Link>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
              <p className="text-sm text-gray-400">Sign in to your account to continue</p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errorMessage && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                  <p className="text-sm text-red-400">{errorMessage}</p>
                </div>
              )}

              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register('password')}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoggingIn}
                className="w-full mt-2"
              >
                Sign in
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-fabric-400 hover:text-fabric-300 font-medium transition-colors"
              >
                Create one free
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
