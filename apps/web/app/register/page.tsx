'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { register: registerUser, isRegistering, registerError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password })
    } catch {
      // Error is handled by registerError from useAuth
    }
  }

  const errorMessage =
    registerError && 'response' in registerError
      ? (registerError as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Registration failed'
      : registerError
        ? 'Something went wrong. Please try again.'
        : null

  return (
    <div className="min-h-screen bg-gray-950 bg-grid flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-fabric-600/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[200px] bg-textile-500/10 rounded-full blur-[80px]" />
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
              <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
              <p className="text-sm text-gray-400">Start designing with AI for free</p>
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
                label="Full name"
                type="text"
                placeholder="Jane Smith"
                autoComplete="name"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.name?.message}
                {...register('name')}
              />

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
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                helperText="Must contain uppercase letter and number"
                {...register('password')}
              />

              <Input
                label="Confirm password"
                type="password"
                placeholder="Repeat your password"
                autoComplete="new-password"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isRegistering}
                className="w-full mt-2"
              >
                Create account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-fabric-400 hover:text-fabric-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
