'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

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

          {/* Right: Spline 3D Interactive */}
          <div className="relative lg:pl-8">
            <div className="relative rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50" style={{ height: '500px' }}>
              <iframe
                src="https://my.spline.design/boxeshover-owt6mJfKfrEtuxEuXtS0K5VC/"
                width="100%"
                height="100%"
                title="3D Interactive Preview"
              />
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
