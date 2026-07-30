import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signInWithGoogle, error } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm rounded-xl border border-canvas-border bg-canvas-surface p-8 text-center shadow-card">
        {/* Vanguard logo mark */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-canvas-border bg-canvas">
          <svg className="h-6 w-6 text-brand-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
            <circle cx="12" cy="9.5" r="2.5" fill="currentColor" fillOpacity="0.15" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.5m-4.5 0a4.5 4.5 0 109 0 4.5 4.5 0 10-9 0" />
          </svg>
        </div>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-white">
          Vanguard
        </h1>
        <p className="mt-1.5 text-sm text-canvas-textMuted">
          Next-generation AI code reviews, automated.
        </p>

        <button
          type="button"
          onClick={signInWithGoogle}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-md border border-canvas-border bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200"
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
          <div className="mt-4 rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
