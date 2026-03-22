import Link from 'next/link'
import { Sparkles } from 'lucide-react'

const LINKS = {
  Product: [
    { label: 'Generate', href: '/generate' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Upload', href: '/upload' },
    { label: 'Collections', href: '/collections' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-textile-500 to-fabric-600 shadow-lg shadow-fabric-900/40 group-hover:shadow-fabric-700/40 transition-all">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-semibold bg-gradient-to-r from-textile-300 to-fabric-400 bg-clip-text text-transparent">
                TextileAI
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              The most powerful AI platform for textile and fabric design. Create stunning patterns in seconds.
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-gray-600 hover:text-gray-300 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-700">
            &copy; {new Date().getFullYear()} TextileAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-700">Made with</span>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs text-gray-600">and AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
