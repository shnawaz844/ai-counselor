'use client'

import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Send, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useChat } from '@ai-sdk/react'

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
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Engineer',
  },
  {
    id: '2',
    name: 'Medical & Healthcare Counselor',
    specialization: 'Medical, Healthcare, Pharmacy',
    description: 'Guidance for NEET, medical colleges, and healthcare careers',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Doctor',
  },
  {
    id: '3',
    name: 'Commerce & Business Specialist',
    specialization: 'Commerce, Business, Finance',
    description: 'Career guidance for commerce streams and business management',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Commerce',
  },
  {
    id: '4',
    name: 'Arts & Humanities Guide',
    specialization: 'Arts, Humanities, Social Sciences',
    description: 'Guidance for liberal arts, social sciences, and humanities',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arts',
  },
  {
    id: '5',
    name: 'Computer Science Expert',
    specialization: 'CS, AI, Software Development',
    description: 'Comprehensive guidance for computer science and AI careers',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CS',
  },
  {
    id: '6',
    name: 'Entrepreneurship Coach',
    specialization: 'Entrepreneurship, Startups, Business',
    description: 'Guidance for aspiring entrepreneurs and startup founders',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Startup',
  },
]

function ChatContent() {
  const searchParams = useSearchParams()
  const counselorId = searchParams.get('counselor')
  const [counselor, setCounselor] = useState<Counselor | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<any[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your career counselor. How can I help you with your career planning today?',
      createdAt: new Date()
    }
  ])

  useEffect(() => {
    if (counselorId) {
      const found = COUNSELORS.find((c) => c.id === counselorId)
      setCounselor(found || null)
    }
  }, [counselorId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = { id: Date.now().toString(), role: 'user', content: input, createdAt: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], counselorId })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'API Error');
      }
      
      const rawText = await res.text()
      // Optional: Clean up Vercel Data Stream prefixes if they exist (e.g., `0:"..."\n`)
      let cleanText = rawText
      if (rawText.startsWith('0:')) {
        try {
          cleanText = JSON.parse(rawText.substring(2).trim())
        } catch (e) {
          console.error("Failed to parse AI response:", e);
        }
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cleanText,
        createdAt: new Date()
      }])
    } catch (err: any) {
      console.error(err)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: err.message === 'API Error' 
          ? "I'm sorry, I encountered an error connecting to my server. Please try again."
          : `I'm sorry, I encountered an error: ${err.message}`,
        createdAt: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)

  if (!counselor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Loading counselor...</p>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-primary/30 bg-card/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30">
                <Image
                  src={counselor.avatar_url}
                  alt={counselor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">{counselor.name}</h1>
                <p className="text-sm text-muted-foreground">{counselor.specialization}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-md px-6 py-4 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none shadow-lg shadow-primary/50'
                    : 'bg-card border border-primary/20 text-foreground rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border border-primary/20 text-foreground px-6 py-4 rounded-lg rounded-bl-none">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-primary/30 bg-card/95 backdrop-blur sticky bottom-0">
        <div className="max-w-4xl mx-auto px-6 py-4 w-full">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input || ""}
              onChange={handleInputChange}
              placeholder="Type your question here..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted bg-background text-foreground placeholder-muted-foreground"
            />
            <Button
              type="submit"
              disabled={isLoading || !(input || "").trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 shadow-lg hover:shadow-[0_0_20px_rgba(0,255,159,0.4)]"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </footer>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ChatContent />
    </Suspense>
  )
}
