'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, LayoutGrid, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useDesigns } from '@/hooks/useDesigns'
import { useGenerationStats } from '@/hooks/useGenerationStats'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { DesignGrid } from '@/components/designs/DesignGrid'
import { SearchFilter, type SearchFilterValues } from '@/components/designs/SearchFilter'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

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

  const stats = [
    {
      label: 'Total Designs',
      value: statsData?.total ?? data?.total ?? 0,
      icon: LayoutGrid,
      color: 'text-fabric-400',
    },
    {
      label: 'Completed',
      value: statsData?.byStatus?.['done'] ?? 0,
      icon: CheckCircle,
      color: 'text-emerald-400',
    },
    {
      label: 'In Progress',
      value: (statsData?.byStatus?.['pending'] ?? 0) + (statsData?.byStatus?.['processing'] ?? 0),
      icon: Clock,
      color: 'text-amber-400',
    },
    {
      label: 'This Month',
      value: statsData?.thisMonth ?? 0,
      icon: TrendingUp,
      color: 'text-textile-400',
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
              <p className="text-gray-400 mt-1 text-sm">
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
            {stats.map(({ label, value, icon: Icon, color }) => (
              <Card key={label} variant="default" className="hover:border-gray-700 transition-colors">
                <CardContent className="py-4 px-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {label}
                    </span>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {isStatsLoading ? (
                      <span className="inline-block h-7 w-10 rounded bg-gray-800 animate-pulse" />
                    ) : (
                      value
                    )}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Designs gallery */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-200">Your Designs</h2>
              {designs.length > 0 && (
                <span className="text-xs text-gray-500">{total} total</span>
              )}
            </div>
            <SearchFilter values={filters} onChange={setFilters} className="mb-4" />
            <DesignGrid designs={data?.data ?? []} isLoading={isLoading} />
          </div>
        </main>
      </div>
    </div>
  )
}
