'use client'

export default function TestPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="text-center text-white max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Test Page</h1>
        <p className="text-xl text-slate-300 mb-8">CareerGuidance AI Platform</p>
        
        <div className="bg-slate-800 p-6 rounded-lg mb-8 text-left">
          <p className="mb-4 text-slate-300">This is a test page to verify the application is loading correctly.</p>
          <p className="mb-2"><strong>App Status:</strong> Running</p>
          <p className="mb-2"><strong>Framework:</strong> Next.js 16</p>
          <p className="mb-2"><strong>UI Library:</strong> shadcn/ui + TailwindCSS</p>
        </div>

        <div className="space-y-4">
          <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mr-4">
            Back to Home
          </a>
          <a href="/dashboard" className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
