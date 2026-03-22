'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Wand2, RefreshCw, Download, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'
import { useGenerateDesign, useJobStatus } from '@/hooks/useDesigns'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { cn, getStatusColor } from '@/lib/utils'

const generateSchema = z.object({
  prompt: z.string().min(10, 'Describe your design in at least 10 characters').max(500),
  style: z.string().min(1, 'Please select a style'),
  width: z.number().min(256).max(2048),
  height: z.number().min(256).max(2048),
})

type GenerateFormData = z.infer<typeof generateSchema>

const STYLES = [
  { value: 'geometric', label: 'Geometric', description: 'Precise patterns & shapes' },
  { value: 'floral', label: 'Floral', description: 'Botanical & flower motifs' },
  { value: 'abstract', label: 'Abstract', description: 'Free-form artistic expression' },
  { value: 'ethnic', label: 'Ethnic', description: 'Cultural & traditional motifs' },
  { value: 'damask', label: 'Damask', description: 'Classic woven patterns' },
  { value: 'paisley', label: 'Paisley', description: 'Curved teardrop motifs' },
  { value: 'stripes', label: 'Stripes', description: 'Linear & striped patterns' },
  { value: 'digital', label: 'Digital', description: 'Modern digital art style' },
]

const DIMENSIONS = [
  { label: '512 × 512', width: 512, height: 512 },
  { label: '768 × 768', width: 768, height: 768 },
  { label: '1024 × 1024', width: 1024, height: 1024 },
  { label: '1024 × 768', width: 1024, height: 768 },
  { label: '768 × 1024', width: 768, height: 1024 },
]

export function GenerateForm() {
  const [jobId, setJobId] = useState<string | null>(null)
  const generateMutation = useGenerateDesign()
  const { data: jobStatus } = useJobStatus(jobId)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GenerateFormData>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      style: 'geometric',
      width: 1024,
      height: 1024,
    },
  })

  const selectedStyle = watch('style')
  const selectedWidth = watch('width')
  const selectedHeight = watch('height')

  const onSubmit = async (data: GenerateFormData) => {
    const result = await generateMutation.mutateAsync(data)
    setJobId(result.jobId)
  }

  const handleReset = () => {
    setJobId(null)
    generateMutation.reset()
  }

  const isDone = jobStatus?.status === 'done'
  const isFailed = jobStatus?.status === 'failed'
  const isProcessing = jobStatus?.status === 'processing' || jobStatus?.status === 'pending'

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Form */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Design Parameters</CardTitle>
          <CardDescription>Configure your textile pattern generation</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Prompt */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">
                Design Prompt <span className="text-red-400">*</span>
              </label>
              <textarea
                {...register('prompt')}
                rows={4}
                placeholder="Describe your textile design... e.g., 'A flowing floral pattern with deep indigo and gold tones, inspired by Persian carpets, with intricate vine details'"
                className={cn(
                  'w-full rounded-lg border bg-gray-900/60 px-3 py-2.5 text-sm text-gray-100 placeholder-gray-500 resize-none',
                  'transition-all duration-200 outline-none',
                  'focus:ring-2 focus:ring-fabric-500/50 focus:border-fabric-500',
                  errors.prompt
                    ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                    : 'border-gray-700 hover:border-gray-600'
                )}
              />
              {errors.prompt && <p className="text-xs text-red-400">{errors.prompt.message}</p>}
            </div>

            {/* Style */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Style</label>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => setValue('style', style.value)}
                    className={cn(
                      'flex flex-col items-start p-3 rounded-lg border text-left transition-all duration-200',
                      selectedStyle === style.value
                        ? 'border-fabric-500 bg-fabric-500/10 text-white'
                        : 'border-gray-700 bg-gray-900/40 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                    )}
                  >
                    <span className="text-sm font-medium">{style.label}</span>
                    <span className="text-xs opacity-70 mt-0.5">{style.description}</span>
                  </button>
                ))}
              </div>
              {errors.style && <p className="text-xs text-red-400">{errors.style.message}</p>}
            </div>

            {/* Dimensions */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Output Size</label>
              <div className="flex flex-wrap gap-2">
                {DIMENSIONS.map((dim) => (
                  <button
                    key={dim.label}
                    type="button"
                    onClick={() => {
                      setValue('width', dim.width)
                      setValue('height', dim.height)
                    }}
                    className={cn(
                      'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200',
                      selectedWidth === dim.width && selectedHeight === dim.height
                        ? 'border-textile-500 bg-textile-500/10 text-textile-300'
                        : 'border-gray-700 bg-gray-900/40 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                    )}
                  >
                    {dim.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={generateMutation.isPending}
              className="w-full"
            >
              <Wand2 className="h-5 w-5" />
              {generateMutation.isPending ? 'Submitting...' : 'Generate Design'}
            </Button>

            {generateMutation.error && (
              <p className="text-sm text-red-400 text-center">
                Failed to start generation. Please try again.
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Result Preview */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Your generated design will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          {!jobId ? (
            <div className="flex flex-col items-center justify-center h-80 rounded-lg border border-dashed border-gray-700 bg-gray-900/30">
              <div className="relative mb-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-textile-500/20 to-fabric-600/20 border border-fabric-500/30 flex items-center justify-center">
                  <Wand2 className="h-7 w-7 text-fabric-400" />
                </div>
              </div>
              <p className="text-gray-400 font-medium">No design generated yet</p>
              <p className="text-sm text-gray-600 mt-1">Fill in the form and click Generate</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Status bar */}
              <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium', getStatusColor(jobStatus?.status ?? 'pending'))}>
                {isDone && <CheckCircle className="h-4 w-4" />}
                {isFailed && <XCircle className="h-4 w-4" />}
                {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                {!jobStatus && <Clock className="h-4 w-4" />}
                <span className="capitalize">{jobStatus?.status ?? 'pending'}</span>
              </div>

              {/* Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-800">
                {isDone && jobStatus?.imageUrl ? (
                  <Image
                    src={jobStatus.imageUrl}
                    alt="Generated textile design"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isFailed ? (
                      <div className="text-center">
                        <XCircle className="h-12 w-12 text-red-400/50 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Generation failed</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="h-12 w-12 rounded-full border-2 border-gray-700 border-t-fabric-500 animate-spin mx-auto mb-3" />
                        <p className="text-sm text-gray-500 animate-pulse">
                          {jobStatus?.status === 'processing' ? 'Creating your design...' : 'Waiting in queue...'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {isDone && jobStatus?.imageUrl && (
                  <a
                    href={jobStatus.imageUrl}
                    download="textile-design.png"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1"
                  >
                    <Button variant="secondary" size="sm" className="w-full">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </a>
                )}
                <Button variant="ghost" size="sm" onClick={handleReset} className="flex-1">
                  <RefreshCw className="h-4 w-4" />
                  New Design
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
