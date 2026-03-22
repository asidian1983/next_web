import type { Metadata } from 'next'
import { HeroSection } from '@/components/demo/HeroSection'
import { AIExperienceSection } from '@/components/demo/AIExperienceSection'
import { TrendingSection } from '@/components/demo/TrendingSection'
import { FeaturesSection } from '@/components/demo/FeaturesSection'
import { CTASection } from '@/components/demo/CTASection'
import { Footer } from '@/components/demo/Footer'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'Textile AI — Generate Stunning Fabric Designs with AI',
  description:
    'Create unique textile patterns and fabric designs instantly with AI. Upload, generate, and share beautiful designs.',
  openGraph: {
    title: 'Textile AI Platform',
    description:
      'Create unique textile patterns and fabric designs instantly with AI. Upload, generate, and share beautiful designs.',
    type: 'website',
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 bg-grid">
      <Header />
      <main>
        <HeroSection />
        <AIExperienceSection />
        <TrendingSection />
        <FeaturesSection />
        <CTASection />
        <Footer />
      </main>
    </div>
  )
}
