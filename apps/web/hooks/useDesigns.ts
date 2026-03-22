'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface Design {
  id: string
  prompt: string
  title?: string
  style: string
  imageUrl?: string
  status: string
  tags: string[]
  source: string
  isPublic: boolean
  likesCount: number
  userId: string
  createdAt: string
}

export interface DesignFilters {
  search?: string
  style?: string
  tags?: string
  source?: string
  page?: number
  limit?: number
}

interface PaginatedDesigns {
  data: {
    items: Design[]
    total: number
    page: number
    limit: number
  }
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

interface UpdateDesignPayload {
  id: string
  title?: string
  tags?: string[]
  isPublic?: boolean
  style?: string
}

interface FavoriteResponse {
  data: {
    isFavorited: boolean
    likesCount: number
  }
}

export const designKeys = {
  all: ['designs'] as const,
  lists: () => [...designKeys.all, 'list'] as const,
  list: (filters: DesignFilters) => [...designKeys.lists(), filters] as const,
  detail: (id: string) => [...designKeys.all, 'detail', id] as const,
  job: (jobId: string) => [...designKeys.all, 'job', jobId] as const,
  public: (filters: DesignFilters) => [...designKeys.all, 'public', filters] as const,
  favorites: () => [...designKeys.all, 'favorites'] as const,
}

export function useDesigns(filters: DesignFilters = {}) {
  return useQuery({
    queryKey: designKeys.list(filters),
    queryFn: async (): Promise<DesignsResponse> => {
      const params = new URLSearchParams()
      if (filters.search) params.set('search', filters.search)
      if (filters.style) params.set('style', filters.style)
      if (filters.tags) params.set('tags', filters.tags)
      if (filters.source) params.set('source', filters.source)
      if (filters.page) params.set('page', String(filters.page))
      if (filters.limit) params.set('limit', String(filters.limit))
      const query = params.toString()
      const { data } = await api.get<DesignsResponse>(`/designs${query ? `?${query}` : ''}`)
      return data
    },
  })
}

export function usePublicDesigns(filters: DesignFilters = {}) {
  return useQuery({
    queryKey: designKeys.public(filters),
    queryFn: async (): Promise<PaginatedDesigns['data']> => {
      const params = new URLSearchParams()
      params.set('page', String(filters.page ?? 1))
      params.set('limit', String(filters.limit ?? 20))
      if (filters.search) params.set('search', filters.search)
      if (filters.style) params.set('style', filters.style)
      const { data } = await api.get<PaginatedDesigns>(`/designs/public?${params.toString()}`)
      return data.data
    },
  })
}

export function useFavoriteDesigns() {
  return useQuery({
    queryKey: designKeys.favorites(),
    queryFn: async (): Promise<PaginatedDesigns['data']> => {
      const { data } = await api.get<PaginatedDesigns>('/designs/favorites')
      return data.data
    },
  })
}

export function useDesign(id: string) {
  return useQuery({
    queryKey: designKeys.detail(id),
    queryFn: async (): Promise<Design> => {
      const { data } = await api.get<{ data: Design }>(`/designs/${id}`)
      return data.data
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

export function useUpdateDesign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateDesignPayload): Promise<Design> => {
      const { data } = await api.patch<{ data: Design }>(`/designs/${id}`, payload)
      return data.data
    },
    onSuccess: (design) => {
      queryClient.invalidateQueries({ queryKey: designKeys.lists() })
      queryClient.invalidateQueries({ queryKey: designKeys.detail(design.id) })
    },
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<FavoriteResponse['data']> => {
      const { data } = await api.post<FavoriteResponse>(`/designs/${id}/favorite`)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: designKeys.lists() })
      queryClient.invalidateQueries({ queryKey: designKeys.favorites() })
    },
  })
}
