'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-fabric-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[300px] bg-textile-600/8 rounded-full blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-textile-500 to-fabric-600 shadow-lg shadow-fabric-900/40 group-hover:shadow-fabric-700/40 transition-shadow duration-300">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-2xl font-semibold bg-gradient-to-r from-textile-300 to-fabric-400 bg-clip-text text-transparent">
              TextileAI
            </span>
          </Link>
        </div>

        {/* Glass card */}
        <div className="relative overflow-hidden rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl shadow-2xl shadow-black/40">
          {/* Top shimmer line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          {/* Left accent */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-fabric-500/40 via-transparent to-transparent" />

          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-sm text-gray-400">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3"
                >
                  <p className="text-sm text-red-400">{errorMessage}</p>
                </motion.div>
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
          </div>
        </div>
      </motion.div>
    </div>
  )
}
