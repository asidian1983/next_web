'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { designKeys } from '@/hooks/useDesigns'

export interface UploadedDesign {
  id: string
  title: string | null
  imageUrl: string
  tags: string[]
  status: string
  source: string
  createdAt: string
}

interface UploadPayload {
  file: File
  title?: string
}

interface UploadResponse {
  data: UploadedDesign
  message: string
}

export function useUpload() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (payload: UploadPayload): Promise<UploadedDesign> => {
      const formData = new FormData()
      formData.append('file', payload.file)
      if (payload.title) {
        formData.append('title', payload.title)
      }

      const { data } = await api.post<UploadResponse>('/designs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: designKeys.lists() })
    },
  })

  return {
    upload: mutation.mutateAsync,
    isUploading: mutation.isPending,
    uploadedDesign: mutation.data ?? null,
    error: mutation.error,
    reset: mutation.reset,
  }
}
