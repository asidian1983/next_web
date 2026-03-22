'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FolderOpen, Plus, Trash2, Images } from 'lucide-react'
import { useCollections, useCreateCollection, useDeleteCollection } from '@/hooks/useCollections'
import { useAuthStore } from '@/store/authStore'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatDate } from '@/lib/utils'

interface CreateModalProps {
  onClose: () => void
}

function CreateCollectionModal({ onClose }: CreateModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const createMutation = useCreateCollection()

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
    await createMutation.mutateAsync({ name: name.trim(), description: description.trim() || undefined })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <Card variant="elevated" className="w-full max-w-md animate-slide-up">
        <CardHeader>
          <CardTitle>New Collection</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              label="Name"
              placeholder="My favourite florals..."
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
              isLoading={createMutation.isPending}
              disabled={!name.trim()}
            >
              Create Collection
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function CollectionsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { data: collections, isLoading, error } = useCollections()
  const deleteMutation = useDeleteCollection()
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Delete this collection? Designs will not be deleted.')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 min-w-0">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <FolderOpen className="h-6 w-6 text-fabric-400" />
                Collections
              </h1>
              <p className="text-gray-400 mt-1 text-sm">
                Organise your designs into collections
              </p>
            </div>
            <Button variant="primary" size="md" onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4" />
              New Collection
            </Button>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-24">
              <LoadingSpinner size="lg" label="Loading collections..." />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <FolderOpen className="h-12 w-12 text-red-400/50" />
              <p className="text-gray-400">Failed to load collections</p>
            </div>
          )}

          {!isLoading && !error && (!collections || collections.length === 0) && (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-fabric-500/20 to-textile-600/20 border border-fabric-500/30 flex items-center justify-center">
                <FolderOpen className="h-10 w-10 text-fabric-400" />
              </div>
              <div className="text-center max-w-sm">
                <h3 className="text-xl font-semibold text-gray-200 mb-2">No collections yet</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Create a collection to group and organise your favourite designs.
                </p>
              </div>
              <Button variant="primary" size="lg" onClick={() => setShowCreate(true)}>
                <Plus className="h-5 w-5" />
                Create your first collection
              </Button>
            </div>
          )}

          {collections && collections.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((col) => (
                <Link key={col.id} href={`/collections/${col.id}`}>
                  <Card
                    variant="default"
                    className="hover:border-gray-600 transition-all duration-200 cursor-pointer group h-full"
                  >
                    <CardContent className="py-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fabric-500/20 to-textile-600/20 border border-fabric-500/20 shrink-0">
                          <FolderOpen className="h-5 w-5 text-fabric-400" />
                        </div>
                        <button
                          onClick={(e) => handleDelete(e, col.id)}
                          disabled={deleteMutation.isPending}
                          className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-800 transition-all"
                          aria-label="Delete collection"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <h3 className="text-base font-semibold text-gray-100 group-hover:text-white transition-colors line-clamp-1">
                        {col.name}
                      </h3>
                      {col.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{col.description}</p>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Images className="h-3.5 w-3.5" />
                          {col._count?.designs ?? 0} design{(col._count?.designs ?? 0) !== 1 ? 's' : ''}
                        </span>
                        <span className="text-xs text-gray-600">{formatDate(col.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>

      {showCreate && <CreateCollectionModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
