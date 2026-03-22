'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Wand2, Layers, Sparkles, RefreshCw, SlidersHorizontal } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { StylePresetGrid } from '@/components/designs/StylePresetGrid'
import { GenerationProgress } from '@/components/designs/GenerationProgress'
import { BatchGeneratePanel } from '@/components/designs/BatchGeneratePanel'
import { useGenerate } from '@/hooks/useGenerate'
import { cn } from '@/lib/utils'

type Mode = 'single' | 'batch'

const DIMENSIONS = [
  { label: '512 × 512', width: 512, height: 512 },
  { label: '768 × 768', width: 768, height: 768 },
  { label: '1024 × 1024', width: 1024, height: 1024 },
]

interface BatchJob {
  jobId: string
  prompt: string
  imageUrl?: string
}

export default function GeneratePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { generate, generateBatch } = useGenerate()

  // Mode
  const [mode, setMode] = useState<Mode>('single')

  // Single mode state
  const [singlePrompt, setSinglePrompt] = useState('')
  const [singleJobId, setSingleJobId] = useState<string | null>(null)
  const [singleImageUrl, setSingleImageUrl] = useState<string | null>(null)
  const [singleError, setSingleError] = useState<string | null>(null)

  // Shared settings
  const [selectedStyle, setSelectedStyle] = useState('geometric')
  const [selectedDim, setSelectedDim] = useState(DIMENSIONS[2])
  const [seed, setSeed] = useState('')

  // Batch mode state
  const [batchPrompts, setBatchPrompts] = useState<string[]>(['', ''])
  const [batchJobs, setBatchJobs] = useState<BatchJob[]>([])

  // Form errors
  const [promptError, setPromptError] = useState<string | null>(null)
  const [batchError, setBatchError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const handleSingleGenerate = async () => {
    if (singlePrompt.trim().length < 10) {
      setPromptError('Describe your design in at least 10 characters')
      return
    }
    setPromptError(null)
    setSingleJobId(null)
    setSingleImageUrl(null)
    setSingleError(null)

    try {
      const result = await generate.mutateAsync({
        prompt: singlePrompt.trim(),
        style: selectedStyle,
        width: selectedDim.width,
        height: selectedDim.height,
        seed: seed ? Number(seed) : undefined,
      })
      setSingleJobId(result.jobId)
    } catch {
      setSingleError('Failed to start generation. Please try again.')
    }
  }

  const handleBatchGenerate = async () => {
    const validPrompts = batchPrompts.filter((p) => p.trim().length >= 10)
    if (validPrompts.length === 0) {
      setBatchError('Add at least one prompt with 10+ characters')
      return
    }
    setBatchError(null)
    setBatchJobs([])

    try {
      const result = await generateBatch.mutateAsync({
        prompts: validPrompts.map((p) => ({
          prompt: p.trim(),
          style: selectedStyle,
          width: selectedDim.width,
          height: selectedDim.height,
          seed: seed ? Number(seed) : undefined,
        })),
      })
      setBatchJobs(
        result.jobs.map((job, i) => ({
          jobId: job.jobId,
          prompt: validPrompts[i] ?? '',
        }))
      )
    } catch {
      setBatchError('Failed to start batch generation. Please try again.')
    }
  }

  const handleReset = () => {
    setSingleJobId(null)
    setSingleImageUrl(null)
    setSingleError(null)
    generate.reset()
  }

  const handleBatchReset = () => {
    setBatchJobs([])
    generateBatch.reset()
  }

  const handleJobComplete = useCallback((jobId: string, imageUrl: string) => {
    setBatchJobs((prev) =>
      prev.map((j) => (j.jobId === jobId ? { ...j, imageUrl } : j))
    )
  }, [])

  const handleJobError = useCallback((_jobId: string, _error: string) => {
    // errors shown inline in GenerationProgress
  }, [])

  const isGenerating = generate.isPending || generateBatch.isPending

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 min-w-0">
          {/* Page header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-textile-500/20 to-fabric-600/20 border border-fabric-500/30">
                <Wand2 className="h-4.5 w-4.5 text-fabric-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Generate Design</h1>
            </div>
            <p className="text-gray-400 text-sm ml-12">
              Describe your vision and let AI create unique textile patterns for you.
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-1 p-1 bg-gray-900 border border-gray-800 rounded-xl w-fit mb-6">
            <button
              type="button"
              onClick={() => setMode('single')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                mode === 'single'
                  ? 'bg-gradient-to-r from-textile-500 to-fabric-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Single
            </button>
            <button
              type="button"
              onClick={() => setMode('batch')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                mode === 'batch'
                  ? 'bg-gradient-to-r from-textile-500 to-fabric-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              Batch
            </button>
          </div>

          <div className="grid lg:grid-cols-[400px_1fr] gap-6 items-start">
            {/* Left panel - Controls */}
            <div className="space-y-4">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>
                    {mode === 'single' ? 'Design Parameters' : 'Batch Parameters'}
                  </CardTitle>
                  <CardDescription>
                    {mode === 'single'
                      ? 'Configure your textile pattern generation'
                      : 'Generate up to 4 designs simultaneously'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Single prompt */}
                  {mode === 'single' && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-300">
                        Design Prompt <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={singlePrompt}
                        onChange={(e) => {
                          setSinglePrompt(e.target.value)
                          if (promptError) setPromptError(null)
                        }}
                        rows={4}
                        placeholder="Describe your textile design... e.g., 'A flowing floral pattern with deep indigo and gold tones, inspired by Persian carpets'"
                        className={cn(
                          'w-full rounded-lg border bg-gray-900/60 px-3 py-2.5 text-sm text-gray-100 placeholder-gray-500 resize-none',
                          'transition-all duration-200 outline-none',
                          'focus:ring-2 focus:ring-fabric-500/50 focus:border-fabric-500',
                          promptError
                            ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                            : 'border-gray-700 hover:border-gray-600'
                        )}
                      />
                      {promptError && (
                        <p className="text-xs text-red-400">{promptError}</p>
                      )}
                    </div>
                  )}

                  {/* Batch prompts */}
                  {mode === 'batch' && (
                    <BatchGeneratePanel
                      prompts={batchPrompts}
                      onPromptChange={(i, v) => {
                        setBatchPrompts((prev) => {
                          const next = [...prev]
                          next[i] = v
                          return next
                        })
                        if (batchError) setBatchError(null)
                      }}
                      onAddPrompt={() => setBatchPrompts((prev) => [...prev, ''])}
                      onRemovePrompt={(i) =>
                        setBatchPrompts((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      jobs={batchJobs}
                      onJobComplete={handleJobComplete}
                      onJobError={handleJobError}
                    />
                  )}

                  {/* Style preset grid */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Style Preset</label>
                    <StylePresetGrid selected={selectedStyle} onSelect={setSelectedStyle} />
                  </div>

                  {/* Dimensions */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Dimensions</label>
                    <div className="flex flex-wrap gap-2">
                      {DIMENSIONS.map((dim) => (
                        <button
                          key={dim.label}
                          type="button"
                          onClick={() => setSelectedDim(dim)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200',
                            selectedDim.label === dim.label
                              ? 'border-textile-500 bg-textile-500/10 text-textile-300'
                              : 'border-gray-700 bg-gray-900/40 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                          )}
                        >
                          {dim.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Advanced: Seed */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <SlidersHorizontal className="h-3.5 w-3.5 text-gray-500" />
                      <label className="text-sm font-medium text-gray-400">
                        Seed{' '}
                        <span className="text-xs text-gray-600 font-normal">(optional)</span>
                      </label>
                    </div>
                    <input
                      type="number"
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                      placeholder="e.g. 42 — for reproducible results"
                      className={cn(
                        'w-full rounded-lg border bg-gray-900/60 px-3 py-2 text-sm text-gray-100 placeholder-gray-500',
                        'transition-all duration-200 outline-none',
                        'focus:ring-2 focus:ring-fabric-500/50 focus:border-fabric-500',
                        'border-gray-700 hover:border-gray-600'
                      )}
                    />
                  </div>

                  {/* Generate button */}
                  {mode === 'single' ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      isLoading={isGenerating}
                      onClick={handleSingleGenerate}
                      className="w-full"
                    >
                      <Wand2 className="h-5 w-5" />
                      {isGenerating ? 'Submitting...' : 'Generate Design'}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      isLoading={isGenerating}
                      onClick={handleBatchGenerate}
                      className="w-full"
                    >
                      <Layers className="h-5 w-5" />
                      {isGenerating ? 'Submitting batch...' : 'Generate Batch'}
                    </Button>
                  )}

                  {(generate.error || batchError) && (
                    <p className="text-sm text-red-400 text-center">
                      {batchError ?? 'Failed to start generation. Please try again.'}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right panel - Preview */}
            <div>
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Preview</CardTitle>
                      <CardDescription>
                        {mode === 'single'
                          ? 'Real-time generation progress'
                          : 'All batch jobs shown inline above'}
                      </CardDescription>
                    </div>
                    {(singleJobId || singleImageUrl) && mode === 'single' && (
                      <Button variant="ghost" size="sm" onClick={handleReset}>
                        <RefreshCw className="h-3.5 w-3.5" />
                        New
                      </Button>
                    )}
                    {batchJobs.length > 0 && mode === 'batch' && (
                      <Button variant="ghost" size="sm" onClick={handleBatchReset}>
                        <RefreshCw className="h-3.5 w-3.5" />
                        Reset
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {mode === 'single' ? (
                    <>
                      {!singleJobId ? (
                        <div className="flex flex-col items-center justify-center h-80 rounded-lg border border-dashed border-gray-700 bg-gray-900/30">
                          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-textile-500/20 to-fabric-600/20 border border-fabric-500/30 flex items-center justify-center mb-4">
                            <Wand2 className="h-7 w-7 text-fabric-400" />
                          </div>
                          <p className="text-gray-400 font-medium">No design generated yet</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Fill in the form and click Generate
                          </p>
                        </div>
                      ) : (
                        <GenerationProgress
                          jobId={singleJobId}
                          onComplete={(url) => setSingleImageUrl(url)}
                          onError={(err) => setSingleError(err)}
                        />
                      )}
                      {singleError && !singleJobId && (
                        <p className="text-sm text-red-400 text-center mt-3">{singleError}</p>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-80 rounded-lg border border-dashed border-gray-700 bg-gray-900/30">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-textile-500/20 to-fabric-600/20 border border-fabric-500/30 flex items-center justify-center mb-4">
                        <Layers className="h-7 w-7 text-fabric-400" />
                      </div>
                      <p className="text-gray-400 font-medium">Batch mode active</p>
                      <p className="text-sm text-gray-600 mt-1 text-center px-6">
                        Progress for each job appears inside the left panel as each generation runs
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
