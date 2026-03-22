'use client'

import { useState } from 'react'
import { Plus, Trash2, Layers } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GenerationProgress } from '@/components/designs/GenerationProgress'
import { cn } from '@/lib/utils'

interface BatchJob {
  jobId: string
  prompt: string
  imageUrl?: string
}

interface BatchGeneratePanelProps {
  prompts: string[]
  onPromptChange: (index: number, value: string) => void
  onAddPrompt: () => void
  onRemovePrompt: (index: number) => void
  jobs: BatchJob[]
  onJobComplete: (jobId: string, imageUrl: string) => void
  onJobError: (jobId: string, error: string) => void
}

export function BatchGeneratePanel({
  prompts,
  onPromptChange,
  onAddPrompt,
  onRemovePrompt,
  jobs,
  onJobComplete,
  onJobError,
}: BatchGeneratePanelProps) {
  return (
    <div className="space-y-4">
      {/* Prompt inputs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">
            Prompts
            <span className="ml-2 text-xs text-gray-500">({prompts.length}/4)</span>
          </label>
          {prompts.length < 4 && (
            <Button type="button" variant="ghost" size="sm" onClick={onAddPrompt}>
              <Plus className="h-3.5 w-3.5" />
              Add prompt
            </Button>
          )}
        </div>
        {prompts.map((prompt, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-shrink-0 h-7 w-7 rounded-md bg-fabric-500/10 border border-fabric-500/30 flex items-center justify-center mt-0.5">
              <span className="text-xs font-bold text-fabric-400">{index + 1}</span>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => onPromptChange(index, e.target.value)}
              rows={2}
              placeholder={`Prompt ${index + 1}... describe your textile design`}
              className={cn(
                'flex-1 rounded-lg border bg-gray-900/60 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 resize-none',
                'transition-all duration-200 outline-none',
                'focus:ring-2 focus:ring-fabric-500/50 focus:border-fabric-500',
                'border-gray-700 hover:border-gray-600'
              )}
            />
            {prompts.length > 1 && (
              <button
                type="button"
                onClick={() => onRemovePrompt(index)}
                className="mt-1 p-1.5 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Progress grid */}
      {jobs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-fabric-400" />
            <span className="text-sm font-medium text-gray-300">Batch Progress</span>
            <span className="text-xs text-gray-500">
              {jobs.filter((j) => j.imageUrl).length}/{jobs.length} complete
            </span>
          </div>
          <div
            className={cn(
              'grid gap-4',
              jobs.length === 1 && 'grid-cols-1',
              jobs.length === 2 && 'grid-cols-2',
              jobs.length > 2 && 'grid-cols-2'
            )}
          >
            {jobs.map((job) => (
              <div key={job.jobId} className="space-y-1.5">
                <p className="text-xs text-gray-500 line-clamp-1 italic">&ldquo;{job.prompt}&rdquo;</p>
                <GenerationProgress
                  jobId={job.jobId}
                  onComplete={(url) => onJobComplete(job.jobId, url)}
                  onError={(err) => onJobError(job.jobId, err)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
