'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MessageSquare, Headphones, ChevronDown, Menu } from 'lucide-react'
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
    avatar_url: '/counselors/male3.png',
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
    avatar_url: '/counselors/cs.png',
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
    avatar_url: '/counselors/male4.png',
  },
]

export default function HomePage() {
  const [counselors] = useState<Counselor[]>(COUNSELORS)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const counselorsRef = useRef<HTMLDivElement>(null)

  const scrollToCounselors = () => {
    counselorsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-emerald-500/30">
      {/* Premium modern Animated background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[30%] right-[-10%] w-[40%] h-[60%] bg-teal-400/5 blur-[150px] rounded-full mix-blend-multiply" />
      </div>

      {/* Navigationsssss */}
      <nav className="fixed top-0 w-full border-b border-border bg-background/80 backdrop-blur-xl z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition group z-50">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-card rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover:scale-105 transition-transform border border-border/50">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-OGfdWEWq236e8EPK5HhGW8ckUQaqXU.png" alt="Parth Gautam Foundation" className="w-full h-full object-contain p-1.5" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-extrabold text-sm sm:text-base md:text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">PARTH GAUTAM</div>
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest font-medium">AI Career Guide</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/history">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full px-5 font-semibold transition-colors">
                History
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full px-5 font-semibold transition-colors">
                Profile
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-neutral-300 hover:text-white z-50 transition-transform active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl py-4 px-6 flex flex-col gap-3 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          <Link href="/history" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted h-12 rounded-xl text-base font-medium">
              History
            </Button>
          </Link>
          <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted h-12 rounded-xl text-base font-medium">
              Profile
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Landing Section */}
      <section className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden pt-20">
        {/* Background Images with better modern scaling */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            {/* Desktop Image */}
            <div className="hidden md:block absolute top-20 inset-x-0 bottom-0 opacity-80">
              <Image
                src="/parth-gautam-umesh-gautam.png"
                alt="AI Career Guidance - Parth Gautam"
                fill
                priority
                className="object-cover object-top"
              />
            </div>
            {/* Mobile Image */}
            <div className="block md:hidden absolute top-20 inset-x-0 bottom-0 opacity-100">
              <Image
                src="/hero-mobile.jpg"
                alt="AI Career Guidance - Parth Gautam Mobile"
                fill
                priority
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-black/30 md:hidden" />
            </div>
            {/* Hero images with full visibility */}

          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center mt-[-5dvh]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-lg backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            AI-Powered Career Guidance
          </div>

          <h1 className="text-5xl md:text-5xl lg:text-5xl font-extrabold text-white md:text-foreground mb-6 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Talk to AI Counselors.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Shape Your Future.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-200 md:text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-10 delay-200 duration-700 font-medium">
            Get instant, personalized career guidance and clarity with our intelligent AI support system. Free and accessible to everyone.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 delay-300 duration-700">
            <Button
              onClick={scrollToCounselors}
              size="lg"
              className="px-8 py-7 text-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-full group transition-all duration-300 shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] hover:-translate-y-1"
            >
              Start Your Journey
              <ChevronDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main ref={counselorsRef} className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        {/* Welcome Section */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Welcome to Parth Gautam Foundation
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Choose an AI counselor to get personalized career guidance tailored exactly to your strengths. Start with an insightful chat or a real-time voice consultation.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Expert Counselors", value: "6+" },
              { label: "Available for Guidance", value: "24/7" },
              { label: "100% Accessible", value: "Free" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-card backdrop-blur-sm border border-border rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-muted/50 hover:border-emerald-500/30 transition-all duration-300 group">
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Counselors Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Select Your Counselor</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {counselors.map((counselor) => (
              <div
                key={counselor.id}
                className="group flex flex-col bg-card border border-border rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative h-56 md:h-64 bg-neutral-800 overflow-hidden shrink-0">
                  <Image
                    src={counselor.avatar_url}
                    alt={counselor.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 group-hover:rotate-1 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-90" />

                  {/* Floating specialty badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-neutral-950/70 backdrop-blur-md rounded-full border border-white/10 text-xs font-semibold text-emerald-300">
                    {counselor.specialization.split(',')[0]}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-emerald-400 transition-colors">{counselor.name}</h3>
                  <p className="text-sm font-medium text-emerald-500/80 mb-4">{counselor.specialization}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-8 flex-1">
                    {counselor.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                    <Link href={`/chat/new?counselor=${counselor.id}`} className="flex-1">
                      <Button
                        size="default"
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold gap-2 h-12 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300"
                      >
                        <MessageSquare className="w-5 h-5" />
                        Chat Now
                      </Button>
                    </Link>
                    <Link href={`/voice/new?counselor=${counselor.id}`} className="flex-1">
                      <Button
                        size="default"
                        variant="outline"
                        className="w-full bg-background border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-black text-emerald-600 gap-2 h-12 rounded-xl transition-all duration-300"
                      >
                        <Headphones className="w-5 h-5" />
                        Voice Call
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
