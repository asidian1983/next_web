import Link from 'next/link'
import { Sparkles, Zap, Palette, Download, ArrowRight, CheckCircle } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Generation',
    description:
      'Describe your vision in plain language and watch our AI transform it into stunning textile patterns.',
  },
  {
    icon: Palette,
    title: '8+ Design Styles',
    description:
      'From geometric precision to flowing florals, choose from a wide range of artistic styles to match your aesthetic.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Get your designs generated in seconds. No waiting, no delays — just instant creative output.',
  },
  {
    icon: Download,
    title: 'High-Resolution Export',
    description:
      'Download your designs in high resolution, ready for print, production, or digital use.',
  },
]

const plans = [
  'Unlimited design generation',
  'All 8 design styles',
  'Up to 2048×2048 resolution',
  'Download in PNG format',
  'Design history & library',
  'API access',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 bg-grid">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-fabric-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-textile-500/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-fabric-500/30 bg-fabric-500/10 px-4 py-1.5 text-sm text-fabric-300 mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Advanced AI
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="text-white">Design textiles</span>
            <br />
            <span className="bg-gradient-to-r from-textile-300 via-fabric-400 to-fabric-300 bg-clip-text text-transparent">
              with AI magic
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Transform your creative vision into stunning textile patterns. Describe what you want,
            choose your style, and let AI generate production-ready fabric designs in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg" className="text-base px-8 py-3.5 shadow-2xl shadow-fabric-900/50">
                Start creating for free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="text-base px-8 py-3.5">
                Sign in
              </Button>
            </Link>
          </div>

          {/* Hero visual */}
          <div className="mt-16 relative">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm p-1 shadow-2xl shadow-black/50">
              <div className="rounded-xl overflow-hidden bg-gray-950 aspect-video flex items-center justify-center">
                <div className="grid grid-cols-4 gap-3 p-8 w-full h-full">
                  {[
                    'from-purple-800 to-indigo-900',
                    'from-amber-700 to-orange-900',
                    'from-emerald-700 to-teal-900',
                    'from-rose-700 to-pink-900',
                    'from-blue-700 to-cyan-900',
                    'from-textile-600 to-fabric-800',
                    'from-yellow-600 to-amber-800',
                    'from-red-700 to-rose-900',
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className={`rounded-lg bg-gradient-to-br ${gradient} aspect-square opacity-80 hover:opacity-100 transition-opacity duration-300`}
                      style={{
                        backgroundImage: `repeating-linear-gradient(
                          ${45 + i * 22}deg,
                          transparent,
                          transparent ${4 + i}px,
                          rgba(255,255,255,0.05) ${4 + i}px,
                          rgba(255,255,255,0.05) ${8 + i * 2}px
                        )`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
              AI-generated textile patterns
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 border-t border-gray-800/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Everything you need to design
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Professional-grade AI tools built specifically for textile and fabric design.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-xl border border-gray-800 bg-gray-900/40 p-6 hover:border-gray-700 hover:bg-gray-900/70 transition-all duration-300"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-textile-500/20 to-fabric-600/20 border border-fabric-500/20 group-hover:from-textile-500/30 group-hover:to-fabric-600/30 transition-all duration-300">
                  <Icon className="h-5 w-5 text-fabric-400" />
                </div>
                <h3 className="font-semibold text-gray-100 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section className="py-24 px-4 border-t border-gray-800/50">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-950 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-textile-500/30 bg-textile-500/10 px-3 py-1 text-xs text-textile-300 mb-6">
                  Free to get started
                </div>
                <h2 className="font-display text-3xl font-bold text-white mb-4">
                  Start designing today
                </h2>
                <p className="text-gray-400 mb-8">
                  No credit card required. Create an account and start generating beautiful textile
                  patterns immediately.
                </p>
                <Link href="/register">
                  <Button variant="primary" size="lg" className="shadow-xl shadow-fabric-900/40">
                    Create free account
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="p-10 bg-gray-900/50 border-l border-gray-800">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-6">
                  What&apos;s included
                </h3>
                <ul className="space-y-3">
                  {plans.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="text-sm text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8 px-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-textile-500 to-fabric-600">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="font-display text-sm font-semibold text-gray-400">TextileAI</span>
          </div>
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} TextileAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
