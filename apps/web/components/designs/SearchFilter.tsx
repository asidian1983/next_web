'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

const STYLES = [
  { value: '', label: 'All Styles' },
  { value: 'realistic', label: 'Realistic' },
  { value: 'floral', label: 'Floral' },
  { value: 'geometric', label: 'Geometric' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'bohemian', label: 'Bohemian' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'tropical', label: 'Tropical' },
]

const SOURCES = [
  { value: '', label: 'All Sources' },
  { value: 'generated', label: 'Generated' },
  { value: 'uploaded', label: 'Uploaded' },
]

export interface SearchFilterValues {
  search: string
  style: string
  source: string
}

interface SearchFilterProps {
  values: SearchFilterValues
  onChange: (values: SearchFilterValues) => void
  showSource?: boolean
  className?: string
}

export function SearchFilter({ values, onChange, showSource = true, className }: SearchFilterProps) {
  const selectClass =
    'h-[42px] rounded-lg border border-gray-700 bg-gray-900/60 px-3 py-2 text-sm text-gray-100 transition-all duration-200 outline-none focus:ring-2 focus:ring-fabric-500/50 focus:border-fabric-500 hover:border-gray-600 cursor-pointer'

  return (
    <div className={cn('flex flex-col sm:flex-row gap-3', className)}>
      <div className="flex-1">
        <Input
          placeholder="Search designs..."
          value={values.search}
          onChange={(e) => onChange({ ...values, search: e.target.value })}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      <select
        value={values.style}
        onChange={(e) => onChange({ ...values, style: e.target.value })}
        className={selectClass}
        aria-label="Filter by style"
      >
        {STYLES.map(({ value, label }) => (
          <option key={value} value={value} className="bg-gray-900">
            {label}
          </option>
        ))}
      </select>

      {showSource && (
        <select
          value={values.source}
          onChange={(e) => onChange({ ...values, source: e.target.value })}
          className={selectClass}
          aria-label="Filter by source"
        >
          {SOURCES.map(({ value, label }) => (
            <option key={value} value={value} className="bg-gray-900">
              {label}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
