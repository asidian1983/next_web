'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Trash2,
  Calendar,
  Palette,
  ImageIcon,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Heart,
  Pencil,
  FolderPlus,
  Globe,
  Tag,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useDesign, useDeleteDesign, useToggleFavorite } from '@/hooks/useDesigns'
import { useCollections, useAddToCollection } from '@/hooks/useCollections'
import { DesignEditModal } from '@/components/designs/DesignEditModal'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn, formatDate, getStatusColor } from '@/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function resolveImageUrl(url?: string): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  return `${API_URL}${url}`
}

function StatusBadge({ status }: { status: string }) {
  const icons = {
    done: CheckCircle,
    failed: XCircle,
    pending: Clock,
    processing: Loader2,
  }
  const Icon = icons[status as keyof typeof icons] ?? Clock

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
        getStatusColor(status)
      )}
    >
      <Icon className={cn('h-4 w-4', status === 'processing' && 'animate-spin')} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default function DesignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const id = params.id as string

  const { data: design, isLoading, error } = useDesign(id)
  const deleteMutation = useDeleteDesign()
  const toggleFavoriteMutation = useToggleFavorite()
  const addToCollectionMutation = useAddToCollection()
  const { data: collections } = useCollections()

  const [showEditModal, setShowEditModal] = useState(false)
  const [showCollectionMenu, setShowCollectionMenu] = useState(false)
  const [likesCount, setLikesCount] = useState<number | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (design) {
      setLikesCount(design.likesCount)
    }
  }, [design])

  if (!isAuthenticated) return null

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this design? This action cannot be undone.')) {
      await deleteMutation.mutateAsync(id)
      router.push('/dashboard')
    }
  }

  const handleToggleFavorite = async () => {
    const result = await toggleFavoriteMutation.mutateAsync(id)
    setLikesCount(result.likesCount)
  }

  const handleAddToCollection = async (collectionId: string) => {
    await addToCollectionMutation.mutateAsync({ collectionId, designId: id })
    setShowCollectionMenu(false)
  }

  const imageUrl = resolveImageUrl(design?.imageUrl)

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 min-w-0">
          {/* Back navigation */}
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-400">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-32">
              <LoadingSpinner size="lg" label="Loading design..." />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <XCircle className="h-12 w-12 text-red-400/50" />
              <p className="text-gray-400">Failed to load design</p>
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">Go back</Button>
              </Link>
            </div>
          )}

          {design && (
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Image */}
              <div className="lg:col-span-3">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 shadow-2xl shadow-black/50">
                  {design.status === 'done' && imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={design.title ?? design.prompt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {design.status === 'processing' || design.status === 'pending' ? (
                        <div className="text-center">
                          <div className="h-16 w-16 rounded-full border-2 border-gray-700 border-t-fabric-500 animate-spin mx-auto mb-4" />
                          <p className="text-gray-400">Generating your design...</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <XCircle className="h-16 w-16 text-red-400/40 mx-auto mb-4" />
                          <p className="text-gray-400">Generation failed</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <StatusBadge status={design.status} />
                    {design.isPublic && (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-blue-400 bg-blue-400/10">
                        <Globe className="h-3 w-3" />
                        Public
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl font-semibold text-white leading-snug mb-1">
                    {design.title ?? design.prompt}
                  </h1>
                  {design.title && (
                    <p className="text-sm text-gray-400 line-clamp-3">{design.prompt}</p>
                  )}
                </div>

                {/* Tags */}
                {design.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <Tag className="h-3.5 w-3.5 text-gray-500 mt-0.5" />
                    {design.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-800 border border-gray-700 px-2 py-0.5 text-xs text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Likes */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleFavorite}
                    disabled={toggleFavoriteMutation.isPending}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium border border-gray-700 bg-gray-900/60 hover:border-red-500/50 hover:text-red-400 transition-colors disabled:opacity-50"
                    aria-label="Toggle favorite"
                  >
                    <Heart
                      className={cn(
                        'h-4 w-4 transition-colors',
                        toggleFavoriteMutation.isPending ? 'animate-pulse' : ''
                      )}
                    />
                    <span>{likesCount ?? design.likesCount}</span>
                  </button>
                </div>

                {/* Metadata */}
                <Card variant="default">
                  <CardContent className="py-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800">
                        <Palette className="h-4 w-4 text-fabric-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Style</p>
                        <p className="text-sm text-gray-200 font-medium capitalize">{design.style}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800">
                        <Calendar className="h-4 w-4 text-textile-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="text-sm text-gray-200 font-medium">{formatDate(design.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800">
                        <ImageIcon className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Design ID</p>
                        <p className="text-xs text-gray-200 font-mono">{design.id}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="space-y-3">
                  {design.status === 'done' && imageUrl && (
                    <a
                      href={imageUrl}
                      download={`textile-design-${design.id}.png`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="primary" size="lg" className="w-full">
                        <Download className="h-4 w-4" />
                        Download Design
                      </Button>
                    </a>
                  )}

                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setShowEditModal(true)}
                    className="w-full"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Design
                  </Button>

                  {/* Add to Collection */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setShowCollectionMenu((v) => !v)}
                      className="w-full"
                    >
                      <FolderPlus className="h-4 w-4" />
                      Add to Collection
                    </Button>

                    {showCollectionMenu && (
                      <div className="absolute bottom-full mb-2 left-0 right-0 z-20 rounded-xl border border-gray-700 bg-gray-900 shadow-xl shadow-black/40 overflow-hidden">
                        {!collections || collections.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-400">
                            No collections yet.{' '}
                            <Link href="/collections" className="text-fabric-400 hover:underline">
                              Create one
                            </Link>
                          </div>
                        ) : (
                          <ul>
                            {collections.map((col) => (
                              <li key={col.id}>
                                <button
                                  onClick={() => handleAddToCollection(col.id)}
                                  disabled={addToCollectionMutation.isPending}
                                  className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-800 transition-colors flex items-center justify-between disabled:opacity-50"
                                >
                                  <span>{col.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {col._count?.designs ?? 0}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  <Link href="/generate" className="block">
                    <Button variant="ghost" size="md" className="w-full">
                      <Palette className="h-4 w-4" />
                      Generate Similar
                    </Button>
                  </Link>

                  <Button
                    variant="danger"
                    size="md"
                    onClick={handleDelete}
                    isLoading={deleteMutation.isPending}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Design
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit modal */}
      {showEditModal && design && (
        <DesignEditModal
          design={design}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  )
}
