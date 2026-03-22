'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  FolderOpen,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  ImageOff,
  Images,
} from 'lucide-react'
import { useCollection, useUpdateCollection, useDeleteCollection, useRemoveFromCollection } from '@/hooks/useCollections'
import { useAuthStore } from '@/store/authStore'
import { type Design } from '@/hooks/useDesigns'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatDate } from '@/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function resolveImageUrl(url?: string): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  return `${API_URL}${url}`
}

interface EditCollectionModalProps {
  id: string
  name: string
  description?: string
  onClose: () => void
}

function EditCollectionModal({ id, name: initialName, description: initialDesc, onClose }: EditCollectionModalProps) {
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDesc ?? '')
  const updateMutation = useUpdateCollection()

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    await updateMutation.mutateAsync({
      id,
      name: name.trim(),
      description: description.trim() || undefined,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <Card variant="elevated" className="w-full max-w-md animate-slide-up">
        <CardHeader>
          <CardTitle>Edit Collection</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
            <Input
              label="Description"
              placeholder="Optional description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={updateMutation.isPending}
              disabled={!name.trim()}
            >
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

function CollectionDesignCard({ design, collectionId }: { design: Design; collectionId: string }) {
  const removeFromCollectionMutation = useRemoveFromCollection()
  const imageUrl = resolveImageUrl(design.imageUrl)

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Remove this design from the collection?')) {
      await removeFromCollectionMutation.mutateAsync({ collectionId, designId: design.id })
    }
  }

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
          <Button
            variant="danger"
            size="sm"
            onClick={handleRemove}
            isLoading={removeFromCollectionMutation.isPending}
            className="text-xs"
            aria-label="Remove from collection"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-1.5">
        <p className="text-sm text-gray-200 font-medium line-clamp-2 leading-snug">
          {design.title ?? design.prompt}
        </p>
        <span className="text-xs text-gray-500 bg-gray-800/60 rounded-full px-2 py-0.5 self-start capitalize">
          {design.style}
        </span>
      </div>
    </div>
  )
}

export default function CollectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const id = params.id as string

  const { data: collection, isLoading, error } = useCollection(id)
  const deleteMutation = useDeleteCollection()
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  // Only owner can view
  const isOwner = collection?.userId === user?.id

  const handleDelete = async () => {
    if (confirm('Delete this collection? Designs will not be deleted.')) {
      await deleteMutation.mutateAsync(id)
      router.push('/collections')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 min-w-0">
          <div className="mb-6">
            <Link href="/collections">
              <Button variant="ghost" size="sm" className="text-gray-400">
                <ArrowLeft className="h-4 w-4" />
                Back to Collections
              </Button>
            </Link>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-32">
              <LoadingSpinner size="lg" label="Loading collection..." />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <FolderOpen className="h-12 w-12 text-red-400/50" />
              <p className="text-gray-400">Failed to load collection</p>
              <Link href="/collections">
                <Button variant="secondary" size="sm">Go back</Button>
              </Link>
            </div>
          )}

          {collection && !isOwner && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <FolderOpen className="h-12 w-12 text-gray-600" />
              <p className="text-gray-400">You don&apos;t have access to this collection</p>
              <Link href="/collections">
                <Button variant="secondary" size="sm">Go back</Button>
              </Link>
            </div>
          )}

          {collection && isOwner && (
            <>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-fabric-500/20 to-textile-600/20 border border-fabric-500/20 shrink-0">
                    <FolderOpen className="h-6 w-6 text-fabric-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">{collection.name}</h1>
                    {collection.description && (
                      <p className="text-gray-400 text-sm mt-0.5">{collection.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Images className="h-3.5 w-3.5" />
                        {collection.designs.length} design{collection.designs.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-gray-600">{formatDate(collection.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowEdit(true)}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    isLoading={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Designs grid */}
              {collection.designs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-6">
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-fabric-500/20 to-textile-600/20 border border-fabric-500/30 flex items-center justify-center">
                    <Images className="h-10 w-10 text-fabric-400" />
                  </div>
                  <div className="text-center max-w-sm">
                    <h3 className="text-xl font-semibold text-gray-200 mb-2">No designs yet</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Add designs to this collection from the design detail page.
                    </p>
                  </div>
                  <Link href="/dashboard">
                    <Button variant="primary" size="lg">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {collection.designs.map((design) => (
                    <CollectionDesignCard
                      key={design.id}
                      design={design}
                      collectionId={collection.id}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {showEdit && collection && (
        <EditCollectionModal
          id={collection.id}
          name={collection.name}
          description={collection.description}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  )
}
