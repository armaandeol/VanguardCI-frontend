import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signInWithGoogle, error } = useAuth()

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden px-4">
      {/* Background visual elements */}
      <div className="absolute inset-0 cyber-grid pointer-events-none" />
      <div className="absolute inset-0 cyber-grid-glow pointer-events-none" />
      
      {/* Animated glowing orbs in the background */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-brand-green-500/5 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-emerald-500/5 blur-[150px] animate-float [animation-delay:2s]" />

      <div className="relative w-full max-w-md rounded-2xl border border-oled-border bg-oled-surface/75 p-8 text-center backdrop-blur-xl shadow-glow hover:shadow-glow-strong hover:border-brand-green-500/30 transition-all duration-500 ease-out animate-fade-in-up">
        {/* Glowing top line */}
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-brand-green-500/40 to-transparent" />

        {/* Cyber logo SVG representing Vanguard's AI Core */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-black border border-oled-border shadow-glow relative group">
          {/* Pulsing ring outer */}
          <div className="absolute inset-0 rounded-2xl border border-brand-green-500/40 animate-pulse-glow" />
          
          <svg className="h-10 w-10 text-brand-green-400 relative z-10 transition-transform duration-500 group-hover:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
            <circle cx="12" cy="9.5" r="2.5" className="animate-pulse" fill="currentColor" fillOpacity="0.2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.5m-4.5 0a4.5 4.5 0 109 0 4.5 4.5 0 10-9 0" />
          </svg>
        </div>

        <h1 className="mt-6 font-heading text-3xl font-bold tracking-tight text-white">
          Vanguard
        </h1>
        <p className="mt-2 text-sm text-oled-textMuted font-sans">
          Next-generation AI code reviews, automated.
        </p>

        {/* Visual code stream indicator */}
        <div className="my-6 rounded-lg border border-oled-border bg-black/60 p-3 text-left font-mono text-[10px] text-brand-green-400/80 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
          <div className="flex justify-between items-center text-oled-textMuted border-b border-oled-border pb-1.5 mb-1.5 font-sans">
            <span>vanguard_core.sh</span>
            <span className="h-2 w-2 rounded-full bg-brand-green-500 animate-ping" />
          </div>
          <div className="space-y-1">
            <p className="text-emerald-500/50">&gt; Initializing neural scanner...</p>
            <p className="delay-100">&gt; [OK] Found 4 pending review queues.</p>
            <p className="delay-300 text-brand-green-300">&gt; Ready for secure authentication.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={signInWithGoogle}
          className="mt-2 flex w-full items-center justify-center gap-3 rounded-lg border border-oled-border bg-white px-4 py-2.5 text-sm font-medium text-black transition-all duration-300 hover:bg-brand-green-500 hover:text-black hover:border-brand-green-400 hover:shadow-glow-neon hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24c0-1.61-.15-3.16-.41-4.69H24v8.89h12.65c-.55 2.87-2.17 5.31-4.61 6.94l7.19 5.57c4.21-3.88 6.64-9.6 6.64-16.71z"
            />
            <path
              fill="#FBBC05"
              d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.19-5.57c-1.99 1.33-4.53 2.13-7.53 2.13-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          Continue with Google
        </button>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-950/20 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
