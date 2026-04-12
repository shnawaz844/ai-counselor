'use client'

import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Brain, LogOut } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

export default function ProfilePage() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-foreground">CareerGuidance AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                History
              </Button>
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">Profile Settings</h1>

        <div className="max-w-2xl space-y-6">
          {/* User Information */}
          <div className="bg-background rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Full Name</label>
                <div className="px-4 py-2 bg-muted rounded text-foreground">
                  {user?.fullName || 'Not set'}
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Email</label>
                <div className="px-4 py-2 bg-muted rounded text-foreground">
                  {user?.emailAddresses[0]?.emailAddress || 'Not set'}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-background rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Preferred Communication</label>
                <select className="w-full px-4 py-2 bg-muted text-foreground rounded border border-border">
                  <option>Both Chat and Voice</option>
                  <option>Chat Only</option>
                  <option>Voice Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Grade/Year</label>
                <select className="w-full px-4 py-2 bg-muted text-foreground rounded border border-border">
                  <option>Select your grade...</option>
                  <option>10th</option>
                  <option>11th</option>
                  <option>12th</option>
                  <option>First Year (College)</option>
                  <option>Second Year (College)</option>
                  <option>Parent/Guardian</option>
                </select>
              </div>
            </div>
          </div>

          {/* Voice Recording Settings */}
          <div className="bg-background rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Voice Call Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Auto-save transcriptions</span>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Keep call recordings</span>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Save Changes
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" className="border-border">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
