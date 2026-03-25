'use client'

import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Brain, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ChatHistory {
  id: string
  counselor_name: string
  created_at: string
  message_count: number
}

interface VoiceCall {
  id: string
  counselor_name: string
  created_at: string
  duration: number
}

export default function HistoryPage() {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [voiceHistory, setVoiceHistory] = useState<VoiceCall[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load history from API
    setLoading(false)
  }, [])

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white">CareerGuidance AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Dashboard
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Profile
              </Button>
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Consultation History</h1>

        <Tabs defaultValue="chats" className="w-full">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="chats" className="text-slate-300 data-[state=active]:text-white">
              Text Chats
            </TabsTrigger>
            <TabsTrigger value="voice" className="text-slate-300 data-[state=active]:text-white">
              Voice Calls
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="mt-6">
            {chatHistory.length === 0 ? (
              <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-slate-400 mb-4">No chat conversations yet</p>
                <Link href="/dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Start Your First Chat
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center justify-between hover:border-blue-500 transition"
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{chat.counselor_name}</h3>
                      <p className="text-sm text-slate-400">
                        {chat.message_count} messages • {new Date(chat.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/chat/${chat.id}`}>
                        <Button size="sm" variant="outline" className="border-slate-600">
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setChatHistory(chatHistory.filter((c) => c.id !== chat.id))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="voice" className="mt-6">
            {voiceHistory.length === 0 ? (
              <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-slate-400 mb-4">No voice calls yet</p>
                <Link href="/dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Schedule Your First Call
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {voiceHistory.map((call) => (
                  <div
                    key={call.id}
                    className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center justify-between hover:border-blue-500 transition"
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{call.counselor_name}</h3>
                      <p className="text-sm text-slate-400">
                        Duration: {Math.floor(call.duration / 60)}m • {new Date(call.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/voice/${call.id}`}>
                        <Button size="sm" variant="outline" className="border-slate-600">
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setVoiceHistory(voiceHistory.filter((c) => c.id !== call.id))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
