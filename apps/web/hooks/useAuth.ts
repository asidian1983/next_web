'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuthStore, type User } from '@/store/authStore'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  email: string
  password: string
  name: string
}

interface AuthResponse {
  token: string
  user: User
}

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload): Promise<AuthResponse> => {
      const { data } = await api.post<AuthResponse>('/auth/login', payload)
      return data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      router.push('/dashboard')
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload): Promise<AuthResponse> => {
      const { data } = await api.post<AuthResponse>('/auth/register', payload)
      return data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      router.push('/dashboard')
    },
  })

  const logout = () => {
    clearAuth()
    queryClient.clear()
    router.push('/')
  }

  return {
    user,
    token,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    registerError: registerMutation.error,
    isRegistering: registerMutation.isPending,
    logout,
  }
}
