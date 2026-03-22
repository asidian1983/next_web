'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ExternalLink, ImageOff } from 'lucide-react'
import { useFavoriteDesigns, type Design } from '@/hooks/useDesigns'
import { useAuthStore } from '@/store/authStore'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function resolveImageUrl(url?: string): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  return `${API_URL}${url}`
}

function FavoriteCard({ design }: { design: Design }) {
  const imageUrl = resolveImageUrl(design.imageUrl)

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-black/40">
      <div className="relative aspect-square bg-gray-800 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={design.title ?? design.prompt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff className="h-10 w-10 text-gray-600" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
          <Link href={`/designs/${design.id}`}>
            <Button variant="secondary" size="sm" className="text-xs">
              <ExternalLink className="h-3.5 w-3.5" />
              View
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2">
        <p className="text-sm text-gray-200 font-medium line-clamp-2 leading-snug">
          {design.title ?? design.prompt}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-800/60 rounded-full px-2 py-0.5 capitalize">
            {design.style}
          </span>
          <span className="flex items-center gap-1 text-xs text-red-400">
            <Heart className="h-3 w-3 fill-red-400" />
            {design.likesCount}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function FavoritesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { data, isLoading, error } = useFavoriteDesigns()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const designs = data?.items ?? []
  const total = data?.total ?? 0

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 min-w-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-400 fill-red-400" />
              Favorites
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Designs you&apos;ve liked
            </p>
          </div>

          {!isLoading && !error && total > 0 && (
            <p className="text-xs text-gray-500 mb-4">{total} favorited design{total !== 1 ? 's' : ''}</p>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-24">
              <LoadingSpinner size="lg" label="Loading favorites..." />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <ImageOff className="h-12 w-12 text-red-400/50" />
              <p className="text-gray-400">Failed to load favorites</p>
            </div>
          )}

          {!isLoading && !error && designs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 flex items-center justify-center">
                <Heart className="h-10 w-10 text-red-400" />
              </div>
              <div className="text-center max-w-sm">
                <h3 className="text-xl font-semibold text-gray-200 mb-2">No favorites yet</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Like designs in the gallery or on design detail pages to save them here.
                </p>
              </div>
              <Link href="/gallery">
                <Button variant="primary" size="lg">
                  Browse Gallery
                </Button>
              </Link>
            </div>
          )}

          {designs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {designs.map((design) => (
                <FavoriteCard key={design.id} design={design} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
