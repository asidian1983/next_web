'use client'

import { useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const AVATARS = [
  { initials: 'SL', color: 'from-pink-500 to-rose-600', name: 'Sarah L.' },
  { initials: 'MK', color: 'from-blue-500 to-indigo-600', name: 'Mike K.' },
  { initials: 'AR', color: 'from-emerald-500 to-teal-600', name: 'Aisha R.' },
]

export function CTASection() {
  const [email, setEmail] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  return (
    <section className="py-28 px-4 border-t border-white/5 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-fabric-900/30 via-gray-950 to-textile-950/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-fabric-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-textile-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-fabric-500/30 bg-fabric-500/10 px-4 py-1.5 text-sm text-fabric-300 mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          Free to get started
        </div>

        <h2 className="font-display text-5xl sm:text-6xl font-bold text-white mb-5 leading-tight">
          Start Creating{' '}
          <span className="bg-gradient-to-r from-textile-400 via-fabric-400 to-purple-400 bg-clip-text text-transparent">
            Today
          </span>
        </h2>

        <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl mx-auto">
          Join 10,000+ designers using AI to create unique textile designs that captivate and inspire.
        </p>

        {/* Email + CTA */}
        <div
          className={`flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-5 p-1.5 rounded-xl border transition-all duration-300 ${
            isFocused
              ? 'border-fabric-500/50 bg-gray-900/80 shadow-lg shadow-fabric-900/30'
              : 'border-white/10 bg-white/5'
          }`}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter your email..."
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-600 px-3 py-2 text-sm focus:outline-none min-w-0"
          />
          <Link href={`/register${email ? `?email=${encodeURIComponent(email)}` : ''}`}>
            <Button variant="primary" size="md" className="whitespace-nowrap w-full sm:w-auto shadow-lg shadow-fabric-900/40">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <p className="text-xs text-gray-600 mb-12">
          No credit card required · Free tier includes 10 generations/month
        </p>

        {/* Social proof */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center">
            {AVATARS.map(({ initials, color, name }, i) => (
              <div
                key={name}
                className={`relative h-9 w-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-xs font-bold text-white border-2 border-gray-950 ${
                  i !== 0 ? '-ml-2.5' : ''
                }`}
                title={name}
              >
                {initials}
              </div>
            ))}
            {/* +count avatar */}
            <div className="relative h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 border-2 border-gray-950 -ml-2.5">
              +9K
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Join{' '}
            <span className="text-gray-300 font-medium">Sarah, Mike, Aisha</span>
            {' '}and{' '}
            <span className="text-gray-300 font-medium">9,997 others</span>
            {' '}already creating
          </p>
        </div>
      </div>
    </section>
  )
}
