'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PlusCircle, LayoutGrid, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useDesigns } from '@/hooks/useDesigns'
import { useGenerationStats } from '@/hooks/useGenerationStats'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { DesignGrid } from '@/components/designs/DesignGrid'
import { SearchFilter, type SearchFilterValues } from '@/components/designs/SearchFilter'
import { Button } from '@/components/ui/Button'

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [filters, setFilters] = useState<SearchFilterValues>({ search: '', style: '', source: '' })
  const { data, isLoading } = useDesigns({
    search: filters.search || undefined,
    style: filters.style || undefined,
    source: filters.source || undefined,
  })
  const { data: statsData, isLoading: statsLoading } = useGenerationStats()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const isStatsLoading = isLoading || statsLoading

  const designs = data?.data ?? []
  const total = data?.total ?? 0

  const stats = [
    {
      label: 'Total Designs',
      value: statsData?.total ?? total,
      icon: LayoutGrid,
      color: 'text-fabric-400',
      gradient: 'from-fabric-400 to-fabric-600',
    },
    {
      label: 'Completed',
      value: statsData?.byStatus?.['done'] ?? 0,
      icon: CheckCircle,
      color: 'text-emerald-400',
      gradient: 'from-emerald-400 to-emerald-600',
    },
    {
      label: 'In Progress',
      value: (statsData?.byStatus?.['pending'] ?? 0) + (statsData?.byStatus?.['processing'] ?? 0),
      icon: Clock,
      color: 'text-amber-400',
      gradient: 'from-amber-400 to-amber-600',
    },
    {
      label: 'This Month',
      value: statsData?.thisMonth ?? 0,
      icon: TrendingUp,
      color: 'text-textile-400',
      gradient: 'from-textile-400 to-textile-600',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 min-w-0">
          {/* Page header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user?.name?.split(' ')[0]}
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Here&apos;s an overview of your textile designs
              </p>
            </div>
            <Link href="/generate">
              <Button variant="primary" size="md">
                <PlusCircle className="h-4 w-4" />
                New Design
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(({ label, value, icon: Icon, color, gradient }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b ${gradient}`} />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {label}
                  </span>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <p className="text-2xl font-bold text-white">
                  {isStatsLoading ? (
                    <span className="inline-block h-7 w-10 rounded bg-white/[0.04] animate-shimmer" />
                  ) : (
                    value
                  )}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Designs gallery */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-200">Your Designs</h2>
              {designs.length > 0 && (
                <span className="text-xs text-gray-600">{total} total</span>
              )}
            </div>
            <SearchFilter values={filters} onChange={setFilters} className="mb-4" />
            <DesignGrid designs={designs} isLoading={isLoading} />
          </div>
        </main>
      </div>
    </div>
  )
}
