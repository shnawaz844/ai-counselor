import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center relative overflow-hidden">
      {/* Dynamic Animated Glows (Matches Landing Page) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-teal-500/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-md p-4">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold py-2 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]',
              card: 'bg-neutral-900/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl',
              headerTitle: 'text-white font-extrabold text-2xl',
              headerSubtitle: 'text-neutral-400 font-medium',
              socialButtonsBlockButton: 'bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl font-semibold transition-all',
              socialButtonsBlockButtonText: 'text-white font-semibold',
              formFieldLabel: 'text-neutral-300 font-semibold',
              formFieldInput: 'bg-neutral-800 border-white/10 text-white rounded-xl focus:ring-emerald-500 focus:border-emerald-500',
              footerActionLink: 'text-emerald-400 hover:text-emerald-300 font-bold',
              identityPreviewText: 'text-white',
              identityPreviewEditButtonIcon: 'text-emerald-400',
              userButtonPopoverActionButtonText: 'text-white',
              dividerLine: 'bg-white/10',
              dividerText: 'text-neutral-500 font-bold uppercase text-xs tracking-widest'
            }
          }}
        />
      </div>
    </div>
  )
}
