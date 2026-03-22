'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const DESIGN_CARDS = [
  {
    gradient: 'from-purple-600 via-violet-500 to-indigo-600',
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.06) 4px, rgba(255,255,255,0.06) 8px)',
    label: 'Geometric',
    delay: '0ms',
  },
  {
    gradient: 'from-rose-500 via-pink-400 to-fuchsia-500',
    pattern: 'repeating-linear-gradient(135deg, transparent, transparent 3px, rgba(255,255,255,0.07) 3px, rgba(255,255,255,0.07) 9px)',
    label: 'Floral',
    delay: '100ms',
  },
  {
    gradient: 'from-amber-500 via-orange-400 to-yellow-500',
    pattern: 'repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(255,255,255,0.05) 5px, rgba(255,255,255,0.05) 10px)',
    label: 'Vintage',
    delay: '200ms',
  },
  {
    gradient: 'from-emerald-500 via-teal-400 to-cyan-500',
    pattern: 'repeating-linear-gradient(60deg, transparent, transparent 4px, rgba(255,255,255,0.06) 4px, rgba(255,255,255,0.06) 8px)',
    label: 'Modern',
    delay: '150ms',
  },
  {
    gradient: 'from-textile-500 via-textile-400 to-fabric-500',
    pattern: 'repeating-linear-gradient(30deg, transparent, transparent 3px, rgba(255,255,255,0.07) 3px, rgba(255,255,255,0.07) 6px)',
    label: 'Abstract',
    delay: '250ms',
  },
  {
    gradient: 'from-blue-500 via-sky-400 to-cyan-400',
    pattern: 'repeating-linear-gradient(120deg, transparent, transparent 5px, rgba(255,255,255,0.05) 5px, rgba(255,255,255,0.05) 10px)',
    label: 'Minimal',
    delay: '50ms',
  },
]

const STATS = [
  { value: '10,000+', label: 'Designs Generated' },
  { value: '500+', label: 'Unique Styles' },
  { value: '50+', label: 'Countries' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 pb-16 px-4">
      {/* Animated background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[500px] bg-fabric-600/15 rounded-full blur-[130px] animate-pulse-slow" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-textile-500/12 rounded-full blur-[110px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative mx-auto max-w-7xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text + CTA */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-fabric-500/30 bg-fabric-500/10 px-4 py-1.5 text-sm text-fabric-300 mb-8 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by Advanced AI
            </div>

            <h1 className="font-display text-5xl sm:text-6xl xl:text-7xl font-bold leading-tight mb-6 animate-slide-up">
              <span className="text-white">Design the Future</span>
              <br />
              <span className="text-white">of </span>
              <span className="bg-gradient-to-r from-textile-400 via-fabric-400 to-purple-400 bg-clip-text text-transparent">
                Textiles with AI
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
              Transform your creative vision into stunning textile patterns. Describe what you want,
              choose your style, and get production-ready fabric designs in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link href="/register">
                <Button variant="primary" size="lg" className="text-base px-8 shadow-2xl shadow-fabric-900/50 group">
                  Generate Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/gallery">
                <Button variant="secondary" size="lg" className="text-base px-8">
                  View Gallery
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-textile-400 to-fabric-500" />
                  <span className="text-white font-semibold text-sm">{value}</span>
                  <span className="text-gray-500 text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Animated Design Preview Grid */}
          <div className="relative lg:pl-8">
            <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-5 shadow-2xl shadow-black/50">
              {/* Grid header */}
              <div className="flex items-center gap-1.5 mb-4">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-gray-500 font-mono">ai-textile-studio</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {DESIGN_CARDS.map(({ gradient, pattern, label, delay }) => (
                  <div
                    key={label}
                    className="group relative rounded-xl overflow-hidden aspect-square cursor-pointer animate-float"
                    style={{ animationDelay: delay }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-300 group-hover:scale-110`}
                      style={{ backgroundImage: pattern }}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end p-2">
                      <span className="text-xs font-medium text-white/0 group-hover:text-white/90 transition-all duration-300 bg-black/40 rounded-md px-2 py-0.5">
                        {label}
                      </span>
                    </div>
                    {/* Glow ring on hover */}
                    <div className={`absolute inset-0 rounded-xl ring-0 group-hover:ring-2 ring-white/30 transition-all duration-300`} />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-600">AI-generated patterns</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400">Live preview</span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 rounded-xl border border-white/10 bg-gray-900/90 backdrop-blur-md px-3 py-2 shadow-xl animate-float" style={{ animationDelay: '500ms' }}>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-textile-500 to-fabric-600">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">New design ready</div>
                  <div className="text-xs text-gray-500">0.3s generation time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-600 animate-bounce">
        <span className="text-xs">Scroll to explore</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </section>
  )
}
