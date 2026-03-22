'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Wand2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { GenerateForm } from '@/components/designs/GenerateForm'

export default function GeneratePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 min-w-0">
          {/* Page header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-textile-500/20 to-fabric-600/20 border border-fabric-500/30">
                <Wand2 className="h-4.5 w-4.5 text-fabric-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Generate Design</h1>
            </div>
            <p className="text-gray-400 text-sm ml-12">
              Describe your vision and let AI create a unique textile pattern for you.
            </p>
          </div>

          <GenerateForm />
        </main>
      </div>
    </div>
  )
}
