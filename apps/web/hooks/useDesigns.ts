'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface Design {
  id: string
  prompt: string
  style: string
  imageUrl: string
  status: 'pending' | 'processing' | 'done' | 'failed'
  createdAt: string
  userId: string
}

interface DesignsResponse {
  data: Design[]
  total: number
  page: number
}

interface GeneratePayload {
  prompt: string
  style: string
  width: number
  height: number
}

interface GenerateResponse {
  id: string
  status: string
  jobId: string
}

interface JobStatusResponse {
  status: string
  imageUrl?: string
}

export const designKeys = {
  all: ['designs'] as const,
  lists: () => [...designKeys.all, 'list'] as const,
  detail: (id: string) => [...designKeys.all, 'detail', id] as const,
  job: (jobId: string) => [...designKeys.all, 'job', jobId] as const,
}

export function useDesigns() {
  return useQuery({
    queryKey: designKeys.lists(),
    queryFn: async (): Promise<DesignsResponse> => {
      const { data } = await api.get<DesignsResponse>('/designs')
      return data
    },
  })
}

export function useDesign(id: string) {
  return useQuery({
    queryKey: designKeys.detail(id),
    queryFn: async (): Promise<Design> => {
      const { data } = await api.get<Design>(`/designs/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useJobStatus(jobId: string | null) {
  return useQuery({
    queryKey: designKeys.job(jobId ?? ''),
    queryFn: async (): Promise<JobStatusResponse> => {
      const { data } = await api.get<JobStatusResponse>(`/designs/job/${jobId}`)
      return data
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data
      if (data?.status === 'done' || data?.status === 'failed') return false
      return 2000
    },
  })
}

export function useGenerateDesign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: GeneratePayload): Promise<GenerateResponse> => {
      const { data } = await api.post<GenerateResponse>('/designs/generate', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: designKeys.lists() })
    },
  })
}

export function useDeleteDesign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/designs/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: designKeys.lists() })
    },
  })
}
