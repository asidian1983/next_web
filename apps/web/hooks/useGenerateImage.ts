'use client'

import { useState, useRef } from 'react'

const STYLE_GRADIENTS: Record<string, string> = {
  floral: 'from-pink-400 via-rose-300 to-red-400',
  geometric: 'from-blue-500 via-indigo-400 to-purple-500',
  abstract: 'from-orange-400 via-amber-300 to-yellow-400',
  minimal: 'from-gray-300 via-slate-200 to-zinc-300',
  vintage: 'from-amber-600 via-yellow-500 to-orange-400',
  modern: 'from-cyan-400 via-teal-300 to-emerald-400',
}

export interface GenerateImageOptions {
  prompt: string
  style: string
}

export interface GenerateResult {
  isGenerating: boolean
  progress: number
  resultGradient: string | null
  generate: (options: GenerateImageOptions) => void
  reset: () => void
}

export function useGenerateImage(): GenerateResult {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultGradient, setResultGradient] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const generate = ({ style }: GenerateImageOptions) => {
    if (isGenerating) return

    setIsGenerating(true)
    setProgress(0)
    setResultGradient(null)

    const totalDuration = 3000
    const tickInterval = 50
    const totalTicks = totalDuration / tickInterval
    let tick = 0

    intervalRef.current = setInterval(() => {
      tick++
      // Ease-out curve: fast start, slow finish
      const raw = tick / totalTicks
      const eased = 1 - Math.pow(1 - raw, 2)
      const pct = Math.min(Math.round(eased * 100), 99)
      setProgress(pct)

      if (tick >= totalTicks) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setProgress(100)
        const gradient = STYLE_GRADIENTS[style.toLowerCase()] ?? STYLE_GRADIENTS.modern
        setResultGradient(gradient)
        setIsGenerating(false)
      }
    }, tickInterval)
  }

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsGenerating(false)
    setProgress(0)
    setResultGradient(null)
  }

  return { isGenerating, progress, resultGradient, generate, reset }
}
