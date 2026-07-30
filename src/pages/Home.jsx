import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'

export default function Home({ connected = false }) {
  const { user, signOut } = useAuth()
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState(null)

  const handleConnectGithub = async () => {
    setConnecting(true)
    setError(null)
    try {
      const { install_url } = await apiFetch('/auth/github/connect')
      window.location.href = install_url
    } catch (err) {
      setError(err.message)
      setConnecting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans">
      {/* Top Navbar */}
      <header className="flex w-full items-center justify-between border-b border-canvas-border px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-canvas-border bg-canvas-surface">
            <svg className="h-4 w-4 text-brand-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25" />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight text-white">Vanguard</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-canvas-border bg-canvas-surface py-1 pl-1.5 pr-3 text-xs text-white">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="h-5 w-5 rounded-full" />
            ) : (
              <div className="h-5 w-5 rounded-full bg-canvas-border" />
            )}
            <span className="max-w-[100px] truncate text-canvas-textMuted">{user?.displayName || 'Developer'}</span>
          </div>

          <button
            type="button"
            onClick={signOut}
            className="rounded-md border border-canvas-border bg-canvas-surface px-3 py-1.5 text-xs font-medium text-canvas-textMuted transition-colors duration-150 hover:bg-canvas-surfaceHover hover:text-white"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Hero & Action Section */}
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-canvas-border bg-canvas-surface px-3 py-1 text-xs text-canvas-textMuted">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green-400" />
          Vanguard AI Core: Active
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Automated Code Intelligence<br />
          Built for High-Growth Teams
        </h1>

        <p className="mt-5 max-w-xl text-base text-canvas-textMuted">
          Vanguard analyzes your pull requests, locates security exploits, drafts suggestions, and optimizes code performance in milliseconds.
        </p>

        {/* GitHub Integration Box */}
        <div className="mt-10 w-full max-w-md rounded-xl border border-canvas-border bg-canvas-surface p-8">
          <h2 className="text-lg font-semibold text-white">Integrate GitHub</h2>
          <p className="mt-2 text-xs text-canvas-textMuted">
            Grant secure read-write repository permissions to let Vanguard monitor branches and pull requests automatically.
          </p>

          <button
            type="button"
            onClick={handleConnectGithub}
            disabled={connecting || connected}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors duration-150 hover:bg-gray-100 disabled:opacity-60"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {connected ? 'GitHub Connected' : connecting ? 'Redirecting to GitHub...' : 'Connect with GitHub'}
          </button>

          {error && <p className="mt-4 text-xs text-red-400">{error}</p>}
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3">
          <div className="rounded-lg border border-canvas-border bg-canvas-surface p-5">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-canvas-border bg-canvas text-brand-green-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white">Ultra Fast Audits</h3>
            <p className="mt-2 text-xs text-canvas-textMuted">
              Reviews push events in real-time, delivering feedback within 3 seconds of pushing to GitHub.
            </p>
          </div>

          <div className="rounded-lg border border-canvas-border bg-canvas-surface p-5">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-canvas-border bg-canvas text-brand-green-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white">Deep Exploit Scanning</h3>
            <p className="mt-2 text-xs text-canvas-textMuted">
              Locates vulnerabilities, race conditions, memory leaks, and logic errors using AI.
            </p>
          </div>

          <div className="rounded-lg border border-canvas-border bg-canvas-surface p-5">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-canvas-border bg-canvas text-brand-green-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white">Precise Code Diffs</h3>
            <p className="mt-2 text-xs text-canvas-textMuted">
              Get clean markdown code recommendations with visual code replacements you can apply with one click.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
