'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Heart } from 'lucide-react'
import { SkeletonCard } from './SkeletonCard'

interface PublicDesign {
  id: string
  prompt: string
  style: string
  imageUrl?: string
  likesCount: number
}

const MOCK_DESIGNS: PublicDesign[] = [
  { id: '1', prompt: 'Indigo batik with geometric sun motifs', style: 'geometric', likesCount: 284 },
  { id: '2', prompt: 'Vintage rose damask on cream silk', style: 'vintage', likesCount: 197 },
  { id: '3', prompt: 'Abstract watercolor botanical', style: 'abstract', likesCount: 341 },
  { id: '4', prompt: 'Minimal grid lines on ivory linen', style: 'minimal', likesCount: 156 },
  { id: '5', prompt: 'Modern herringbone in charcoal', style: 'modern', likesCount: 223 },
  { id: '6', prompt: 'Cherry blossom on pale blue silk', style: 'floral', likesCount: 408 },
  { id: '7', prompt: 'Art deco fan pattern in gold and black', style: 'vintage', likesCount: 175 },
  { id: '8', prompt: 'Tropical leaf print in emerald green', style: 'modern', likesCount: 319 },
]

const MOCK_GRADIENTS: Record<string, string> = {
  geometric: 'from-blue-600 via-indigo-500 to-purple-600',
  vintage: 'from-amber-600 via-yellow-500 to-orange-500',
  abstract: 'from-orange-500 via-rose-400 to-pink-500',
  minimal: 'from-gray-500 via-slate-400 to-zinc-400',
  modern: 'from-cyan-500 via-teal-400 to-emerald-500',
  floral: 'from-pink-500 via-rose-400 to-red-400',
}

const MOCK_PATTERNS: Record<string, string> = {
  geometric: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.07) 5px, rgba(255,255,255,0.07) 10px)',
  vintage: 'repeating-linear-gradient(30deg, transparent, transparent 4px, rgba(255,255,255,0.06) 4px, rgba(255,255,255,0.06) 8px)',
  abstract: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 60%)',
  minimal: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.05) 8px, rgba(255,255,255,0.05) 9px)',
  modern: 'repeating-linear-gradient(135deg, transparent, transparent 3px, rgba(255,255,255,0.07) 3px, rgba(255,255,255,0.07) 6px)',
  floral: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.15) 0%, transparent 50%)',
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export function TrendingSection() {
  const [designs, setDesigns] = useState<PublicDesign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchDesigns() {
      try {
        const res = await fetch(`${API_URL}/designs/public?limit=8`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error('Failed')
        const json = await res.json()
        const items: PublicDesign[] = json?.data?.items ?? json?.data ?? []
        setDesigns(items.length ? items.slice(0, 8) : MOCK_DESIGNS)
      } catch {
        setDesigns(MOCK_DESIGNS)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDesigns()
    return () => controller.abort()
  }, [])

  return (
    <section className="py-28 px-4 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-rose-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-sm text-rose-300 mb-4">
              <TrendingUp className="h-3.5 w-3.5" />
              Trending now
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
              Community{' '}
              <span className="bg-gradient-to-r from-textile-400 to-purple-400 bg-clip-text text-transparent">
                Creations
              </span>
            </h2>
          </div>
          <p className="text-gray-500 text-sm max-w-xs">
            Discover designs shared by creators from around the world
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : designs.map((design) => {
                const gradient = MOCK_GRADIENTS[design.style] ?? 'from-gray-600 to-gray-700'
                const pattern = MOCK_PATTERNS[design.style] ?? ''
                const imageUrl =
                  design.imageUrl?.startsWith('/uploads')
                    ? `${API_URL}${design.imageUrl}`
                    : design.imageUrl

                return (
                  <div
                    key={design.id}
                    className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer"
                  >
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={design.prompt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-105`}
                        style={{ backgroundImage: pattern }}
                      />
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
                      <p className="text-white text-xs font-medium line-clamp-2 mb-2 leading-snug">
                        {design.prompt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="capitalize text-xs text-gray-400 bg-white/10 rounded-md px-2 py-0.5">
                          {design.style}
                        </span>
                        <div className="flex items-center gap-1 text-rose-400">
                          <Heart className="h-3 w-3 fill-current" />
                          <span className="text-xs">{design.likesCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Always-visible like count */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1 opacity-70 group-hover:opacity-0 transition-opacity">
                      <Heart className="h-3 w-3 text-rose-400" />
                      <span className="text-xs text-white">{design.likesCount}</span>
                    </div>
                  </div>
                )
              })}
        </div>
      </div>
    </section>
  )
}
