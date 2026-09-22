'use client'

import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef, Suspense } from 'react'
import { Send, Loader2, ArrowLeft, Phone, AlertCircle, Sparkles, KeyRound } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Counselor {
  id: string
  name: string
  specialization: string
  description: string
  avatar_url: string
  suggestions: string[]
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
  isError?: boolean
  isApiKeyError?: boolean
}

const COUNSELORS: Counselor[] = [
  {
    id: '1',
    name: 'Engineering Career Advisor',
    specialization: 'Engineering, Technology, IT',
    description: 'Expert guidance for IIT, NIT, and Bangalore engineering colleges',
    avatar_url: '/counselors/engineering.png',
    suggestions: [
      'Top engineering colleges in Bangalore (RVCE, BMS, PES)',
      'RVCE vs BMSCE vs PES University comparison',
      'KCET & COMEDK cutoff ranks for B.Tech CSE',
    ],
  },
  {
    id: '2',
    name: 'Medical & Healthcare Counselor',
    specialization: 'Medical, Healthcare, Pharmacy',
    description: 'Guidance for NEET, medical colleges, and healthcare careers in Bangalore',
    avatar_url: '/counselors/medical.jpg',
    suggestions: [
      'Top MBBS colleges in Bangalore (BMCRI, St. John\'s)',
      'Tell me about Ramaiah Medical College & KIMS',
      'Top pharmacy & nursing institutes in Bangalore',
    ],
  },
  {
    id: '3',
    name: 'Commerce & Business Specialist',
    specialization: 'Commerce, Business, Finance',
    description: 'Career guidance for commerce streams, BBA, and MBA in Bangalore',
    avatar_url: '/counselors/commerce.jpg',
    suggestions: [
      'Best B.Com & BBA colleges in Bangalore (SJCC, Christ)',
      'Christ University BBA admission process & CUET',
      'Career scope in Bangalore corporate & fintech sector',
    ],
  },
  {
    id: '4',
    name: 'Arts & Humanities Guide',
    specialization: 'Arts, Humanities, Social Sciences',
    description: 'Guidance for liberal arts, social sciences, and law in Bangalore',
    avatar_url: '/counselors/cs.png',
    suggestions: [
      'Top Arts & Humanities colleges in Bangalore',
      'Tell me about NLSIU, St. Joseph\'s & Azim Premji University',
      'Career paths in Psychology, Media & Public Policy',
    ],
  },
  {
    id: '5',
    name: 'Computer Science Expert',
    specialization: 'CS, AI, Software Development',
    description: 'Comprehensive guidance for computer science and AI in Bangalore',
    avatar_url: '/counselors/cs.jpg',
    suggestions: [
      'Best colleges for AI & Data Science in Bangalore',
      'IIIT-B and RVCE Computer Science placements',
      'Bangalore tech ecosystem & internship opportunities',
    ],
  },
  {
    id: '6',
    name: 'Entrepreneurship Coach',
    specialization: 'Entrepreneurship, Startups, Business',
    description: 'Guidance for startup founders and business incubation in Bangalore',
    avatar_url: '/counselors/male4.png',
    suggestions: [
      'Top startup incubators in Bangalore (IIM-B NSRCEL)',
      'How PES University CIE helps student startups',
      'Karnataka K-TECH startup grants and funding',
    ],
  },
]

function ChatContent() {
  const searchParams = useSearchParams()
  const counselorId = searchParams.get('counselor')
  const [counselor, setCounselor] = useState<Counselor | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your career counselor. How can I help you with your career planning and college options today?",
      createdAt: new Date(),
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (counselorId) {
      const found = COUNSELORS.find((c) => c.id === counselorId)
      if (found) {
        setCounselor(found)
        setMessages([
          {
            id: '1',
            role: 'assistant',
            content: `Hello! I am your ${found.name}. I specialize in ${found.specialization}. Ask me anything about top colleges, career paths, degrees, or admissions!`,
            createdAt: new Date(),
          },
        ])
      }
    } else {
      setCounselor(COUNSELORS[0])
    }
  }, [counselorId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const sendMessage = async (messageText: string) => {
    const textToSend = messageText.trim()
    if (!textToSend || isLoading) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          counselorId: counselor?.id || counselorId || '1',
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const errorMsg = errorData.error || 'Server error occurred'
        const isKeyErr = errorData.isApiKeyError || errorMsg.includes('API key') || errorMsg.includes('API_KEY')

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: errorMsg,
            createdAt: new Date(),
            isError: true,
            isApiKeyError: isKeyErr,
          },
        ])
        return
      }

      const rawText = await res.text()
      let cleanText = rawText

      // Clean up Vercel Data Stream prefixes if present (`0:"..."\n`)
      if (rawText.startsWith('0:')) {
        try {
          cleanText = JSON.parse(rawText.substring(2).trim())
        } catch (e) {
          console.error('Failed to parse AI response:', e)
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: cleanText,
          createdAt: new Date(),
        },
      ])
    } catch (err: any) {
      console.error('Chat error:', err)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Unable to connect to counselor service: ${err.message || 'Network error'}`,
          createdAt: new Date(),
          isError: true,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSuggestionClick = (prompt: string) => {
    sendMessage(prompt)
  }

  if (!counselor) {
    return (
      <div className="h-dvh bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground text-sm">Loading counselor profile...</p>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-dvh max-h-dvh w-full bg-background flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-9 px-2.5 rounded-lg border border-transparent hover:border-border"
              >
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>

            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/40 shrink-0 bg-secondary">
                <Image
                  src={counselor.avatar_url}
                  alt={counselor.name}
                  fill
                  className="object-cover"
                  priority
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card" />
              </div>
              <div className="min-w-0">
                <h1 className="font-semibold text-foreground text-sm sm:text-base truncate">
                  {counselor.name}
                </h1>
                <p className="text-xs text-muted-foreground truncate">
                  {counselor.specialization}
                </p>
              </div>
            </div>
          </div>

          {/* Quick link to Voice Call */}
          <Link href={`/voice/new?counselor=${counselor.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-primary/30 hover:border-primary text-primary hover:bg-primary/10 gap-2 shrink-0 font-medium"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Voice Call</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Chat Messages Container */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 scroll-smooth">
        <div className="max-w-4xl mx-auto w-full space-y-5 pb-2">
          {/* Counselor Welcome Banner / Suggestions */}
          {messages.length <= 2 && counselor.suggestions?.length > 0 && (
            <div className="bg-card/60 border border-border/80 rounded-2xl p-4 mb-4 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                Suggested Questions
              </div>
              <div className="flex flex-wrap gap-2">
                {counselor.suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(sug)}
                    disabled={isLoading}
                    className="text-xs sm:text-sm text-left bg-secondary/80 hover:bg-primary/15 hover:border-primary/50 text-foreground border border-border/70 rounded-xl px-3.5 py-2 transition-all duration-150 disabled:opacity-50 active:scale-[0.98]"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => {
            const isUser = msg.role === 'user'

            return (
              <div
                key={msg.id}
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start items-start gap-2.5'}`}
              >
                {!isUser && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border shrink-0 mt-0.5 bg-secondary">
                    <Image
                      src={counselor.avatar_url}
                      alt={counselor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div
                  className={`w-auto max-w-[88%] sm:max-w-[80%] md:max-w-2xl px-4 sm:px-5 py-3 rounded-2xl shadow-sm break-words [overflow-wrap:anywhere] ${
                    isUser
                      ? 'bg-primary text-white rounded-tr-xs shadow-primary/10 ml-auto'
                      : msg.isError
                      ? 'bg-destructive/10 border border-destructive/30 text-destructive-foreground rounded-tl-xs'
                      : 'bg-card border border-border/90 text-foreground rounded-tl-xs'
                  }`}
                >
                  {/* Specialized Error Card */}
                  {msg.isError ? (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-destructive font-medium text-xs sm:text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                          {msg.isApiKeyError
                            ? 'Google Gemini API Key Issue'
                            : 'Counselor Service Error'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words [overflow-wrap:anywhere]">
                        {msg.content}
                      </p>
                      {msg.isApiKeyError && (
                        <div className="pt-2 border-t border-destructive/20 text-xs text-muted-foreground/90 space-y-1">
                          <p className="flex items-center gap-1.5 font-medium text-foreground">
                            <KeyRound className="w-3.5 h-3.5 text-primary" />
                            How to resolve:
                          </p>
                          <ol className="list-decimal list-inside space-y-0.5 pl-1 text-[11px] sm:text-xs">
                            <li>Visit <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-primary underline">Google AI Studio</a> and generate a free API key.</li>
                            <li>Open the project's <code className="bg-secondary px-1 py-0.5 rounded text-primary">.env</code> file.</li>
                            <li>Set <code className="bg-secondary px-1 py-0.5 rounded text-primary">GOOGLE_GENERATIVE_AI_API_KEY=your_key_here</code></li>
                            <li>Restart the development server.</li>
                          </ol>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                      {msg.content}
                    </p>
                  )}

                  <p
                    className={`text-[10px] mt-1.5 select-none ${
                      isUser
                        ? 'text-white/70 text-right'
                        : 'text-muted-foreground text-left'
                    }`}
                  >
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </p>
                </div>
              </div>
            )
          })}

          {/* Typing / Loading indicator */}
          {isLoading && (
            <div className="flex justify-start items-start gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border shrink-0 bg-secondary">
                <Image
                  src={counselor.avatar_url}
                  alt={counselor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-tl-xs flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground animate-pulse">
                  {counselor.name} is thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-1" />
        </div>
      </main>

      {/* Fixed Bottom Input Footer */}
      <footer className="shrink-0 border-t border-border bg-card/95 backdrop-blur-md z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 w-full">
          <form onSubmit={handleSubmit} className="flex gap-2.5 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${counselor.name.split(' ')[0]} a question...`}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-sm sm:text-base border border-border/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:bg-muted bg-background text-foreground placeholder:text-muted-foreground transition-all duration-150"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-5 h-11 rounded-xl shadow-md shadow-primary/20 shrink-0 font-medium transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline mr-1.5">Send</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
          <p className="text-[11px] text-center text-muted-foreground/70 mt-2 truncate">
            Emversity AI Career Counseling • Guidance tailored for Bangalore colleges, tech hubs & career streams
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="h-dvh bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  )
}
