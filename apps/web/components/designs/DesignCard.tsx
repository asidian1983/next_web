'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ExternalLink, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { type Design } from '@/hooks/useDesigns'
import { useDeleteDesign } from '@/hooks/useDesigns'
import { Button } from '@/components/ui/Button'
import { cn, formatDate, getStatusColor } from '@/lib/utils'

interface DesignCardProps {
  design: Design
}

function StatusIcon({ status }: { status: Design['status'] }) {
  switch (status) {
    case 'done':
      return <CheckCircle className="h-3.5 w-3.5" />
    case 'processing':
      return <Loader2 className="h-3.5 w-3.5 animate-spin" />
    case 'pending':
      return <Clock className="h-3.5 w-3.5" />
    case 'failed':
      return <XCircle className="h-3.5 w-3.5" />
  }
}

export function DesignCard({ design }: DesignCardProps) {
  const deleteMutation = useDeleteDesign()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Delete this design?')) {
      await deleteMutation.mutateAsync(design.id)
    }
  }

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-black/40">
      {/* Image */}
      <div className="relative aspect-square bg-gray-800 overflow-hidden">
        {design.status === 'done' && design.imageUrl ? (
          <Image
            src={design.imageUrl}
            alt={design.prompt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4">
              {design.status === 'processing' || design.status === 'pending' ? (
                <>
                  <div className="h-10 w-10 rounded-full border-2 border-gray-700 border-t-fabric-500 animate-spin mx-auto mb-3" />
                  <p className="text-xs text-gray-500">
                    {design.status === 'processing' ? 'Generating...' : 'Queued...'}
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="h-10 w-10 text-red-500/50 mx-auto mb-3" />
                  <p className="text-xs text-gray-500">Generation failed</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
          <Link href={`/designs/${design.id}`}>
            <Button variant="secondary" size="sm" className="text-xs">
              <ExternalLink className="h-3.5 w-3.5" />
              View
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            isLoading={deleteMutation.isPending}
            className="text-xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-gray-200 font-medium line-clamp-2 leading-snug flex-1">
            {design.prompt}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
              getStatusColor(design.status)
            )}
          >
            <StatusIcon status={design.status} />
            {design.status.charAt(0).toUpperCase() + design.status.slice(1)}
          </span>
          <span className="text-xs text-gray-500 bg-gray-800/60 rounded-full px-2 py-0.5">
            {design.style}
          </span>
        </div>

        <p className="text-xs text-gray-600">{formatDate(design.createdAt)}</p>
      </div>
    </div>
  )
}
