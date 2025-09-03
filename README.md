# Endora — API Engine Frontend

A React + Next.js (App Router) frontend for the Endora no-code backend platform.

This repository contains the UI used to create/manage workspaces, project overviews, schemas and data sources. It uses NextAuth for authentication, Tailwind CSS for styling and a number of UI components and demos.

## Quick overview

- Framework: Next.js (App Router)
- Auth: NextAuth (Google, GitHub, Credentials/Keycloak)
- Styling: Tailwind CSS
- Animations: framer-motion / custom "magicui" components
- Deployment: Vercel

## Features

- Workspace / Dashboard UI
- Project overview pages under `/workspace/[workspaceId]/projectOverview`
- Data source, visualizer and project settings pages per workspace
- OAuth providers (Google, GitHub) via NextAuth
- Credentials provider integrated with Keycloak token endpoints
- Client/server-safe components and client-only wrappers for animation components

## Routes (not exhaustive)

- `/` — Root: redirects to `/dashboard` when logged in, otherwise `/home`
- `/home` — Marketing/home page
- `/auth/signin` — Sign in
- `/auth/register` — Sign up
- `/dashboard` — User dashboard (requires auth)
- `/dashboard/profile` — Profile page
- `/workspace/[workspaceId]/projectOverview` — Project overview for a workspace
- `/workspace/[workspaceId]/dataSource` — Data source
- `/workspace/[workspaceId]/projectSetting` — Project settings
- `/workspace/[workspaceId]/visualizer` — Schema visualizer

## Local setup

1. Install dependencies

```bash
npm install
```

2. Start development server

```bash
npm run dev
```

3. Build / run production locally

```bash
npm run build
npm run start
```

## Required environment variables

Add these to your `.env.local` for local development and to Vercel for production. The app expects these names in `src/lib/auth.ts` and the NextAuth route.

- NEXTAUTH_URL — e.g. `http://localhost:3000` (or `https://your-app.vercel.app` in production)
- NEXTAUTH_SECRET — long random string used to sign tokens
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GITHUB_ID
- GITHUB_SECRET

Optional (Keycloak / credentials provider)

- KEYCLOAK_ISSUER — Keycloak issuer URL
- KEYCLOAK_ID
- KEYCLOAK_SECRET

Debug flag

- NEXTAUTH_DEBUG=true — enable verbose NextAuth logs (useful when debugging OAuth on Vercel)

## OAuth / Provider callback URLs (important)

Register the following callback URLs in the provider consoles (Google / GitHub), replacing `your-domain` with your deployed domain (or use `localhost` setup for dev):

- Google callback: `https://your-domain/api/auth/callback/google`
- GitHub callback: `https://your-domain/api/auth/callback/github`

If using `localhost` for testing, add:

- `http://localhost:3000/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/github`

Make sure the client id/secret in Vercel env vars match the provider settings exactly.

## Deploying to Vercel

- Create a Vercel project and link the repo.
- Add the environment variables listed above under Project Settings → Environment Variables (set values for Production and Preview as needed).
- Deploy. If OAuth fails after deploy, enable `NEXTAUTH_DEBUG=true` and check functions/deployment logs in Vercel.

## Troubleshooting OAuth issues

- Error `redirect_uri_mismatch` — callback URL in provider console doesn't match the app domain. Update provider settings to include the exact callback URL.
- Error `invalid_client` or `missing_client_id` — verify the provider client id/secret in Vercel env matches the provider app.
- Session not present on server — ensure `NEXTAUTH_URL` is set to your production origin and `NEXTAUTH_SECRET` is configured.
- Check Vercel deployment logs (Functions / Server logs) for NextAuth messages when you attempt sign-in.

## Notes & developer tips

- Root `/` is a server component and uses `getServerSession` to redirect users based on session state.
- Global header/footer are controlled by a small client `Shell` component; dashboard/workspace routes hide the global shell.
- Many components have client-only behavior and are declared with `"use client"` when they access browser APIs (framer-motion, ResizeObserver, etc.).

## Contributing

- Follow the repository coding style (TypeScript + ESLint + Prettier). Fix lint warnings where possible.
- Add meaningful commit messages and test locally with `npm run build` before pushing.

## Contact / Next steps

If you want, I can:

- Add a short debug endpoint to inspect `getServerSession` in your deployed environment (temporary, remove after debug).
- Create a `.env.example` with all required env var keys (without secrets) to simplify onboarding.
- Clean up unused files and lint warnings.

---

This README is based on the current project structure and the sample documentation provided in the repo. If you want the README to include screenshots, a live demo link, or CI/deploy badges, tell me the exact URLs and I will add them.
