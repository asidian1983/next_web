'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { designKeys } from '@/hooks/useDesigns'

export interface GeneratePayload {
  prompt: string
  style: string
  width: number
  height: number
  seed?: number
}

export interface GenerateBatchPayload {
  prompts: Array<{
    prompt: string
    style: string
    width: number
    height: number
    seed?: number
  }>
}

export interface GenerateResult {
  id: string
  jobId: string
  status: string
}

export interface GenerateBatchResult {
  jobs: GenerateResult[]
}

export interface JobProgress {
  job_id: string
  status: 'pending' | 'processing' | 'done' | 'failed'
  progress: number
  image_url?: string
  enhanced_prompt?: string
  error?: string
}

interface TrackProgressCallbacks {
  onProgress: (progress: JobProgress) => void
  onComplete: (imageUrl: string) => void
  onError: (error: string) => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export function useGenerate() {
  const queryClient = useQueryClient()

  const generate = useMutation({
    mutationFn: async (payload: GeneratePayload): Promise<GenerateResult> => {
      const { data } = await api.post<{ data: GenerateResult }>('/designs/generate', payload)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: designKeys.lists() })
    },
  })

  const generateBatch = useMutation({
    mutationFn: async (payload: GenerateBatchPayload): Promise<GenerateBatchResult> => {
      const { data } = await api.post<{ data: GenerateBatchResult }>('/designs/generate/batch', payload)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: designKeys.lists() })
    },
  })

  const trackProgress = (jobId: string, callbacks: TrackProgressCallbacks): (() => void) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    let cancelled = false

    const run = async () => {
      try {
        const response = await fetch(`${API_URL}/designs/generate/${jobId}/stream`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })

        if (!response.ok || !response.body) {
          callbacks.onError(`Stream request failed: ${response.status}`)
          return
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (!cancelled) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const raw = line.slice(6).trim()
              if (!raw || raw === '[DONE]') continue
              try {
                const parsed: JobProgress = JSON.parse(raw)
                callbacks.onProgress(parsed)
                if (parsed.status === 'done') {
                  callbacks.onComplete(parsed.image_url ?? '')
                  return
                }
                if (parsed.status === 'failed') {
                  callbacks.onError(parsed.error ?? 'Generation failed')
                  return
                }
              } catch {
                // skip malformed lines
              }
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          callbacks.onError(err instanceof Error ? err.message : 'Stream error')
        }
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }

  return { generate, generateBatch, trackProgress }
}
