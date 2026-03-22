'use client'

import Link from 'next/link'
import { PlusCircle, ImageOff } from 'lucide-react'
import { useDesigns, type Design } from '@/hooks/useDesigns'
import { DesignCard } from './DesignCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'

interface DesignGridProps {
  designs?: Design[]
  isLoading?: boolean
  error?: unknown
}

export function DesignGrid({ designs: propDesigns, isLoading: propLoading, error: propError }: DesignGridProps) {
  const { data, isLoading: queryLoading, error: queryError } = useDesigns()

  const designs = propDesigns ?? data?.data ?? []
  const isLoading = propLoading ?? queryLoading
  const error = propError ?? queryError

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" label="Loading your designs..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <ImageOff className="h-8 w-8 text-red-400" />
        </div>
        <div className="text-center">
          <p className="text-gray-300 font-medium">Failed to load designs</p>
          <p className="text-sm text-gray-500 mt-1">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  if (designs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-textile-500/20 to-fabric-600/20 border border-fabric-500/30 flex items-center justify-center">
            <PlusCircle className="h-10 w-10 text-fabric-400" />
          </div>
          <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-textile-500/30 blur-sm" />
          <div className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full bg-fabric-500/30 blur-sm" />
        </div>
        <div className="text-center max-w-sm">
          <h3 className="text-xl font-semibold text-gray-200 mb-2">No designs yet</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Start creating beautiful textile patterns with AI. Your generated designs will appear here.
          </p>
        </div>
        <Link href="/generate">
          <Button variant="primary" size="lg">
            <PlusCircle className="h-5 w-5" />
            Generate your first design
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {designs.map((design) => (
        <DesignCard key={design.id} design={design} />
      ))}
    </div>
  )
}
