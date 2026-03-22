'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  PlusCircle,
  Image,
  Settings,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/generate', label: 'Generate Design', icon: PlusCircle },
  { href: '/designs', label: 'My Designs', icon: Image },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-gray-950 border-r border-gray-800/60 py-6 px-3">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-3 mb-8 group">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-textile-500 to-fabric-600 shadow-lg shadow-fabric-900/40">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="font-display text-lg font-semibold bg-gradient-to-r from-textile-300 to-fabric-400 bg-clip-text text-transparent">
          TextileAI
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-textile-500/20 to-fabric-600/20 text-white border border-fabric-500/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 transition-colors',
                  isActive ? 'text-fabric-400' : 'text-gray-500 group-hover:text-gray-300'
                )}
              />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-fabric-400" />}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      {user && (
        <div className="mt-auto pt-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-900/60">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-textile-500 to-fabric-600 text-white text-sm font-semibold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
