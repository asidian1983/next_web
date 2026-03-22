'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface GenerationStats {
  total: number
  byStatus: Record<string, number>
  bySource: Record<string, number>
  thisMonth: number
}

interface StatsResponse {
  data: GenerationStats
}

export function useGenerationStats() {
  return useQuery({
    queryKey: ['design-stats'],
    queryFn: async (): Promise<GenerationStats> => {
      const { data } = await api.get<StatsResponse>('/designs/stats')
      return data.data
    },
  })
}
