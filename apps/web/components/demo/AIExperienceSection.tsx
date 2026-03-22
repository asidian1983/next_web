'use client'

import { useState } from 'react'
import { Sparkles, RotateCcw, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useGenerateImage } from '@/hooks/useGenerateImage'

const STYLES = [
  { id: 'floral', label: 'Floral', emoji: '🌸' },
  { id: 'geometric', label: 'Geometric', emoji: '⬡' },
  { id: 'abstract', label: 'Abstract', emoji: '🎨' },
  { id: 'minimal', label: 'Minimal', emoji: '◯' },
  { id: 'vintage', label: 'Vintage', emoji: '🏺' },
  { id: 'modern', label: 'Modern', emoji: '◈' },
]

const EXAMPLE_PROMPTS = [
  'Blue silk with delicate floral embroidery in gold thread',
  'Moroccan geometric tile pattern in deep indigo and cream',
  'Watercolor abstract botanical on linen texture',
  'Art deco minimal lines on ivory cotton',
  'Vintage damask in burgundy and antique gold',
  'Modern herringbone weave in slate and charcoal',
]

export function AIExperienceSection() {
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('floral')
  const { isGenerating, progress, resultGradient, generate, reset } = useGenerateImage()

  const handleGenerate = () => {
    if (!prompt.trim()) return
    generate({ prompt, style: selectedStyle })
  }

  const handleReset = () => {
    reset()
    setPrompt('')
  }

  const handleExamplePrompt = (example: string) => {
    setPrompt(example)
  }

  return (
    <section className="py-28 px-4 border-t border-white/5 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-fabric-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-textile-500/30 bg-textile-500/10 px-4 py-1.5 text-sm text-textile-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            No signup required
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Try It{' '}
            <span className="bg-gradient-to-r from-textile-400 to-purple-400 bg-clip-text text-transparent">
              Yourself
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Experience AI textile generation right here. No account needed.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 sm:p-8">
          {/* Prompt input */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Describe your textile design
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. blue silk with floral pattern and golden embroidery..."
                rows={3}
                className="w-full rounded-xl bg-gray-900/80 border border-white/10 text-gray-100 placeholder-gray-600 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-fabric-500/50 focus:border-fabric-500/50 transition-all"
              />
            </div>
            {/* Example prompts */}
            <div className="mt-2 flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.slice(0, 3).map((example) => (
                <button
                  key={example}
                  onClick={() => handleExamplePrompt(example)}
                  className="text-xs text-gray-600 hover:text-gray-400 border border-white/5 hover:border-white/15 rounded-lg px-2.5 py-1 transition-all truncate max-w-[200px]"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Style selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map(({ id, label, emoji }) => (
                <button
                  key={id}
                  onClick={() => setSelectedStyle(id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedStyle === id
                      ? 'bg-gradient-to-r from-textile-500 to-fabric-600 text-white shadow-lg shadow-fabric-900/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200 border border-white/10'
                  }`}
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <div className="flex gap-3 mb-6">
            <Button
              variant="primary"
              size="lg"
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              isLoading={isGenerating}
              className="flex-1 shadow-xl shadow-fabric-900/40"
            >
              {isGenerating ? `Generating... ${progress}%` : 'Generate Design'}
              {!isGenerating && <Sparkles className="h-4 w-4" />}
            </Button>
            {(resultGradient || isGenerating) && (
              <Button variant="secondary" size="lg" onClick={handleReset} className="px-4">
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Result area */}
          {isGenerating && (
            <div className="rounded-xl border border-white/10 bg-gray-900/60 overflow-hidden">
              {/* Progress bar */}
              <div className="h-1 bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-textile-500 to-fabric-500 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="aspect-video flex flex-col items-center justify-center gap-4 p-8">
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-2 border-fabric-500/30 animate-ping" />
                  <div className="absolute inset-2 rounded-full border-2 border-textile-400 border-t-transparent animate-spin" />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-textile-500 to-fabric-600 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-gray-300 font-medium">AI is crafting your design</p>
                  <p className="text-gray-600 text-sm mt-1">Weaving patterns, applying style, refining details...</p>
                </div>
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                    <span>Processing</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-textile-500 via-fabric-500 to-purple-500 transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {resultGradient && !isGenerating && (
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <div className={`aspect-video bg-gradient-to-br ${resultGradient} relative group`}>
                {/* Simulated fabric texture overlay */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.08) 4px, rgba(255,255,255,0.08) 8px)',
                  }}
                />
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 6px, rgba(0,0,0,0.1) 6px, rgba(0,0,0,0.1) 12px)',
                  }}
                />
                {/* Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/40 backdrop-blur-sm px-2.5 py-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-white font-medium">Generated</span>
                </div>
                {/* Style badge */}
                <div className="absolute top-3 right-3 rounded-lg bg-black/40 backdrop-blur-sm px-2.5 py-1.5">
                  <span className="text-xs text-white/80 capitalize">{selectedStyle} style</span>
                </div>
              </div>
              {/* CTA below result */}
              <div className="bg-gray-900/80 border-t border-white/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Love this design?</p>
                  <p className="text-gray-600 text-xs">Sign up to save, download, and generate unlimited designs</p>
                </div>
                <Link href="/register" className="shrink-0">
                  <Button variant="primary" size="sm" className="shadow-lg shadow-fabric-900/40">
                    Sign up to save
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {!isGenerating && !resultGradient && (
            <div className="rounded-xl border border-dashed border-white/10 aspect-video flex flex-col items-center justify-center gap-3 text-center p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                <Sparkles className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-500 font-medium">Your design will appear here</p>
                <p className="text-gray-700 text-sm mt-1">Enter a prompt and click Generate</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
