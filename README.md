# Vanguard — Frontend

React + Vite frontend for Vanguard, an AI code review assistant for GitHub pull requests.

## What it does

- Sign in with Google (Firebase Auth)
- Connect a GitHub App installation to your repos
- View monitored repositories, branches, and contributors
- View pull requests per repo with an AI-generated deployment risk report — risk level, bug probability, SHAP-based risk drivers, change metrics, code review findings, and recommended actions

## Setup

```bash
npm install
cp .env.example .env   # fill in Firebase config + backend API URL
npm run dev
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
