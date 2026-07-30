import { useEffect } from 'react'
import { apiFetch } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useCachedResource } from '../hooks/useCachedResource'

const STATUS_COPY = {
  pending: { label: 'Queued…', tone: 'text-amber-400 border-amber-500/30 bg-amber-500/5 animate-pulse' },
  syncing: { label: 'Syncing…', tone: 'text-brand-green-400 border-brand-green-500/30 bg-brand-green-500/5 animate-pulse-glow' },
  completed: { label: 'Synced', tone: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
  failed: { label: 'Failed', tone: 'text-red-400 border-red-500/20 bg-red-950/20' },
}

function StatusBadge({ status }) {
  const config = STATUS_COPY[status] || STATUS_COPY.pending
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm ${config.tone}`}>
      {status === 'syncing' && <span className="h-1 w-1 rounded-full bg-brand-green-400 animate-ping" />}
      {status === 'pending' && <span className="h-1 w-1 rounded-full bg-amber-400 animate-pulse" />}
      {config.label}
    </span>
  )
}

export default function Dashboard({ installations, navigate, refetchInstallations }) {
  const { signOut } = useAuth()
  const { data: repos, error: reposError, refetch: refetchRepos } = useCachedResource(
    'repos',
    () => apiFetch('/repos'),
  )
  const error = reposError

  // Keep syncStatus fresh while a backfill is still running.
  useEffect(() => {
    const isSyncing = installations?.some((i) => i.syncStatus === 'pending' || i.syncStatus === 'syncing')
    if (!isSyncing || !refetchInstallations) return undefined

    const interval = setInterval(refetchInstallations, 4000)
    return () => clearInterval(interval)
  }, [installations, refetchInstallations])

  // The installations endpoint self-heals against GitHub - if the app was
  // uninstalled, it comes back empty and we shouldn't keep showing the dashboard.
  useEffect(() => {
    if (installations && installations.length === 0) {
      window.location.href = '/'
    }
  }, [installations])

  // "Manage on GitHub" opens in a new tab - refresh when the user returns.
  useEffect(() => {
    const refreshAll = () => {
      refetchInstallations?.()
      refetchRepos()
    }

    const handleFocus = () => {
      refreshAll()
      setTimeout(refreshAll, 3000)
      setTimeout(refreshAll, 8000)
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refetchInstallations, refetchRepos])

  return (
    <div className="relative flex min-h-screen flex-col bg-black overflow-hidden font-sans">
      {/* Background Grids and Orbs */}
      <div className="absolute inset-0 cyber-grid pointer-events-none" />
      <div className="absolute inset-0 cyber-grid-glow pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-[350px] w-[500px] rounded-full bg-brand-green-500/5 blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 flex w-full items-center justify-between border-b border-oled-border bg-black/50 px-6 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded border border-brand-green-500/30 bg-black shadow-glow">
            <svg className="h-3 w-3 text-brand-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25" />
            </svg>
          </div>
          <span className="font-heading text-base font-bold tracking-tight text-white">Vanguard</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={signOut}
            className="rounded-lg border border-oled-border bg-black px-3 py-1.5 text-xs font-semibold text-oled-textMuted hover:text-white hover:border-white transition-all duration-300 active:scale-[0.97]"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
        {/* Minimal clean header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-xl font-bold text-white tracking-tight">
            Repositories
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Section: GitHub Integrations */}
        <section className="mb-8">
          <h2 className="font-heading text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-brand-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.905 0-5.64-.78-8.006-2.141m15.686 0l-1.42 1.42m-12.846-1.42l1.42 1.42" />
            </svg>
            GitHub Installations
          </h2>
          
          {installations ? (
            <div className="rounded-xl border border-oled-border bg-oled-surface/20 divide-y divide-oled-border overflow-hidden backdrop-blur-sm">
              {installations.length === 0 && (
                <div className="px-6 py-6 text-center text-xs text-oled-textMuted font-sans">
                  No active GitHub integrations found. Connect to get started.
                </div>
              )}
              {installations.map((installation) => (
                <div key={installation.installationId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 transition-all duration-300 hover:bg-oled-surface/50">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-white/5 border border-white/10 text-white">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-white text-xs block">Integration #{installation.installationId}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={installation.syncStatus} />
                    <a
                      href={`https://github.com/settings/installations/${installation.installationId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded border border-oled-border bg-black px-2.5 py-1 text-xs text-white transition-all duration-300 hover:bg-brand-green-500 hover:text-black hover:border-brand-green-400 hover:shadow-glow-neon active:scale-[0.97]"
                    >
                      Manage
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-oled-border bg-oled-surface/20 p-5 text-center text-xs text-oled-textMuted font-sans">
              Loading installations status…
            </div>
          )}
        </section>

        {/* Section: Synced Repositories */}
        <section>
          <h2 className="font-heading text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-brand-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
            Monitored Repositories
          </h2>

          {repos ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos.length === 0 && (
                <div className="col-span-2 rounded-xl border border-oled-border bg-oled-surface/20 p-6 text-center text-xs text-oled-textMuted font-sans">
                  No monitored repositories found.
                </div>
              )}
              {repos.map((repo) => (
                <a
                  key={repo.fullName}
                  href={`/repos/${repo.fullName}`}
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(`/repos/${repo.fullName}`)
                  }}
                  className="group relative flex flex-col justify-between rounded-xl border border-oled-border bg-oled-surface/30 p-5 backdrop-blur-sm transition-all duration-300 hover:border-brand-green-500/40 hover:bg-oled-surface/50 hover:shadow-glow hover:-translate-y-0.5"
                >
                  {/* Subtle top light bar */}
                  <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-brand-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex h-5 w-5 items-center justify-center rounded bg-brand-green-500/5 text-brand-green-400 border border-brand-green-500/10 shrink-0">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="font-heading text-sm font-semibold text-white truncate group-hover:text-brand-green-400 transition-colors duration-300">
                          {repo.fullName}
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded bg-white/5 border border-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white shrink-0">
                        {repo.defaultBranch}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] border-t border-oled-border/60 pt-2.5">
                    <span className="text-oled-textMuted flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-brand-green-500 animate-pulse" />
                      Continuous Review Active
                    </span>
                    <span className="text-brand-green-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform duration-300 font-medium">
                      Review dashboard &rarr;
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 rounded-xl border border-oled-border bg-oled-surface/10 animate-pulse" />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
