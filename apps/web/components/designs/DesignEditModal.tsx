'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { type Design, useUpdateDesign } from '@/hooks/useDesigns'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/Card'

const STYLES = [
  'realistic',
  'floral',
  'geometric',
  'abstract',
  'bohemian',
  'minimalist',
  'vintage',
  'tropical',
]

interface DesignEditModalProps {
  design: Design
  onClose: () => void
  onSaved?: (updated: Design) => void
}

export function DesignEditModal({ design, onClose, onSaved }: DesignEditModalProps) {
  const [title, setTitle] = useState(design.title ?? '')
  const [tagsInput, setTagsInput] = useState(design.tags.join(', '))
  const [isPublic, setIsPublic] = useState(design.isPublic)
  const [style, setStyle] = useState(design.style)

  const updateMutation = useUpdateDesign()

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSave = async () => {
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const updated = await updateMutation.mutateAsync({
      id: design.id,
      title: title.trim() || undefined,
      tags,
      isPublic,
      style,
    })
    onSaved?.(updated)
    onClose()
  }

  const selectClass =
    'w-full h-[42px] rounded-lg border border-gray-700 bg-gray-900/60 px-3 py-2 text-sm text-gray-100 transition-all duration-200 outline-none focus:ring-2 focus:ring-fabric-500/50 focus:border-fabric-500 hover:border-gray-600'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <Card variant="elevated" className="w-full max-w-md animate-slide-up">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit Design</CardTitle>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            label="Title"
            placeholder="Give this design a name..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            label="Tags"
            placeholder="floral, blue, cotton (comma-separated)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            helperText="Separate tags with commas"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className={selectClass}
              aria-label="Design style"
            >
              {STYLES.map((s) => (
                <option key={s} value={s} className="bg-gray-900 capitalize">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-200">Public design</p>
              <p className="text-xs text-gray-500 mt-0.5">Visible in the public gallery</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isPublic}
              onClick={() => setIsPublic((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-fabric-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                isPublic ? 'bg-fabric-600' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublic ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3 justify-end">
          <Button variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            isLoading={updateMutation.isPending}
          >
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
