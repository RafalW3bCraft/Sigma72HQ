# tEstServisIte — Full-Cycle IT Solutions Platform

A modern, full-stack business showcase and client portal for an IT services company. The platform provides a public-facing marketing website and a private authenticated client dashboard, all backed by Firebase.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Environment Variables](#environment-variables)
5. [Local Development](#local-development)
6. [Architecture](#architecture)
7. [Firebase Setup](#firebase-setup)
8. [Authentication & Roles](#authentication--roles)
9. [Features](#features)
10. [API Reference](#api-reference)
11. [Database Collections](#database-collections)
12. [Internationalization](#internationalization)
13. [Known Limitations & Future Work](#known-limitations--future-work)
14. [Deployment](#deployment)
15. [Admin Setup](#admin-setup)

---

## Overview

**tEstServisIte** is a full-cycle IT solutions platform serving two audiences:

- **Public visitors** — browse services, portfolio, business plan, client reviews, and submit a contact request.
- **Registered clients** — log in to a private dashboard where they can submit project requests, track project statuses in real-time, and raise support tickets.
- **Administrators** — log in to an admin dashboard to manage all contact submissions, support tickets, and client projects.

The application uses a cyber-themed dark aesthetic with neon red/cyan accents and glassmorphism-style UI components.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Routing | Wouter |
| State / Data | TanStack Query v5 + Firestore `onSnapshot` for real-time subscriptions |
| UI Components | shadcn/ui (Radix UI primitives) |
| Styling | Tailwind CSS v3, tailwindcss-animate, Framer Motion |
| Icons | Lucide React, React Icons |
| Forms | React Hook Form + Zod |
| Backend | Express.js (Node.js) — serves the frontend in development and production |
| Database | Cloud Firestore (Firebase) |
| Authentication | Firebase Authentication (Email / Password) |
| Validation | Zod (shared schemas between frontend and backend) |
| i18n | Custom `translations.ts` (English + Russian) |
| Build | Vite (frontend), esbuild (server bundle) |
| Package Manager | npm |

---

## Project Structure

```
tEstServisIte/
├── client/                          # React frontend (Vite root)
│   ├── index.html
│   ├── public/                      # Static assets (logos, images)
│   └── src/
│       ├── components/
│       │   ├── dashboard/           # Dashboard sub-panels
│       │   │   ├── CreateProjectPanel.tsx
│       │   │   ├── ProjectStatusPanel.tsx  # Real-time via onSnapshot
│       │   │   ├── SupportPanel.tsx
│       │   │   └── InfoPanel.tsx
│       │   ├── sections/            # Landing page sections
│       │   │   ├── HeroSection.tsx
│       │   │   ├── ServicesSection.tsx
│       │   │   ├── PortfolioSection.tsx
│       │   │   ├── PlanSection.tsx
│       │   │   ├── ReviewsSection.tsx
│       │   │   └── ContactSection.tsx
│       │   ├── ui/                  # shadcn/ui primitives
│       │   ├── Header.tsx
│       │   └── Footer.tsx
│       ├── contexts/
│       │   ├── AuthContext.tsx      # Firebase Auth state + Firestore profile
│       │   ├── LanguageContext.tsx
│       │   └── ThemeContext.tsx
│       ├── hooks/
│       │   └── use-toast.ts
│       ├── lib/
│       │   ├── api.ts               # All Firestore CRUD + real-time subscriptions
│       │   ├── firebase.ts          # Firebase app initialization
│       │   └── translations.ts      # EN + RU string map
│       └── pages/
│           ├── HomePage.tsx
│           ├── AuthPage.tsx
│           ├── DashboardPage.tsx
│           ├── AdminPage.tsx
│           └── not-found.tsx
├── server/
│   ├── index.ts                     # Express entry point, auto port-finding
│   ├── routes.ts                    # /api/health endpoint
│   └── vite.ts                      # Vite dev middleware integration
├── shared/
│   └── schema.ts                    # Zod schemas + TypeScript types (shared)
├── .env                             # Environment variables (do not commit)
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── drizzle.config.ts                # Present but unused; Firebase used instead
├── ADMIN_SETUP.md                   # Admin role elevation instructions
├── FIRESTORE_SECURITY_RULES.md      # Security rules for Firebase Console
└── design_guidelines.md             # UI/UX design specification
```

---

## Environment Variables

All required variables live in `.env` at the project root.

| Variable | Required | Description |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Yes | Firebase Web API key |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | Yes | Firebase App ID |
| `SESSION_SECRET` | Yes | Secret for Express session middleware |
| `ADMIN_EMAIL` | Optional | Reference only — initial admin email |
| `ADMIN_PASSWORD` | Optional | Reference only — initial admin password |
| `PORT` | Optional | Server listen port (default: `5000`) |

> Variables prefixed with `VITE_` are embedded into the browser bundle at build time. Do not store private secrets here.

---

## Local Development

### Prerequisites

- Node.js 20+
- npm

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Ensure .env is configured with your Firebase credentials

# 3. Start the development server (Express + Vite HMR)
npm run dev
```

The app will be available at `http://localhost:5000`.

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build frontend (Vite) + bundle server (esbuild) into `dist/` |
| `npm start` | Run the production build |
| `npm run check` | TypeScript type check |

---

## Architecture

### Development Request Flow

```
Browser
  └─► Express (port 5000)
        ├─► /api/*  → Express route handlers (server/routes.ts)
        └─► *       → Vite middleware → React SPA (HMR enabled)
```

### Production Request Flow

```
Browser
  └─► Express (port 5000)
        ├─► /api/*   → Express route handlers
        └─► *        → dist/public/ (static files + SPA fallback)
```

### Data Flow

All data operations go **directly from the browser to Firebase**. The Express server does not proxy Firebase calls; it only:

1. Serves the built frontend in production.
2. Runs Vite dev middleware in development.
3. Exposes the `/api/health` endpoint.

Real-time data (projects, contacts, support tickets, users) uses Firestore `onSnapshot` listeners, which push updates to the React state automatically — no polling required.

---

## Firebase Setup

### Step 1 — Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Enable **Authentication** → **Email/Password** sign-in method.
4. Enable **Cloud Firestore** in production mode.

### Step 2 — Get Config Keys

1. Firebase Console → Project Settings → Your apps → Web app.
2. Copy `apiKey`, `projectId`, and `appId` into your `.env` file.

### Step 3 — Deploy Security Rules

The file `FIRESTORE_SECURITY_RULES.md` contains the full ruleset. Copy the rules and publish them via:

> Firebase Console → Firestore Database → Rules → Edit → Publish

Rules enforce:
- Users can only read/write their own documents.
- Admins can read all documents.
- Contact submissions are write-only from the public.

### Step 4 — Create Composite Indexes

If you see a "missing index" error in the browser console, click the provided link to auto-create it. Common required indexes:

- `projects`: `userId ASC, createdAt DESC`
- `support_messages`: `userId ASC, createdAt DESC`
- `contact_submissions`: `submittedAt DESC`

---

## Authentication & Roles

Authentication is handled entirely by **Firebase Authentication**. On sign-up, a profile document is created in the `users` Firestore collection with `role: "user"`.

### Roles

| Role | Access |
|---|---|
| `user` | Public site + client dashboard (own data only) |
| `admin` | Public site + admin dashboard (all users, projects, contacts, tickets) |

### Promoting a User to Admin

There is no UI for this — it must be done manually:

1. Firebase Console → Firestore → `users` collection.
2. Open the document whose ID matches the user's Firebase Auth UID.
3. Set the `role` field to `"admin"`.
4. The user gains admin access on their next page load.

See `ADMIN_SETUP.md` for detailed instructions.

---

## Features

### Public Website

| Section | Description |
|---|---|
| Hero | Animated headline with CTA buttons |
| Services | Cards: Website Dev, Telegram Bots, AI Assistants, Mobile Apps |
| Portfolio | Filterable gallery from the `portfolio` Firestore collection |
| Business Plan | Full MVP roadmap and strategic priorities |
| Reviews | Client testimonials from the `testimonials` Firestore collection |
| Contact | Form that writes to `contact_submissions` in Firestore |

### Client Dashboard (Authenticated Users)

| Tab | Description |
|---|---|
| Create Project | Submit a new project request form |
| Project Status | Real-time list of own projects with status progress bar |
| Support | Submit a support ticket |
| Information | Platform FAQ and how-it-works guide |

### Admin Dashboard (Admin Role Only)

| Tab | Description |
|---|---|
| Contact Submissions | All contact form entries; advance status: New → Read → Responded |
| Support Tickets | All support messages; advance status: Open → In-Progress → Resolved |
| Projects | All client projects with inline status dropdown and full client info |

**Summary Cards** show at a glance:
- New (unread) contact submissions count
- Open + in-progress support ticket count
- Total project count
- Revenue — summed from the `budget` field of completed projects (falls back to completed project count when no numeric budgets are present)

---

## API Reference

The Express backend exposes one REST endpoint. All other data access uses Firebase SDK directly from the browser.

### `GET /api/health`

Returns service health status.

**Response:**

```json
{
  "status": "ok",
  "service": "testservisite"
}
```

---

## Database Collections

### `users`

Document ID = Firebase Auth UID.

| Field | Type | Description |
|---|---|---|
| `uid` | string | Firebase Auth UID |
| `email` | string | User email |
| `companyName` | string | Company or individual name |
| `phoneNumber` | string | Contact phone number |
| `role` | `"user"` \| `"admin"` | Access role (default: `"user"`) |
| `createdAt` | number | Unix timestamp in ms |

### `projects`

| Field | Type | Description |
|---|---|---|
| `id` | string | Firestore document ID |
| `userId` | string | Owner UID |
| `serviceType` | enum | `website`, `telegram-bot`, `ai-assistant`, `mobile-app`, `e-commerce`, `other` |
| `projectName` | string | Project name |
| `description` | string | Min 10 chars |
| `timeline` | string? | Optional, e.g. "2-3 months" |
| `budget` | string? | Optional, e.g. "$5000-$10000" |
| `status` | enum | `pending`, `in-progress`, `completed`, `cancelled` |
| `createdAt` | number | Unix timestamp in ms |
| `updatedAt` | number | Unix timestamp in ms |

### `support_messages`

| Field | Type | Description |
|---|---|---|
| `id` | string | Firestore document ID |
| `userId` | string | Submitting user UID |
| `projectId` | string? | Optional related project ID |
| `subject` | string | Ticket subject |
| `message` | string | Ticket body |
| `status` | enum | `open`, `in-progress`, `resolved` |
| `createdAt` | number | Unix timestamp in ms |
| `updatedAt` | number? | Unix timestamp in ms |

### `contact_submissions`

| Field | Type | Description |
|---|---|---|
| `id` | string | Firestore document ID |
| `name` | string | Sender name |
| `email` | string | Sender email |
| `message` | string | Message body |
| `status` | enum | `new`, `read`, `responded` |
| `createdAt` | number | Unix timestamp in ms |
| `respondedAt` | number? | Unix timestamp in ms |

### `portfolio`

| Field | Type | Description |
|---|---|---|
| `id` | string | Firestore document ID |
| `title` | string | Project title |
| `description` | string | Short description |
| `category` | enum | `website`, `telegram-bot`, `ai-assistant`, `mobile-app`, `e-commerce` |
| `imageUrl` | string? | Thumbnail URL |
| `tags` | string[] | Tag list |
| `technologies` | string[] | Tech stack used |
| `client` | string? | Client name |
| `duration` | string? | Project duration |
| `challenge` | string? | Problem statement |
| `solution` | string? | Approach taken |
| `outcome` | string? | Results achieved |
| `metrics` | `{label, value}[]`? | KPI metrics |
| `featured` | boolean | Feature flag |
| `liveUrl` | string? | Live project URL |
| `githubUrl` | string? | GitHub repository URL |
| `order` | number | Sort order (ascending) |
| `createdAt` | number? | Unix timestamp in ms |
| `updatedAt` | number? | Unix timestamp in ms |

### `testimonials`

| Field | Type | Description |
|---|---|---|
| `id` | string | Firestore document ID |
| `clientName` | string | Reviewer name |
| `companyName` | string | Reviewer's company |
| `rating` | number | 1–5 star rating |
| `text` | string | Review text |
| `avatarUrl` | string? | Avatar image URL |
| `order` | number | Sort order (ascending) |

---

## Internationalization

The app supports **English** and **Russian** via a custom translation system.

- All UI strings are in `client/src/lib/translations.ts`.
- Language state is managed by `LanguageContext` and persisted to `localStorage`.
- The `useLanguage()` hook exposes a `t(key)` function for string lookup.
- Language can be switched using the EN / RU toggle in the header.

To add a new language:
1. Add a new key to the `translations` object in `translations.ts`.
2. Extend the `Language` type accordingly.

---

## Known Limitations & Future Work

| Area | Issue | Suggested Fix |
|---|---|---|
| Revenue Calculation | Sums numeric portion of budget strings; text-range budgets like `"$5k-$10k"` are partially parsed | Add a dedicated numeric `budgetValue` field on the project |
| Admin Portfolio Tab | Translation keys exist but no UI to add/edit/delete portfolio items | Implement CRUD forms using `portfolioApi` |
| Admin Testimonials Tab | No admin interface for testimonials | Add CRUD forms using `testimonialsApi` |
| Support Replies | Admins can change ticket status but cannot write reply messages | Add `replies` sub-collection or `adminReply` field |
| Contact Response | "Responded" action updates a flag but does not send an email | Integrate Firebase Extension (Trigger Email) or transactional email API |
| Firestore Rules | Rules in `FIRESTORE_SECURITY_RULES.md` must be manually deployed | Automate with Firebase CLI: `firebase deploy --only firestore:rules` |
| Admin Role Creation | Requires manual Firestore Console edit | Add a one-time setup Cloud Function or CLI script |

---

## Deployment

### Production Build

```bash
npm run build
# Produces:
#   dist/public/  — React bundle (static assets)
#   dist/index.js — bundled Express server

npm start
```

### Replit Deployment

Pre-configured for autoscale deployment:

- **Build command:** `npm run build`
- **Run command:** `node dist/index.js`

Click **Deploy** in the Replit UI to publish. TLS, health checks, and CDN are handled automatically.

---

## Admin Setup

See `ADMIN_SETUP.md` for step-by-step instructions covering:

1. Registering the initial admin user via the Sign Up page.
2. Elevating the user's `role` field to `"admin"` in Firestore Console.
3. Verifying admin access in the app.

The `ADMIN_EMAIL` and `ADMIN_PASSWORD` values in `.env` are documentation references only — they do not automatically create an account or grant admin rights.
