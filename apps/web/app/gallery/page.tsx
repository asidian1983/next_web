'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ExternalLink, ImageOff } from 'lucide-react'
import { usePublicDesigns, useToggleFavorite, type Design } from '@/hooks/useDesigns'
import { useAuthStore } from '@/store/authStore'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { SearchFilter, type SearchFilterValues } from '@/components/designs/SearchFilter'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function resolveImageUrl(url?: string): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  return `${API_URL}${url}`
}

function PublicDesignCard({ design }: { design: Design }) {
  const { isAuthenticated } = useAuthStore()
  const toggleFavoriteMutation = useToggleFavorite()
  const [likes, setLikes] = useState(design.likesCount)
  const imageUrl = resolveImageUrl(design.imageUrl)

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) return
    const result = await toggleFavoriteMutation.mutateAsync(design.id)
    setLikes(result.likesCount)
  }

  return (
    <div className="group relative rounded-xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-black/40 break-inside-avoid mb-4">
      {imageUrl ? (
        <div className="relative w-full">
          <Image
            src={imageUrl}
            alt={design.title ?? design.prompt}
            width={400}
            height={400}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      ) : (
        <div className="aspect-square bg-gray-800 flex items-center justify-center">
          <ImageOff className="h-10 w-10 text-gray-600" />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
        <Link href={`/designs/${design.id}`}>
          <Button variant="secondary" size="sm" className="text-xs">
            <ExternalLink className="h-3.5 w-3.5" />
            View
          </Button>
        </Link>
        {isAuthenticated && (
          <button
            onClick={handleFavorite}
            disabled={toggleFavoriteMutation.isPending}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-gray-900/80 border border-gray-700 hover:border-red-500/50 hover:text-red-400 transition-colors disabled:opacity-50"
            aria-label="Like design"
          >
            <Heart className="h-3.5 w-3.5" />
            {likes}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm text-gray-200 font-medium line-clamp-2 leading-snug">
          {design.title ?? design.prompt}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500 bg-gray-800/60 rounded-full px-2 py-0.5 capitalize">
            {design.style}
          </span>
          <span className={cn('flex items-center gap-1 text-xs text-gray-500')}>
            <Heart className="h-3 w-3" />
            {likes}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function GalleryPage() {
  const [filters, setFilters] = useState<SearchFilterValues>({ search: '', style: '', source: '' })
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = usePublicDesigns({
    search: filters.search || undefined,
    style: filters.style || undefined,
    page,
    limit: 20,
  })

  const designs = data?.items ?? []
  const total = data?.total ?? 0
  const hasMore = designs.length < total

  const handleFilterChange = (newFilters: SearchFilterValues) => {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 min-w-0">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Public Gallery</h1>
            <p className="text-gray-400 mt-1 text-sm">
              Discover textile designs shared by the community
            </p>
          </div>

          {/* Filters */}
          <SearchFilter
            values={filters}
            onChange={handleFilterChange}
            showSource={false}
            className="mb-6"
          />

          {/* Results count */}
          {!isLoading && !error && (
            <p className="text-xs text-gray-500 mb-4">
              {total} design{total !== 1 ? 's' : ''} found
            </p>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-24">
              <LoadingSpinner size="lg" label="Loading gallery..." />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <ImageOff className="h-12 w-12 text-red-400/50" />
              <p className="text-gray-400">Failed to load gallery</p>
            </div>
          )}

          {!isLoading && !error && designs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <ImageOff className="h-12 w-12 text-gray-600" />
              <p className="text-gray-400">No public designs found</p>
              <p className="text-sm text-gray-600">Try a different search or style filter</p>
            </div>
          )}

          {/* Masonry grid */}
          {designs.length > 0 && (
            <>
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                {designs.map((design) => (
                  <PublicDesignCard key={design.id} design={design} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-400">Page {page}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasMore}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
