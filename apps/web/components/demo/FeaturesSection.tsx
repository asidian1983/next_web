import { Sparkles, Upload, FolderOpen, Zap, Lock, Globe } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    emoji: '✨',
    color: 'from-textile-500/20 to-fabric-600/20 border-fabric-500/20',
    iconColor: 'text-fabric-400',
    title: 'AI Generation',
    description:
      'Describe any textile pattern in natural language and watch AI bring your vision to life instantly.',
  },
  {
    icon: Upload,
    emoji: '📤',
    color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/20',
    iconColor: 'text-emerald-400',
    title: 'Upload & Tag',
    description:
      'Upload your own designs — AI automatically tags them with style, color, and pattern metadata.',
  },
  {
    icon: FolderOpen,
    emoji: '🗂️',
    color: 'from-amber-500/20 to-orange-600/20 border-amber-500/20',
    iconColor: 'text-amber-400',
    title: 'Collections',
    description:
      'Organize your designs into curated collections for easy browsing and client presentations.',
  },
  {
    icon: Zap,
    emoji: '⚡',
    color: 'from-yellow-500/20 to-amber-600/20 border-yellow-500/20',
    iconColor: 'text-yellow-400',
    title: 'Instant Results',
    description:
      'Generate production-ready designs in seconds with real-time preview as your prompt takes shape.',
  },
  {
    icon: Lock,
    emoji: '🔒',
    color: 'from-blue-500/20 to-indigo-600/20 border-blue-500/20',
    iconColor: 'text-blue-400',
    title: 'Secure & Private',
    description:
      'Your designs are private by default. Share only what you choose, when you choose.',
  },
  {
    icon: Globe,
    emoji: '🌐',
    color: 'from-pink-500/20 to-rose-600/20 border-pink-500/20',
    iconColor: 'text-rose-400',
    title: 'Share & Inspire',
    description:
      'Make designs public and inspire a global community of textile designers and creators.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-28 px-4 border-t border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-fabric-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-textile-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-fabric-500/30 bg-fabric-500/10 px-4 py-1.5 text-sm text-fabric-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Everything you need
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Built for serious{' '}
            <span className="bg-gradient-to-r from-textile-400 to-purple-400 bg-clip-text text-transparent">
              designers
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Professional-grade AI tools purpose-built for textile and fabric design workflows.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, color, iconColor, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-default"
            >
              <div
                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} border transition-all duration-300 group-hover:scale-110`}
              >
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <h3 className="font-semibold text-gray-100 mb-2 text-base">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
