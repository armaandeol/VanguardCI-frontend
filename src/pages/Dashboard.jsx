import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const STATUS_COPY = {
  pending: { label: 'Queued to sync…', tone: 'text-gray-500' },
  syncing: { label: 'Pulling in your repository history…', tone: 'text-blue-600' },
  completed: { label: 'Repository history synced', tone: 'text-green-600' },
  failed: { label: 'Sync failed — try reconnecting', tone: 'text-red-500' },
}

function statusFor(installation) {
  return STATUS_COPY[installation.syncStatus] || STATUS_COPY.pending
}

export default function Dashboard({ installations: initialInstallations }) {
  const { signOut } = useAuth()
  const [installations, setInstallations] = useState(initialInstallations ?? null)
  const [repos, setRepos] = useState(null)
  const [error, setError] = useState(null)
  const [refreshToken, setRefreshToken] = useState(0)

  useEffect(() => {
    apiFetch('/github/installations')
      .then(setInstallations)
      .catch((err) => setError(err.message))
  }, [refreshToken])

  // Keep syncStatus fresh while a backfill is still running.
  useEffect(() => {
    const isSyncing = installations?.some((i) => i.syncStatus === 'pending' || i.syncStatus === 'syncing')
    if (!isSyncing) return undefined

    const interval = setInterval(() => setRefreshToken((token) => token + 1), 4000)
    return () => clearInterval(interval)
  }, [installations])

  // The installations endpoint self-heals against GitHub - if the app was
  // uninstalled, it comes back empty and we shouldn't keep showing the dashboard.
  useEffect(() => {
    if (installations && installations.length === 0) {
      window.location.href = '/'
    }
  }, [installations])

  const refetchRepos = useCallback(() => {
    apiFetch('/repos')
      .then(setRepos)
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    refetchRepos()
  }, [refetchRepos])

  // "Manage on GitHub" opens in a new tab - when the user comes back after
  // adding/removing repos there, refresh so the change shows up without a
  // manual reload. The webhook that syncs the change runs in the background,
  // so re-check a couple of times to give it a moment to land.
  useEffect(() => {
    const refreshAll = () => {
      setRefreshToken((token) => token + 1)
      refetchRepos()
    }

    const handleFocus = () => {
      refreshAll()
      setTimeout(refreshAll, 3000)
      setTimeout(refreshAll, 8000)
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refetchRepos])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {installations && (
        <ul className="mt-2 w-full max-w-sm divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
          {installations.length === 0 && (
            <li className="px-4 py-3 text-sm text-gray-500">No installations yet.</li>
          )}
          {installations.map((installation) => (
            <li key={installation.installationId} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span className="text-gray-700">Installation {installation.installationId}</span>
              <span className={statusFor(installation).tone}>{statusFor(installation).label}</span>
              <a
                href={`https://github.com/settings/installations/${installation.installationId}`}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Manage on GitHub
              </a>
            </li>
          ))}
        </ul>
      )}

      {repos && repos.length > 0 && (
        <ul className="mt-2 w-full max-w-sm divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
          {repos.map((repo) => (
            <li key={repo.fullName} className="flex items-center justify-between px-4 py-3 text-sm">
              <a href={`/repos/${repo.fullName}`} className="text-gray-700 hover:underline">
                {repo.fullName}
              </a>
              <span className="text-gray-400">{repo.defaultBranch}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={signOut}
        className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        Sign out
      </button>
    </div>
  )
}
