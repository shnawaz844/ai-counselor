'use client'

import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Mic, MicOff, PhoneOff, Copy, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Transcription {
  id: string
  speaker: 'user' | 'counselor'
  text: string
  timestamp: number
}

interface Counselor {
  id: string
  name: string
  specialization: string
  avatar_url: string
}

const COUNSELORS: Counselor[] = [
  {
    id: '1',
    name: 'Engineering Career Advisor',
    specialization: 'Engineering, Technology, IT',
    avatar_url: '/counselors/engineering.jpg',
  },
  {
    id: '2',
    name: 'Medical & Healthcare Counselor',
    specialization: 'Medical, Healthcare, Pharmacy',
    avatar_url: '/counselors/medical.jpg',
  },
  {
    id: '3',
    name: 'Commerce & Business Specialist',
    specialization: 'Commerce, Business, Finance',
    avatar_url: '/counselors/commerce.jpg',
  },
  {
    id: '4',
    name: 'Arts & Humanities Guide',
    specialization: 'Arts, Humanities, Social Sciences',
    avatar_url: '/counselors/arts.jpg',
  },
  {
    id: '5',
    name: 'Computer Science Expert',
    specialization: 'CS, AI, Software Development',
    avatar_url: '/counselors/cs.jpg',
  },
  {
    id: '6',
    name: 'Entrepreneurship Coach',
    specialization: 'Entrepreneurship, Startups, Business',
    avatar_url: '/counselors/entrepreneurship.jpg',
  },
]

function VoiceCallContent() {
  const searchParams = useSearchParams()
  const counselorId = searchParams.get('counselor')
  const [counselor, setCounselor] = useState<Counselor | null>(null)
  const [callStatus, setCallStatus] = useState<'connecting' | 'active' | 'ended'>('connecting')
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([
    {
      id: '1',
      speaker: 'counselor',
      text: 'Hello! Welcome to our voice consultation. How can I help you with your career planning today?',
      timestamp: 0,
    },
  ])

  useEffect(() => {
    if (counselorId) {
      const found = COUNSELORS.find((c) => c.id === counselorId)
      setCounselor(found || null)
    }
  }, [counselorId])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callStatus === 'active') {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callStatus])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (callStatus === 'connecting') {
        setCallStatus('active')
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [callStatus])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleEndCall = () => {
    setCallStatus('ended')
  }

  const handleCopyTranscript = () => {
    const text = transcriptions.map((t) => `[${t.speaker}] ${t.text}`).join('\n')
    navigator.clipboard.writeText(text)
  }

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
      {/* Header */}
      <header className="border-b border-border bg-card/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Call Duration</p>
            <p className="text-2xl font-bold text-foreground">{formatDuration(duration)}</p>
          </div>
          <Button
            onClick={handleEndCall}
            disabled={callStatus === 'ended'}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-2"
          >
            <PhoneOff className="w-4 h-4" />
            End Call
          </Button>
        </div>
      </header>

      <div className="flex-1 flex gap-6 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Video/Counselor Panel */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-card border-2 border-border rounded-2xl overflow-hidden flex items-center justify-center mb-6">
            {callStatus === 'ended' ? (
              <div className="text-center">
                <p className="text-xl text-foreground mb-2">Call Ended</p>
                <p className="text-sm text-muted-foreground">Duration: {formatDuration(duration)}</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/20">
                  <Image
                    src={counselor.avatar_url}
                    alt={counselor.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{counselor.name}</h2>
                <p className="text-muted-foreground mb-4">{counselor.specialization}</p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => setIsMuted(!isMuted)}
                    className={isMuted ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transcription Panel */}
        <div className="w-96 flex flex-col bg-card border-2 border-border rounded-2xl overflow-hidden">
          <div className="border-b border-border px-6 py-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Live Transcription</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyTranscript}
              className="text-muted-foreground hover:text-foreground"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {transcriptions.map((trans) => (
              <div key={trans.id}>
                <p className={`text-xs font-semibold mb-1 ${trans.speaker === 'user' ? 'text-primary' : 'text-green-600'}`}>
                  {trans.speaker === 'user' ? 'You' : counselor.name}
                </p>
                <p className="text-sm text-foreground leading-relaxed">{trans.text}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDuration(trans.timestamp)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-border px-6 py-3 bg-muted">
            <p className="text-xs text-muted-foreground">
              {callStatus === 'connecting' && 'Connecting...'}
              {callStatus === 'active' && 'Recording transcription...'}
              {callStatus === 'ended' && 'Call ended'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VoiceCallPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <VoiceCallContent />
    </Suspense>
  )
}
