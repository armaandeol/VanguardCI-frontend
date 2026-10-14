# Vanguard — Frontend

React + Vite frontend for Vanguard (DeployIQ), an AI-powered deployment risk assistant for GitHub pull requests. It is the dashboard layer on top of the [DeployIQ backend](../DeployIQ-backend/README.md) — authentication, GitHub App connection, and the visualized risk report all talk to that API.

---

## What it does

- Sign in with Google via Firebase Auth and sync the resulting identity to the backend's `accounts` collection.
- Connect a GitHub App installation (not a personal access token) to grant Vanguard scoped, revocable access to specific repos.
- View monitored repositories, branches, and contributor commit activity pulled from Firestore.
- View pull requests per repo with a live-updating risk badge, and expand any analyzed PR into a full Vanguard report: deployment risk (LOW/MEDIUM/HIGH), calibrated bug probability, a SHAP-based "risk drivers" bar chart, the raw 12-feature change-metric grid, code review findings, engineering guidance, recommended actions, and a link to the GitHub Check Run.

---

## Architecture

```text
Firebase Auth (Google sign-in)
        |
        v
AuthContext — holds the Firebase user, exposes signInWithGoogle / signOut
        |
        v
apiFetch() — attaches the current Firebase ID token as a Bearer header
        |
        v
DeployIQ backend (FastAPI) — verifies the token, scopes all data by firebaseUserId
        |
        +--> /github/installations   (connected GitHub App installations)
        +--> /repos                  (repos visible to this user's installations)
        +--> /repos/:repo/stats      (contributor + commit activity)
        +--> /repos/:repo/branches   (live GitHub branch list)
        +--> /repos/:repo/pull_requests               (PRs + risk badge)
        +--> /repos/:repo/pull_requests/:n/risk_report (full Vanguard report)
```

The frontend never talks to GitHub directly — every GitHub-scoped read goes through the backend, which holds the GitHub App installation token and enforces that the signed-in Firebase user actually owns that installation before returning anything.

---

## Pages & data flow

| Page | Responsibility |
| --- | --- |
| `Login.jsx` | Google sign-in via Firebase popup; on success, posts the ID token to `/auth/sync` to create/update the user's Firestore `accounts` doc. |
| `Home.jsx` | Landing/marketing entry point before authentication. |
| `Dashboard.jsx` | Lists GitHub App installations (with live sync status: pending → syncing → completed/failed) and the repos backfilled under them. Polls installation status every 4s while a backfill is running, and re-syncs on window focus (covers the user managing the install in a separate GitHub tab). |
| `RepoDetail.jsx` | Per-repo view: pull requests (with risk badges), branches, and contributors. Expanding a PR lazily fetches and renders its full risk report. |

State fetching goes through two small hooks:

- `useCachedResource` — fetch-once-and-cache wrapper used for repos, stats, branches, PRs, and risk reports, with a `refetch` escape hatch.
- `useInstallations` — tracks the signed-in user's GitHub App installations and exposes a `refetch`, used to drive the Dashboard's polling/focus-refresh behavior.

---

## Authentication flow (Firebase → Backend)

1. User clicks "Sign in with Google" → `signInWithPopup` (Firebase Auth, client SDK).
2. On success, the frontend calls `user.getIdToken()` and `POST /auth/sync` with `Authorization: Bearer <idToken>`.
3. The backend verifies the token server-side with the Firebase Admin SDK and upserts `accounts/{uid}` (name, email, profile photo) in Firestore.
4. Every subsequent API call (`apiFetch` in `src/lib/api.js`) re-reads `auth.currentUser.getIdToken()` and attaches it as a Bearer token — the frontend never manages its own session/JWT, Firebase ID tokens (auto-refreshed by the SDK) are the only credential.
5. The backend never trusts a `uid` passed in a request body/query — it always derives identity from the verified token via the `get_current_user` dependency, then scopes Firestore queries (installations, repos, stats) to that `uid`.

## Connecting GitHub (GitHub App installation flow)

1. From the dashboard, the frontend requests `GET /auth/github/connect` (authenticated) and receives a GitHub App "Install" URL containing a one-time, random `state` token the backend pre-registered in Firestore against the current `firebaseUserId`.
2. The browser is sent to GitHub's installation picker. The user chooses which repos to grant access to (all, or a subset) — this is the GitHub App permission model, not an OAuth scope grant, so access is per-repo and revocable from GitHub's side at any time.
3. GitHub redirects back to `GET /auth/github/callback` with the new `installation_id` and the original `state`. The backend validates the `state` against Firestore (single-use, deleted immediately after), links `installation_id -> firebaseUserId`, and kicks off a background backfill job before redirecting the browser to `/dashboard`.
4. The background job (`backfill_installation_commits`) mints a short-lived GitHub App installation token, lists every repo the installation covers, and backfills recent commits + pull requests into Firestore so the dashboard has data immediately instead of waiting for the next webhook.
5. The Dashboard polls `/github/installations` while `syncStatus` is `pending`/`syncing`, and that same endpoint self-heals: if GitHub reports the installation token as revoked/missing (user uninstalled the app), the stale Firestore record is deleted and the UI redirects back to the landing page.

## Environment variables (`.env`)

| Variable | Purpose |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID (must match the backend's Firebase project) |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_API_BASE_URL` | Base URL of the DeployIQ backend (defaults to `http://localhost:8000`) |

---

## Setup

```bash
npm install
cp .env.example .env   # fill in Firebase config + backend API URL
npm run dev
```

The backend must be running (see `../DeployIQ-backend/README.md`) with a matching Firebase project and `FRONTEND_URL` pointed at this app's origin for CORS and the GitHub OAuth redirect to work.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
