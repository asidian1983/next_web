'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { type Design } from '@/hooks/useDesigns'

export interface Collection {
  id: string
  name: string
  description?: string
  userId: string
  createdAt: string
  _count?: { designs: number }
}

export interface CollectionWithDesigns extends Collection {
  designs: Design[]
}

interface CollectionsResponse {
  data: {
    items: Collection[]
    total: number
  }
}

interface CollectionResponse {
  data: CollectionWithDesigns
}

interface CreateCollectionPayload {
  name: string
  description?: string
}

interface UpdateCollectionPayload {
  id: string
  name?: string
  description?: string
}

interface AddToCollectionPayload {
  collectionId: string
  designId: string
}

interface RemoveFromCollectionPayload {
  collectionId: string
  designId: string
}

export const collectionKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionKeys.all, 'list'] as const,
  detail: (id: string) => [...collectionKeys.all, 'detail', id] as const,
}

export function useCollections() {
  return useQuery({
    queryKey: collectionKeys.lists(),
    queryFn: async (): Promise<Collection[]> => {
      const { data } = await api.get<CollectionsResponse>('/collections')
      return data.data.items
    },
  })
}

export function useCollection(id: string) {
  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: async (): Promise<CollectionWithDesigns> => {
      const { data } = await api.get<CollectionResponse>(`/collections/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

export function useCreateCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateCollectionPayload): Promise<Collection> => {
      const { data } = await api.post<{ data: Collection }>('/collections', payload)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() })
    },
  })
}

export function useUpdateCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateCollectionPayload): Promise<Collection> => {
      const { data } = await api.patch<{ data: Collection }>(`/collections/${id}`, payload)
      return data.data
    },
    onSuccess: (collection) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(collection.id) })
    },
  })
}

export function useDeleteCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/collections/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() })
    },
  })
}

export function useAddToCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ collectionId, designId }: AddToCollectionPayload): Promise<void> => {
      await api.post(`/collections/${collectionId}/designs`, { designId })
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(variables.collectionId) })
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() })
    },
  })
}

export function useRemoveFromCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ collectionId, designId }: RemoveFromCollectionPayload): Promise<void> => {
      await api.delete(`/collections/${collectionId}/designs/${designId}`)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(variables.collectionId) })
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() })
    },
  })
}
