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

export default function Dashboard() {
  const [counselors] = useState<Counselor[]>(COUNSELORS)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="border-b border-border bg-card sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-OGfdWEWq236e8EPK5HhGW8ckUQaqXU.png" alt="Parth Gautam Foundation" className="h-10" />
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
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">AI Counselors</h2>
          <p className="text-muted-foreground mb-8">Select a counselor to begin your career consultation</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {counselors.map((counselor) => (
              <div
                key={counselor.id}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300"
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
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {counselor.name}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-3">
                    {counselor.specialization}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                    {counselor.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={`/chat/new?counselor=${counselor.id}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-primary/30 text-primary hover:bg-primary/5"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                    </Link>
                    <Link
                      href={`/voice/new?counselor=${counselor.id}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-primary/30 text-primary hover:bg-primary/5"
                      >
                        <Headphones className="w-4 h-4 mr-2" />
                        Call
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
