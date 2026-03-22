'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Upload, CheckCircle, Tag, ArrowRight, RefreshCw } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { UploadZone } from '@/components/designs/UploadZone'
import { useUpload } from '@/hooks/useUpload'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function UploadPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')

  const { upload, isUploading, uploadedDesign, error, reset } = useUpload()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    reset()
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    await upload({ file: selectedFile, title: title.trim() || undefined })
  }

  const handleReset = () => {
    setSelectedFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setTitle('')
    reset()
  }

  const resultImageUrl = uploadedDesign?.imageUrl
    ? uploadedDesign.imageUrl.startsWith('http')
      ? uploadedDesign.imageUrl
      : `${API_URL}${uploadedDesign.imageUrl}`
    : null

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 min-w-0">
          {/* Page header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-textile-500/20 to-fabric-600/20 border border-fabric-500/30">
                <Upload className="h-4 w-4 text-fabric-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Upload Design</h1>
            </div>
            <p className="text-gray-400 text-sm ml-12">
              Upload an existing image to get AI-generated tags and add it to your collection.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upload form */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Select Image</CardTitle>
                <CardDescription>Choose a textile design image to upload</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <UploadZone
                  onFileSelect={handleFileSelect}
                  preview={preview}
                  isUploading={isUploading}
                />

                <Input
                  label="Title (optional)"
                  placeholder="e.g. Summer Floral Pattern"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isUploading}
                />

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading || !!uploadedDesign}
                    isLoading={isUploading}
                  >
                    <Upload className="h-5 w-5" />
                    {isUploading ? 'Uploading…' : 'Upload Design'}
                  </Button>
                  {(selectedFile || uploadedDesign) && (
                    <Button variant="ghost" size="lg" onClick={handleReset} disabled={isUploading}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-400 text-center">
                    Upload failed. Please try again.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Result */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>Upload result and generated tags will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                {!uploadedDesign ? (
                  <div className="flex flex-col items-center justify-center h-80 rounded-lg border border-dashed border-gray-700 bg-gray-900/30">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-textile-500/20 to-fabric-600/20 border border-fabric-500/30 mb-4">
                      <Upload className="h-7 w-7 text-fabric-400" />
                    </div>
                    <p className="text-gray-400 font-medium">No design uploaded yet</p>
                    <p className="text-sm text-gray-600 mt-1">Select an image and click Upload</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Success banner */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      <span>Design uploaded successfully!</span>
                    </div>

                    {/* Image preview */}
                    {resultImageUrl && (
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-800">
                        <Image
                          src={resultImageUrl}
                          alt={uploadedDesign.title ?? 'Uploaded design'}
                          fill
                          className="object-contain"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    )}

                    {/* Title */}
                    {uploadedDesign.title && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Title</p>
                        <p className="text-sm text-gray-200">{uploadedDesign.title}</p>
                      </div>
                    )}

                    {/* Tags */}
                    {uploadedDesign.tags.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Tag className="h-3.5 w-3.5 text-fabric-400" />
                          <p className="text-xs text-gray-500 uppercase tracking-wide">AI-generated tags</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {uploadedDesign.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full text-xs bg-fabric-500/15 border border-fabric-500/30 text-fabric-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Link to detail */}
                    <Link href={`/designs/${uploadedDesign.id}`} className="block">
                      <Button variant="secondary" size="sm" className="w-full">
                        View Design Details
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
