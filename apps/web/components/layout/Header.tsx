'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, LogOut, LayoutDashboard, PlusCircle, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuthStore()
  const { logout } = useAuth()

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/generate', label: 'Generate', icon: PlusCircle },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800/80 bg-gray-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-textile-500 to-fabric-600 shadow-lg shadow-fabric-900/40 group-hover:shadow-fabric-700/40 transition-all duration-300">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg font-semibold bg-gradient-to-r from-textile-300 to-fabric-400 bg-clip-text text-transparent">
              TextileAI
            </span>
          </Link>

          {/* Nav + Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <nav className="hidden sm:flex items-center gap-1 mr-2">
                  {navLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200',
                        pathname === href
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  ))}
                </nav>

                <div className="flex items-center gap-1 pl-2 border-l border-gray-800">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50">
                    <User className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-sm text-gray-300 max-w-[120px] truncate">{user?.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout} className="text-gray-400 hover:text-red-400">
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign out</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">Get started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
