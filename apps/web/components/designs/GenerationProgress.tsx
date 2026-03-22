'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { CheckCircle, XCircle, Download, Sparkles } from 'lucide-react'
import { useGenerate, type JobProgress } from '@/hooks/useGenerate'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface Props {
  jobId: string
  onComplete: (imageUrl: string) => void
  onError: (error: string) => void
}

const STAGE_LABELS: Record<number, string> = {
  0: 'Initializing...',
  10: 'Queuing job...',
  25: 'Rendering pattern...',
  50: 'Applying texture...',
  75: 'Refining details...',
  90: 'Finalizing...',
  100: 'Complete!',
}

function getStageLabel(progress: number): string {
  const thresholds = Object.keys(STAGE_LABELS)
    .map(Number)
    .sort((a, b) => b - a)
  const match = thresholds.find((t) => progress >= t)
  return match !== undefined ? STAGE_LABELS[match] : 'Initializing...'
}

export function GenerationProgress({ jobId, onComplete, onError }: Props) {
  const { trackProgress } = useGenerate()
  const [progress, setProgress] = useState<JobProgress | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const cancelRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    cancelRef.current = trackProgress(jobId, {
      onProgress: (p) => setProgress(p),
      onComplete: (url) => {
        setImageUrl(url)
        onComplete(url)
      },
      onError: (err) => {
        setErrorMsg(err)
        onError(err)
      },
    })
    return () => {
      cancelRef.current?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId])

  const pct = progress?.progress ?? 0
  const isDone = progress?.status === 'done' || imageUrl !== null
  const isFailed = progress?.status === 'failed' || errorMsg !== null

  return (
    <div className="flex flex-col gap-3">
      {/* Status header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isDone && <CheckCircle className="h-4 w-4 text-emerald-400" />}
          {isFailed && <XCircle className="h-4 w-4 text-red-400" />}
          {!isDone && !isFailed && (
            <div className="h-4 w-4 rounded-full border-2 border-gray-700 border-t-fabric-500 animate-spin" />
          )}
          <span
            className={cn(
              'text-xs font-medium',
              isDone && 'text-emerald-400',
              isFailed && 'text-red-400',
              !isDone && !isFailed && 'text-gray-400'
            )}
          >
            {isFailed ? (errorMsg ?? 'Failed') : getStageLabel(pct)}
          </span>
        </div>
        {!isDone && !isFailed && (
          <span className="text-xs font-mono text-gray-500">{pct}%</span>
        )}
      </div>

      {/* Progress bar */}
      {!isDone && !isFailed && (
        <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-textile-500 to-fabric-600 transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* Image preview */}
      <div
        className={cn(
          'relative rounded-lg overflow-hidden bg-gray-900/60 border',
          isDone ? 'border-emerald-500/30 aspect-square' : 'border-gray-800 aspect-square'
        )}
      >
        {isDone && imageUrl ? (
          <Image
            src={imageUrl}
            alt="Generated design"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : isFailed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <XCircle className="h-8 w-8 text-red-400/50" />
            <p className="text-xs text-gray-500 text-center px-2">{errorMsg ?? 'Generation failed'}</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-2 border-gray-800 border-t-fabric-500 animate-spin" />
              <Sparkles className="h-5 w-5 text-fabric-400/60 absolute inset-0 m-auto" />
            </div>
            {progress?.enhanced_prompt && (
              <p className="text-[10px] text-gray-600 text-center px-3 line-clamp-2 italic">
                {progress.enhanced_prompt}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Download button */}
      {isDone && imageUrl && (
        <a href={imageUrl} download="textile-design.png" target="_blank" rel="noreferrer">
          <Button variant="secondary" size="sm" className="w-full">
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
        </a>
      )}
    </div>
  )
}
