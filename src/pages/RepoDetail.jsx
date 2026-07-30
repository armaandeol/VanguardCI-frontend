import { useState } from 'react'
import { apiFetch } from '../lib/api'
import { useCachedResource } from '../hooks/useCachedResource'

const PR_STATE_STYLE = {
  open: 'bg-brand-green-500/10 text-brand-green-400 border-brand-green-500/30',
  closed: 'bg-red-500/10 text-red-400 border-red-500/30',
  merged: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
}

const RISK_STYLE = {
  LOW: 'bg-brand-green-500/10 text-brand-green-400 border-brand-green-500/30',
  MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  HIGH: 'bg-red-500/10 text-red-400 border-red-500/30',
}

// Human-readable labels/descriptions for the 12 change-metric inputs to the risk model.
const METRIC_INFO = {
  ns: { label: 'Subsystems Changed', description: 'Number of subsystems touched by this change' },
  nd: { label: 'Directories Changed', description: 'Number of directories touched by this change' },
  nf: { label: 'Files Changed', description: 'Number of files touched by this change' },
  ent: { label: 'Change Entropy', description: 'How spread out the change is across files' },
  la: { label: 'Lines Added', description: 'Total lines added' },
  ld: { label: 'Lines Deleted', description: 'Total lines deleted' },
  ndev: { label: 'Prior Developers', description: 'Number of developers who previously touched these files' },
  age: { label: 'File Age', description: 'Average time since the touched files were last changed' },
  nuc: { label: 'Prior Unique Changes', description: 'Number of prior unique changes to these files' },
  aexp: { label: 'Author Experience', description: "Author's overall experience across the codebase" },
  arexp: { label: 'Author Recent Experience', description: "Author's experience in recent history" },
  asexp: { label: 'Author Subsystem Experience', description: "Author's experience in the touched subsystem" },
}

function RiskBadge({ riskStatus, deploymentRisk }) {
  if (riskStatus === 'pending') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        Vanguard analyzing…
      </span>
    )
  }
  if (riskStatus === 'failed') {
    return (
      <span className="rounded-full border border-canvas-border bg-canvas px-2 py-0.5 text-[11px] font-medium text-canvas-textMuted">
        Analysis unavailable
      </span>
    )
  }
  if (!deploymentRisk) return null
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${RISK_STYLE[deploymentRisk] || 'bg-canvas-surface text-white border-canvas-border'}`}>
      Vanguard: {deploymentRisk}
    </span>
  )
}

function RiskReportPanel({ repoFullName, prNumber }) {
  const { data: report, error } = useCachedResource(
    `riskReport:${repoFullName}:${prNumber}`,
    () => apiFetch(`/repos/${repoFullName}/pull_requests/${prNumber}/risk_report`),
  )

  if (error) {
    return (
      <div className="mt-2 rounded-lg border border-canvas-border bg-canvas px-4 py-3 text-xs text-canvas-textMuted">
        No Vanguard analysis available yet for this PR.
      </div>
    )
  }

  if (!report) {
    return (
      <div className="mt-2 rounded-lg border border-canvas-border bg-canvas px-4 py-3 text-xs text-canvas-textMuted">
        Loading Vanguard report…
      </div>
    )
  }

  const sections = [
    ['ML explanation', report.mlExplanation],
    ['Code review findings', report.codeReviewFindings],
    ['Engineering guidance', report.engineeringGuidance],
    ['Recommended actions', report.recommendedActions],
    ['Sources consulted', report.sourcesConsulted],
  ]

  const shapContributions = report.shapContributions || []
  const maxAbsShap = Math.max(1e-9, ...shapContributions.map((c) => Math.abs(c.shap_value)))
  const featureEntries = report.featureVector ? Object.entries(report.featureVector) : []

  return (
    <div className="mt-2 space-y-4 rounded-lg border border-canvas-border bg-canvas px-4 py-4">
      <div className="flex items-center justify-between">
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${RISK_STYLE[report.deploymentRisk] || 'bg-canvas-surface text-white border-canvas-border'}`}>
          {report.deploymentRisk} risk
        </span>
        {typeof report.bugProbability === 'number' && (
          <span className="font-mono text-xs text-canvas-textMuted">
            {(report.bugProbability * 100).toFixed(1)}% bug probability
          </span>
        )}
      </div>

      {shapContributions.length > 0 && (
        <div>
          <h4 className="mb-2 text-[11px] font-semibold text-white">Risk drivers</h4>
          <div className="space-y-1.5">
            {shapContributions.map((c) => {
              const info = METRIC_INFO[c.feature_name]
              const increases = c.direction === 'increases_risk'
              const widthPct = (Math.abs(c.shap_value) / maxAbsShap) * 100
              return (
                <div key={c.feature_name} className="flex items-center gap-3">
                  <span
                    className="w-36 shrink-0 truncate text-[11px] text-canvas-textMuted"
                    title={info?.description}
                  >
                    {info?.label || c.feature_name}
                  </span>
                  <div className="flex h-1.5 flex-1 items-center rounded-full bg-canvas-surface">
                    <div
                      className={`h-1.5 rounded-full ${increases ? 'bg-red-500' : 'bg-brand-green-500'}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <span className={`w-16 shrink-0 text-right font-mono text-[11px] ${increases ? 'text-red-400' : 'text-brand-green-400'}`}>
                    {c.shap_value > 0 ? '+' : ''}{c.shap_value.toFixed(3)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {featureEntries.length > 0 && (
        <div>
          <h4 className="mb-2 text-[11px] font-semibold text-white">Change metrics</h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {featureEntries.map(([key, value]) => {
              const info = METRIC_INFO[key]
              return (
                <div
                  key={key}
                  className="rounded-md border border-canvas-border bg-canvas-surface px-2.5 py-2"
                  title={info?.description}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase text-canvas-textMuted">{key}</span>
                    <span className="font-mono text-xs font-semibold text-white">{value}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[10px] text-canvas-textMuted">{info?.label || key}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {sections.map(([label, items]) => (
        items && items.length > 0 && (
          <div key={label}>
            <h4 className="mb-1 text-[11px] font-semibold text-white">{label}</h4>
            <ul className="list-inside list-disc space-y-0.5">
              {items.map((item, i) => (
                <li key={i} className="text-xs text-canvas-textMuted">{item}</li>
              ))}
            </ul>
          </div>
        )
      ))}

      {report.checkRunUrl && (
        <a
          href={report.checkRunUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-xs font-medium text-brand-green-400 hover:text-brand-green-300"
        >
          View full analysis on GitHub &rarr;
        </a>
      )}
    </div>
  )
}

export default function RepoDetail({ repoFullName, navigate }) {
  const [expandedPr, setExpandedPr] = useState(null)
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
    <div className="flex min-h-screen flex-col bg-canvas font-sans">
      {/* Top Navbar */}
      <header className="flex w-full items-center justify-between border-b border-canvas-border px-6 py-3.5">
        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            onClick={(e) => {
              e.preventDefault()
              navigate('/dashboard')
            }}
            className="flex items-center gap-1 text-xs text-canvas-textMuted transition-colors duration-150 hover:text-white"
          >
            &larr; Back to Command Center
          </a>
          <div className="h-4 w-px bg-canvas-border" />
          <h1 className="flex items-center gap-1.5 text-sm font-semibold text-white">
            <svg className="h-4 w-4 text-canvas-textMuted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
            </svg>
            {repoFullName}
          </h1>
        </div>

        <a
          href={`https://github.com/${repoFullName}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 rounded-md border border-canvas-border bg-canvas-surface px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-canvas-surfaceHover"
        >
          View on GitHub
          <svg className="h-3.5 w-3.5 text-canvas-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {error && (
          <div className="mb-6 rounded-md border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Outer Grid Layout showing all components on the same screen */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Main Column: Pull Requests (Takes 2 columns on large screens) */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-lg border border-canvas-border bg-canvas-surface p-5">
              <h2 className="mb-4 flex items-center gap-1.5 text-base font-semibold text-white">
                <svg className="h-4 w-4 text-canvas-textMuted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Pull Requests
              </h2>

              {!pullRequests && !error && (
                <div className="py-10 text-center text-xs text-canvas-textMuted">
                  Fetching pull requests...
                </div>
              )}

              {pullRequests && pullRequests.length === 0 && (
                <div className="py-10 text-center text-xs text-canvas-textMuted">
                  No pull requests found for this repository.
                </div>
              )}

              {pullRequests && pullRequests.length > 0 && (
                <div className="divide-y divide-canvas-border">
                  {pullRequests.map((pr) => (
                    <div key={pr.prNumber} className="py-3.5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <a
                            href={pr.htmlUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block truncate text-sm font-semibold text-white hover:text-brand-green-400"
                          >
                            #{pr.prNumber} {pr.title}
                          </a>
                          <span className="mt-1 block text-xs text-canvas-textMuted">by {pr.author}</span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <RiskBadge riskStatus={pr.riskStatus} deploymentRisk={pr.deploymentRisk} />
                          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${PR_STATE_STYLE[pr.state] || 'bg-canvas-surface text-white border-canvas-border'}`}>
                            {pr.state}
                          </span>
                          {(pr.deploymentRisk || pr.riskStatus) && (
                            <button
                              type="button"
                              onClick={() => setExpandedPr(expandedPr === pr.prNumber ? null : pr.prNumber)}
                              className="rounded-md border border-canvas-border bg-canvas px-2 py-0.5 text-[11px] font-medium text-canvas-textMuted transition-colors duration-150 hover:text-white"
                            >
                              {expandedPr === pr.prNumber ? 'Hide' : 'Vanguard report'}
                            </button>
                          )}
                          <a
                            href={pr.htmlUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-md border border-canvas-border bg-canvas px-2 py-0.5 text-[11px] font-medium text-canvas-textMuted transition-colors duration-150 hover:text-white"
                          >
                            Details
                          </a>
                        </div>
                      </div>

                      {expandedPr === pr.prNumber && (
                        <RiskReportPanel repoFullName={repoFullName} prNumber={pr.prNumber} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Column: Branches & Contributors (Takes 1 column) */}
          <div className="space-y-6">

            {/* Branches Card */}
            <section className="rounded-lg border border-canvas-border bg-canvas-surface p-5">
              <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-white">
                <svg className="h-4 w-4 text-canvas-textMuted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v12m0 0l-4-4m4 4l4-4" />
                </svg>
                Branches
              </h2>

              {!branches && !error && (
                <div className="py-6 text-center text-xs text-canvas-textMuted">
                  Fetching branches...
                </div>
              )}

              {branches && branches.length === 0 && (
                <div className="py-6 text-center text-xs text-canvas-textMuted">
                  No active branches found.
                </div>
              )}

              {branches && branches.length > 0 && (
                <ul className="divide-y divide-canvas-border">
                  {branches.map((branch) => (
                    <li key={branch.name} className="flex items-center justify-between py-2.5">
                      <span className="max-w-[150px] truncate font-mono text-xs text-white">{branch.name}</span>
                      <a
                        href={branch.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-canvas-border bg-canvas px-2 py-0.5 text-[11px] font-medium text-white transition-colors duration-150 hover:bg-canvas-surfaceHover"
                      >
                        Compare
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Contributors Card */}
            <section className="rounded-lg border border-canvas-border bg-canvas-surface p-5">
              <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-white">
                <svg className="h-4 w-4 text-canvas-textMuted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Contributors
              </h2>

              {!stats && !error && (
                <div className="py-6 text-center text-xs text-canvas-textMuted">
                  Fetching stats...
                </div>
              )}

              {stats && stats.contributors.length === 0 && (
                <div className="py-6 text-center text-xs text-canvas-textMuted">
                  No contributors found.
                </div>
              )}

              {stats && stats.contributors.length > 0 && (
                <div className="max-h-[300px] space-y-3 overflow-y-auto pr-1">
                  {stats.contributors.map((contributor) => (
                    <div key={contributor.author} className="flex items-center justify-between py-1.5 text-xs">
                      <span className="max-w-[120px] truncate font-semibold text-white">{contributor.author}</span>
                      <span className="font-mono font-semibold text-brand-green-400">
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
