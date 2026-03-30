'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MessageSquare, Headphones, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useState, useRef } from 'react'

interface Counselor {
  id: string
  name: string
  specialization: string
  description: string
  avatar_url: string
}

const COUNSELORS: Counselor[] = [
  {
    id: '1',
    name: 'Engineering Career Advisor',
    specialization: 'Engineering, Technology, IT',
    description: 'Expert guidance for IIT, NIT, and tech career paths',
    avatar_url: '/counselors/engineering.jpg',
  },
  {
    id: '2',
    name: 'Medical & Healthcare Counselor',
    specialization: 'Medical, Healthcare, Pharmacy',
    description: 'Guidance for NEET, medical colleges, and healthcare careers',
    avatar_url: '/counselors/medical.jpg',
  },
  {
    id: '3',
    name: 'Commerce & Business Specialist',
    specialization: 'Commerce, Business, Finance',
    description: 'Career guidance for commerce streams and business management',
    avatar_url: '/counselors/commerce.jpg',
  },
  {
    id: '4',
    name: 'Arts & Humanities Guide',
    specialization: 'Arts, Humanities, Social Sciences',
    description: 'Guidance for liberal arts, social sciences, and humanities',
    avatar_url: '/counselors/arts.jpg',
  },
  {
    id: '5',
    name: 'Computer Science Expert',
    specialization: 'CS, AI, Software Development',
    description: 'Comprehensive guidance for computer science and AI careers',
    avatar_url: '/counselors/cs.jpg',
  },
  {
    id: '6',
    name: 'Entrepreneurship Coach',
    specialization: 'Entrepreneurship, Startups, Business',
    description: 'Guidance for aspiring entrepreneurs and startup founders',
    avatar_url: '/counselors/entrepreneurship.jpg',
  },
]

export default function HomePage() {
  const [counselors] = useState<Counselor[]>(COUNSELORS)
  const counselorsRef = useRef<HTMLDivElement>(null)

  const scrollToCounselors = () => {
    counselorsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 159, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 159, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-primary/20 bg-background/60 backdrop-blur-xl z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition group">
            <div className="relative">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-OGfdWEWq236e8EPK5HhGW8ckUQaqXU.png" alt="Parth Gautam Foundation" className="h-12" />
              <div className="absolute inset-0 rounded-lg blur opacity-0 group-hover:opacity-100 transition" style={{ boxShadow: '0 0 20px rgba(0, 255, 159, 0.3)' }} />
            </div>
            <div className="hidden sm:block">
              <div className="font-black text-sm text-primary">PARTH GAUTAM</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest text-[10px]">AI Career Guide</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/history">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-primary hover:bg-primary/10 border border-primary/20">
                History
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-primary hover:bg-primary/10 border border-primary/20">
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Landing Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            {/* Desktop Image */}
            <div className="hidden md:block absolute inset-0">
              <Image
                src="/hero-desktop.png"
                alt="AI Career Guidance Platform"
                fill
                priority
                className="object-cover"
              />
            </div>
            {/* Mobile Image */}
            <div className="block md:hidden absolute inset-0">
              <Image
                src="/hero-mobile.jpg"
                alt="AI Career Guidance Platform Mobile"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
          {/* Black Overlay with Opacity */}
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-background z-15" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
            Talk to AI Counselors.<br />
            <span className="text-primary">Shape Your Future.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-10 delay-150 duration-700">
            Get instant career guidance and clarity with intelligent AI support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 delay-300 duration-700">
            <Button
              onClick={scrollToCounselors}
              size="lg"
              className="px-8 py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full group transition-all"
            >
              Start Your Journey
              <ChevronDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 animate-bounce cursor-pointer opacity-80 hover:opacity-100" onClick={scrollToCounselors}>
          {/* <span className="text-xs text-white uppercase tracking-[0.2em] font-medium">Scroll to Explore</span> */}
          <div className="w-px h-12 bg-linear-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* Main Content */}
      <main ref={counselorsRef} className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Welcome to Parth Gautam Foundation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Choose an AI counselor to get personalized career guidance. Start with chat or voice consultation.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition">
              <div className="text-3xl font-black text-primary mb-2">6+</div>
              <p className="text-sm text-muted-foreground">Expert Counselors</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition">
              <div className="text-3xl font-black text-primary mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">Available for Guidance</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition">
              <div className="text-3xl font-black text-primary mb-2">Free</div>
              <p className="text-sm text-muted-foreground">100% Accessible</p>
            </div>
          </div>
        </div>

        {/* Counselors Grid */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-8">Select Your Counselor</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {counselors.map((counselor) => (
              <div
                key={counselor.id}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/60 transition duration-300 hover:shadow-[0_0_30px_rgba(0,255,159,0.2)]"
              >
                {/* Image Container */}
                <div className="relative h-64 bg-muted overflow-hidden">
                  <Image
                    src={counselor.avatar_url}
                    alt={counselor.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{counselor.name}</h3>
                  <p className="text-sm text-primary font-medium mb-3">{counselor.specialization}</p>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed line-clamp-2">
                    {counselor.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link href={`/chat/new?counselor=${counselor.id}`} className="flex-1">
                      <Button
                        size="sm"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-md hover:shadow-[0_0_15px_rgba(0,255,159,0.4)]"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Chat
                      </Button>
                    </Link>
                    <Link href={`/voice/new?counselor=${counselor.id}`} className="flex-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-primary/40 text-primary hover:bg-primary/10 gap-2"
                      >
                        <Headphones className="w-4 h-4" />
                        Voice
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
