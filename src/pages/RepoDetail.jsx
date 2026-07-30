import { apiFetch } from '../lib/api'
import { useCachedResource } from '../hooks/useCachedResource'

const PR_STATE_STYLE = {
  open: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  closed: 'bg-red-500/10 text-red-400 border-red-500/30',
  merged: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
}

export default function RepoDetail({ repoFullName, navigate }) {
  const { data: stats, error: statsError } = useCachedResource(
    `stats:${repoFullName}`,
    () => apiFetch(`/repos/${repoFullName}/stats`),
  )
  const { data: pullRequests, error: prsError } = useCachedResource(
    `pullRequests:${repoFullName}`,
    () => apiFetch(`/repos/${repoFullName}/pull_requests`),
  )
  const { data: branches, error: branchesError } = useCachedResource(
    `branches:${repoFullName}`,
    () => apiFetch(`/repos/${repoFullName}/branches`),
  )
  const error = statsError || prsError || branchesError

  return (
    <div className="relative flex min-h-screen flex-col bg-black overflow-hidden font-sans">
      {/* Background Grids and Orbs */}
      <div className="absolute inset-0 cyber-grid pointer-events-none" />
      <div className="absolute inset-0 cyber-grid-glow pointer-events-none" />
      <div className="absolute top-0 right-1/4 h-[300px] w-[500px] rounded-full bg-brand-green-500/5 blur-[120px] pointer-events-none animate-pulse" />

      {/* Top Navbar */}
      <header className="relative z-10 flex w-full items-center justify-between border-b border-oled-border bg-black/50 px-6 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            onClick={(e) => {
              e.preventDefault()
              navigate('/dashboard')
            }}
            className="text-xs text-oled-textMuted hover:text-white transition-colors duration-300 flex items-center gap-1"
          >
            &larr; Back to Command Center
          </a>
          <div className="h-4 w-[1px] bg-oled-border" />
          <h1 className="font-heading text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-brand-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
            </svg>
            {repoFullName}
          </h1>
        </div>

        <a
          href={`https://github.com/${repoFullName}`}
          target="_blank"
          rel="noreferrer"
          className="rounded border border-oled-border bg-black px-3 py-1.5 text-xs font-semibold text-white transition-all duration-300 hover:border-white active:scale-[0.97] flex items-center gap-1"
        >
          View on GitHub
          <svg className="h-3 w-3 text-oled-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </header>

      <main className="relative z-10 flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-950/20 px-4 py-3 text-sm text-red-400 animate-fade-in-up">
            {error}
          </div>
        )}

        {/* Outer Grid Layout showing all components on the same screen */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          
          {/* Main Column: Pull Requests (Takes 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-xl border border-oled-border bg-oled-surface/20 p-5 backdrop-blur-sm relative">
              <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-brand-green-500/10 to-transparent" />
              
              <h2 className="font-heading text-base font-semibold text-white mb-4 flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-brand-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Pull Requests
              </h2>

              {!pullRequests && !error && (
                <div className="text-center py-10 text-xs text-oled-textMuted font-sans">
                  Fetching pull requests...
                </div>
              )}
              
              {pullRequests && pullRequests.length === 0 && (
                <div className="text-center py-10 text-xs text-oled-textMuted font-sans">
                  No pull requests found for this repository.
                </div>
              )}

              {pullRequests && pullRequests.length > 0 && (
                <div className="divide-y divide-oled-border/60 overflow-hidden">
                  {pullRequests.map((pr) => (
                    <div key={pr.prNumber} className="flex items-center justify-between gap-4 py-3.5 transition-colors duration-300">
                      <div className="min-w-0">
                        <a
                          href={pr.htmlUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-heading text-sm font-semibold text-white hover:text-brand-green-400 transition-colors duration-300 truncate block"
                        >
                          #{pr.prNumber} {pr.title}
                        </a>
                        <span className="text-xs text-oled-textMuted font-sans block mt-1">by {pr.author}</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${PR_STATE_STYLE[pr.state] || 'bg-white/5 text-white border-white/10'}`}>
                          {pr.state}
                        </span>
                        <a
                          href={pr.htmlUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded border border-oled-border bg-black px-2 py-0.5 text-[11px] text-oled-textMuted hover:text-white hover:border-white transition-all duration-300"
                        >
                          Details
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Column: Branches & Contributors (Takes 1 column) */}
          <div className="space-y-6">
            
            {/* Branches Card */}
            <section className="rounded-xl border border-oled-border bg-oled-surface/20 p-5 backdrop-blur-sm">
              <h2 className="font-heading text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-brand-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v12m0 0l-4-4m4 4l4-4" />
                </svg>
                Branches
              </h2>

              {!branches && !error && (
                <div className="text-center py-6 text-xs text-oled-textMuted font-sans">
                  Fetching branches...
                </div>
              )}

              {branches && branches.length === 0 && (
                <div className="text-center py-6 text-xs text-oled-textMuted font-sans">
                  No active branches found.
                </div>
              )}

              {branches && branches.length > 0 && (
                <ul className="divide-y divide-oled-border/60 overflow-hidden">
                  {branches.map((branch) => (
                    <li key={branch.name} className="flex items-center justify-between py-2.5">
                      <span className="font-mono text-xs text-white truncate max-w-[150px]">{branch.name}</span>
                      <a
                        href={branch.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded border border-oled-border bg-black px-2 py-0.5 text-[10px] text-white hover:border-brand-green-400 hover:shadow-glow transition-all duration-300"
                      >
                        Compare
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Contributors Card */}
            <section className="rounded-xl border border-oled-border bg-oled-surface/20 p-5 backdrop-blur-sm">
              <h2 className="font-heading text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-brand-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Contributors
              </h2>

              {!stats && !error && (
                <div className="text-center py-6 text-xs text-oled-textMuted font-sans">
                  Fetching stats...
                </div>
              )}

              {stats && stats.contributors.length === 0 && (
                <div className="text-center py-6 text-xs text-oled-textMuted font-sans">
                  No contributors found.
                </div>
              )}

              {stats && stats.contributors.length > 0 && (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {stats.contributors.map((contributor) => (
                    <div key={contributor.author} className="flex items-center justify-between text-xs py-1.5">
                      <span className="font-semibold text-white truncate max-w-[120px]">{contributor.author}</span>
                      <span className="text-brand-green-400 font-semibold font-mono">
                        {contributor.totalCommits} commits
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
          
        </div>
      </main>
    </div>
  )
}
