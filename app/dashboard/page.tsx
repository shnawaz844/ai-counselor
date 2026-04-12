'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { MessageSquare, Headphones, ArrowLeft, Zap } from 'lucide-react'
import Image from 'next/image'

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

export default function Dashboard() {
  const [counselors] = useState<Counselor[]>(COUNSELORS)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="border-b border-border bg-card sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition group">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-card rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover:scale-105 transition-transform border border-border/50">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-OGfdWEWq236e8EPK5HhGW8ckUQaqXU.png" alt="Parth Gautam Foundation" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-sm text-foreground hidden sm:block">Career Guide AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
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
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Counselors</p>
                  <p className="text-2xl font-bold text-foreground">{COUNSELORS.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Consultation Modes</p>
                  <p className="text-2xl font-bold text-foreground">2</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">24/7 Availability</p>
                  <p className="text-2xl font-bold text-foreground">Always</p>
                </div>
              </div>
            </div>
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

        {/* CTA Section */}
        <div className="mt-16 bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
          <h3 className="text-3xl font-bold mb-3">Begin Your Career Transformation</h3>
          <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
            Get personalized guidance from expert AI counselors. Choose chat or voice - select your preferred consultation mode.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>&copy; 2024 Parth Gautam Foundation. Empowering students with AI career guidance.</p>
        </div>
      </footer>
    </div>
  )
}
