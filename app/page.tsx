'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Zap, Users, Sparkles, Code2, Briefcase, Rocket } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 159, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 159, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-primary/30 bg-background/70 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition group">
            <div className="relative">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-OGfdWEWq236e8EPK5HhGW8ckUQaqXU.png" alt="Parth Gautam Foundation" className="h-12" />
              <div className="absolute inset-0 rounded-lg blur opacity-0 group-hover:opacity-100 transition" style={{ boxShadow: '0 0 20px rgba(0, 255, 159, 0.3)' }} />
            </div>
            <div className="hidden sm:block">
              <div className="font-black text-sm text-primary">PARTH GAUTAM</div>
              <div className="text-xs text-muted-foreground">AI Career Guide</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-foreground hover:text-primary border border-primary/30 hover:border-primary/60">
                Explore
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-[0_0_20px_rgba(0,255,159,0.5)]">
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl mb-12">
            <div className="inline-block mb-6 px-4 py-2 border border-primary/50 text-primary rounded-full text-sm font-semibold backdrop-blur-sm bg-primary/5">
              ✨ Next Generation Career Guidance
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">
              Your AI <span className="text-primary" style={{ textShadow: '0 0 20px rgba(0, 255, 159, 0.6)' }}>Career</span> Mentor
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-3xl leading-relaxed font-light">
              Powered by advanced AI counselors. Get personalized guidance for Engineering, Medical, Commerce, Arts, Computer Science, and Entrepreneurship careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg hover:shadow-[0_0_30px_rgba(0,255,159,0.6)] font-semibold">
                  Start Consulting <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 font-semibold">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid md:grid-cols-4 gap-4 mt-20 pt-12 border-t border-primary/20">
            {[
              { label: 'Expert Counselors', value: '6+' },
              { label: 'Students Guided', value: '10K+' },
              { label: 'Success Rate', value: '98%' },
              { label: '24/7 Available', value: 'Always' },
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="text-3xl font-black text-primary mb-1 group-hover:drop-shadow-[0_0_10px_rgba(0,255,159,0.6)] transition">
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-center">Why Choose Us</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            The future of career guidance is here
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: Sparkles, 
                title: 'AI-Powered Experts', 
                desc: 'Advanced AI counselors specialized in every field' 
              },
              { 
                icon: Zap, 
                title: 'Instant Guidance', 
                desc: 'Real-time chat and voice consultations' 
              },
              { 
                icon: Users, 
                title: 'Personalized Path', 
                desc: 'Tailored career roadmaps for your goals' 
              },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group p-8 border border-primary/30 rounded-2xl hover:border-primary/60 transition duration-300 bg-gradient-to-br from-card to-card/50 hover:shadow-[0_0_30px_rgba(0,255,159,0.2)]"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/30 transition">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Counselors Section */}
      <section className="py-24 px-6 border-t border-primary/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-center">Meet Your Counselors</h2>
          <p className="text-center text-muted-foreground mb-16">Specialized AI experts ready to guide you</p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { field: 'Engineering & Tech', icon: Code2 },
              { field: 'Medical & Healthcare', icon: Sparkles },
              { field: 'Commerce & Business', icon: Briefcase },
              { field: 'Arts & Humanities', icon: Users },
              { field: 'Computer Science & AI', icon: Code2 },
              { field: 'Entrepreneurship', icon: Rocket },
            ].map((counselor, i) => (
              <div 
                key={i} 
                className="group p-6 border border-primary/30 rounded-xl bg-gradient-to-br from-card to-card/50 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(0,255,159,0.2)] transition duration-300"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/20 mb-4 flex items-center justify-center group-hover:bg-primary/30 transition">
                  <counselor.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{counselor.field}</h3>
                <p className="text-sm text-muted-foreground">Expert-driven guidance</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg hover:shadow-[0_0_30px_rgba(0,255,159,0.6)]">
                Explore All Counselors <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto border border-primary/40 rounded-2xl p-12 text-center bg-gradient-to-br from-primary/10 to-card relative overflow-hidden group hover:border-primary/60 transition">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300" style={{
            boxShadow: '0 0 40px rgba(0, 255, 159, 0.2) inset'
          }} />
          <h2 className="text-4xl font-black mb-4 relative z-10">Ready to Transform Your Future?</h2>
          <p className="text-lg text-muted-foreground mb-8 relative z-10">
            Join thousands of students guided by AI Career Counselors
          </p>
          <Link href="/dashboard" className="relative z-10 inline-block">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-[0_0_30px_rgba(0,255,159,0.6)]">
              Start Your Journey Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-card/30 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-OGfdWEWq236e8EPK5HhGW8ckUQaqXU.png" alt="Parth Gautam Foundation" className="h-10 mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering Indian students with AI-driven career guidance.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-primary">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-primary transition">Dashboard</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition">Counselors</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-primary">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition">About</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-primary">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition">Privacy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary/20 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Parth Gautam Foundation. Next Gen Career Guidance.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
