'use client'

import { cn } from '@/lib/utils'

export interface StylePreset {
  id: string
  name: string
  description: string
  emoji: string
  colors: string[]
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'realistic',
    name: 'Realistic',
    description: 'Photorealistic textures',
    emoji: '📸',
    colors: ['#8B7355', '#C4A882', '#6B5344', '#D4B896'],
  },
  {
    id: 'floral',
    name: 'Floral',
    description: 'Botanical & flower motifs',
    emoji: '🌸',
    colors: ['#E8A0B4', '#C4E0A0', '#F4D03F', '#A8D8A8'],
  },
  {
    id: 'geometric',
    name: 'Geometric',
    description: 'Precise patterns & shapes',
    emoji: '◆',
    colors: ['#5B8DB8', '#2C4A7C', '#8BA7C7', '#1A2F5A'],
  },
  {
    id: 'abstract',
    name: 'Abstract',
    description: 'Free-form artistic expression',
    emoji: '🎨',
    colors: ['#E74C3C', '#8E44AD', '#3498DB', '#F39C12'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean & simple lines',
    emoji: '▭',
    colors: ['#ECF0F1', '#BDC3C7', '#95A5A6', '#7F8C8D'],
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Aged & classic aesthetic',
    emoji: '🕰️',
    colors: ['#C8A86B', '#8B6914', '#D4A96A', '#5C3D11'],
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design',
    emoji: '⬡',
    colors: ['#2ECC71', '#1ABC9C', '#16A085', '#0E6655'],
  },
  {
    id: 'traditional',
    name: 'Traditional',
    description: 'Cultural & heritage motifs',
    emoji: '🏺',
    colors: ['#C0392B', '#922B21', '#E74C3C', '#7B241C'],
  },
]

interface StylePresetGridProps {
  selected: string
  onSelect: (id: string) => void
}

export function StylePresetGrid({ selected, onSelect }: StylePresetGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {STYLE_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onSelect(preset.id)}
          className={cn(
            'flex flex-col items-start p-2.5 rounded-lg border text-left transition-all duration-200 group',
            selected === preset.id
              ? 'border-fabric-500 bg-fabric-500/10 shadow-sm shadow-fabric-900/30'
              : 'border-gray-700 bg-gray-900/40 hover:border-gray-600 hover:bg-gray-800/60'
          )}
        >
          <span className="text-lg mb-1.5 leading-none">{preset.emoji}</span>
          <span
            className={cn(
              'text-xs font-semibold leading-tight',
              selected === preset.id ? 'text-fabric-300' : 'text-gray-300 group-hover:text-gray-100'
            )}
          >
            {preset.name}
          </span>
          <span className="text-[10px] text-gray-500 mt-0.5 leading-tight line-clamp-1">
            {preset.description}
          </span>
          {/* Color swatches */}
          <div className="flex gap-0.5 mt-2">
            {preset.colors.map((color) => (
              <span
                key={color}
                className="h-2 w-2 rounded-full ring-1 ring-black/20"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </button>
      ))}
    </div>
  )
}
