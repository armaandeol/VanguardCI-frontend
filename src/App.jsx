import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { useInstallations } from './hooks/useInstallations'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import RepoDetail from './pages/RepoDetail'

const REPOS_PREFIX = '/repos/'

function App() {
  const { user, loading } = useAuth()
  const { installations, connected, loading: installationsLoading, refetch: refetchInstallations } = useInstallations()
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  // Listen to popstate to update routing on browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }

  if (loading || (user && installationsLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green-500/20 border-t-brand-green-500 shadow-glow" />
          <p className="text-xs font-mono tracking-widest text-brand-green-400">LOADING VANGUARD...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  if (currentPath.startsWith(REPOS_PREFIX)) {
    const repoFullName = decodeURIComponent(currentPath.slice(REPOS_PREFIX.length)).replace(/\/$/, '')
    return <RepoDetail repoFullName={repoFullName} navigate={navigate} />
  }

  // Dashboard is the default landing page once GitHub is connected -
  // only show Home (with the Connect GitHub button) before that.
  if (currentPath === '/dashboard' || connected) {
    return <Dashboard installations={installations} navigate={navigate} refetchInstallations={refetchInstallations} />
  }

  return <Home connected={connected} navigate={navigate} />
}

export default App
