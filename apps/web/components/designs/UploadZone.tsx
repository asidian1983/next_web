'use client'

import { useRef, useState, type DragEvent, type ChangeEvent } from 'react'
import Image from 'next/image'
import { Upload, ImageIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface Props {
  onFileSelect: (file: File) => void
  preview?: string | null
  isUploading?: boolean
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export function UploadZone({ onFileSelect, preview, isUploading = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const validate = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG, and WebP images are accepted.'
    }
    if (file.size > MAX_BYTES) {
      return 'File size must be 10 MB or less.'
    }
    return null
  }

  const handleFile = (file: File) => {
    const error = validate(file)
    if (error) {
      setValidationError(error)
      return
    }
    setValidationError(null)
    onFileSelect(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleClick = () => {
    if (!isUploading) inputRef.current?.click()
  }

  const handleClear = () => {
    setValidationError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={isUploading ? -1 : 0}
        aria-label="Upload image"
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200',
          'min-h-[280px] cursor-pointer select-none',
          isUploading && 'pointer-events-none opacity-70',
          isDragOver
            ? 'border-fabric-500 bg-fabric-500/10'
            : preview
            ? 'border-gray-700 bg-gray-900/30'
            : 'border-gray-700 bg-gray-900/30 hover:border-fabric-500/60 hover:bg-fabric-500/5'
        )}
      >
        {isUploading ? (
          <LoadingSpinner size="lg" label="Uploading…" />
        ) : preview ? (
          <>
            <div className="relative w-full h-full min-h-[280px] rounded-xl overflow-hidden">
              <Image
                src={preview}
                alt="Selected image preview"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleClear() }}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900/80 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
              aria-label="Remove selected image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center pointer-events-none">
            <div className={cn(
              'flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-200',
              isDragOver
                ? 'bg-fabric-500/20 border border-fabric-500/40'
                : 'bg-gray-800 border border-gray-700'
            )}>
              {isDragOver ? (
                <Upload className="h-6 w-6 text-fabric-400" />
              ) : (
                <ImageIcon className="h-6 w-6 text-gray-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300">
                {isDragOver ? 'Drop image here' : 'Drag & drop or click to select'}
              </p>
              <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP — max 10 MB</p>
            </div>
          </div>
        )}
      </div>

      {validationError && (
        <p className="text-xs text-red-400">{validationError}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleChange}
        className="sr-only"
        tabIndex={-1}
      />
    </div>
  )
}
