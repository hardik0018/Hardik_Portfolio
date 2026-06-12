# AGENTS.md — Developer and AI Agent Guidelines

Welcome to the **Hardik Vatukiya Portfolio** codebase. This document outlines the technical stack, codebase architecture, development workflows, coding standards, and safety guardrails to guide AI agents and developers working on this project.

---

## 1. Project Summary & Tech Stack

This project is a high-performance, animation-rich developer portfolio and CMS workspace structured as a monorepo containing a Next.js App Router frontend and a Sanity v5 headless CMS studio.

### Core Stack
* **Frontend**: Next.js 16.2.6 (React 19)
* **Styling**: Tailwind CSS v4 (configured via `@import "tailwindcss"` and `@theme` variables)
* **Animations**: GSAP (GreenSock Animation Platform) 3.15.0 with `@gsap/react` `useGSAP` hook, Framer Motion (under the package name `motion` v12.38.0)
* **Smooth Scrolling**: Lenis 1.3.23
* **Interactive Visuals**: Cobe (3D Canvas Globe), D3 (Data visualization)
* **CMS**: Sanity v5 Studio (`sanity` v5.27.0)
* **Icons**: Lucide React (`lucide-react`)
* **Email Service**: Resend API
* **Package Manager**: `pnpm`

---

## 2. Directory Structure & Workspace Rules

The repository contains two main workspace directories:

```
hardik-portfolio/
├── frontend/                     # Next.js 16 (React 19) App Router frontend
│   ├── app/                      # Page routes, layouts, and global styling
│   │   ├── api/                  # API endpoints (contact form, CDN cache revalidation)
│   │   ├── projects/             # Work index page & [slug] dynamic project detail pages
│   │   ├── globals.css           # Tailwind v4 configuration, font overrides & custom global classes
│   │   └── layout.tsx            # Main layout importing Google Fonts, Lenis & analytics
│   ├── components/               # React UI components
│   │   ├── ui/                   # Reusable base components (confetti Button, Card, RevealImage)
│   │   └── sections/             # Landing page sections (Hero, About, Projects, Journey, etc.)
│   ├── lib/                      # Sanity Client, GROQ Queries, SEO config, GSAP & Schema helpers
│   └── package.json              # Frontend dependencies and run scripts
│
└── studio-hardik-vatukiya/       # Sanity v5 Studio (Headless CMS)
    ├── schemaTypes/              # Document types and models (hero, about, skill, faq, etc.)
    ├── sanity.config.ts          # Studio routing, plugins, singletons, and desk structure
    ├── sanity.cli.ts             # Sanity API configurations & deployment settings
    └── package.json              # Sanity dependency packages
```

### Folder Rules
* All UI components must be placed in [frontend/components/ui/](file:///e:/Home/Hardik_Portfolio/frontend/components/ui) if they are atomic/reusable (e.g. Buttons, Cards), or [frontend/components/sections/](file:///e:/Home/Hardik_Portfolio/frontend/components/sections) if they represent landing page modules.
* Do not mix server and client code. Place `"use client"` directives strictly at the top of files that require browser APIs, GSAP hooks, or state.
* Add schema definitions exclusively within [studio-hardik-vatukiya/schemaTypes/](file:///e:/Home/Hardik_Portfolio/studio-hardik-vatukiya/schemaTypes) and register them in [index.ts](file:///e:/Home/Hardik_Portfolio/studio-hardik-vatukiya/schemaTypes/index.ts).

---

## 3. Important Development Commands

Run commands from the respective workspace folder.

### Frontend (`/frontend`)
* **Start Dev Server**: `pnpm dev`
* **Build Project**: `pnpm build`
* **Start Production Build**: `pnpm start`
* **Lint Check**: `pnpm lint`
* **Type Check**: `pnpm type-check`
* **Analyze Bundle Size**: `pnpm analyze` (executes `cross-env ANALYZE=true next build`)

### Sanity Studio (`/studio-hardik-vatukiya`)
* **Start Dev Studio**: `pnpm dev` (starts on [http://localhost:3333](http://localhost:3333))
* **Build Studio**: `pnpm build`
* **Deploy Studio**: `pnpm deploy` (deploys to Sanity cloud hosting)
* **Deploy GraphQL API**: `pnpm deploy-graphql`

---

## 4. Coding & Architecture Rules

### Caching and Data Fetching
* Landing page data is fetched on the server in [app/page.tsx](file:///e:/Home/Hardik_Portfolio/frontend/app/page.tsx) via `Promise.all` and injected into the client page wrapper as initial props.
* Dynamic project pages utilize Next.js **Incremental Static Regeneration (ISR)** with `export const revalidate = 60;`.
* Use `sanityFetch` defined in [lib/sanity.live.ts](file:///e:/Home/Hardik_Portfolio/frontend/lib/sanity.live.ts) for query executions.

### GSAP & Animations
* Always use the `useGSAP` hook from `@gsap/react` or [lib/gsap.ts](file:///e:/Home/Hardik_Portfolio/frontend/lib/gsap.ts) to manage animations. Never initialize timelines inside standard `useEffect` without proper manually-coded cleanup.
* For scroll-pinned page elements (like the `.about-container` and `.hero-container`), do not gate the render behind lazy-loading components. Mid-scroll mounts recalculate viewport heights and cause severe scroll-jumping bugs.
* Heavy components must use `<LazySection>` with a generous `rootMargin` (e.g., `500px` or `300px`) to mount and measure DOM heights before entering the viewport.

### Style System (Tailwind v4)
* Tailwind v4 uses CSS imports. Do not write Tailwind v3 `tailwind.config.js`. Update theme configurations in [frontend/app/globals.css](file:///e:/Home/Hardik_Portfolio/frontend/app/globals.css) inside the `@theme` block.
* Reference design system colors via CSS custom variables (`var(--accent-primary)`, `var(--background)`) instead of hardcoded hex values to support future themes and dark modes.

---

## 5. Security & Safety Rules

* **Secrets Management**: Never commit actual secrets. Store api keys (`RESEND_API_KEY`, `SANITY_REVALIDATE_SECRET`) in `.env.local` which is git-ignored.
* **Content Security Policy (CSP)**: The application enforces a strict Content Security Policy in [next.config.ts](file:///e:/Home/Hardik_Portfolio/frontend/next.config.ts). If you introduce new external API endpoints or script providers, they must be explicitly whitelisted in the `cspHeader` script, style, image, or connection sections.
* **Honeypot Filter**: The contact form POST route in [app/api/contact/route.ts](file:///e:/Home/Hardik_Portfolio/frontend/app/api/contact/route.ts) utilizes a honeypot field (`website`). Do not delete or render this field visible to human users.
* **Input Sanitization**: User-submitted form inputs are escaped via `escapeHtml()` inside [app/api/contact/route.ts](file:///e:/Home/Hardik_Portfolio/frontend/app/api/contact/route.ts) before constructing email bodies to prevent HTML or XSS injection in email clients.

---

## 6. Verification and Testing Guidelines

* **Linting & Types**: Before marking a task complete, run `pnpm lint` and `pnpm type-check` in the `frontend` folder to guarantee there are no compilation errors.
* **Build Verification**: Run `pnpm build` to verify Next.js builds successfully under production settings, particularly verifying that dynamic parameter pre-generation (`generateStaticParams`) compiles without issues.
* **Web Vitals check**: Keep bundle sizes small; use `pnpm analyze` to inspect JS bundles if code additions trigger performance alerts.

---

## 7. Files to Read First

1. [frontend/app/globals.css](file:///e:/Home/Hardik_Portfolio/frontend/app/globals.css) — Color variables and font declarations.
2. [frontend/components/ClientHome.tsx](file:///e:/Home/Hardik_Portfolio/frontend/components/ClientHome.tsx) — Main structural container of landing page sections.
3. [frontend/components/ClientPage.tsx](file:///e:/Home/Hardik_Portfolio/frontend/components/ClientPage.tsx) — GSAP pinning logic and layout scroll animation timeline.
4. [frontend/lib/sanity.queries.ts](file:///e:/Home/Hardik_Portfolio/frontend/lib/sanity.queries.ts) — GROQ content fetch definitions.
5. [studio-hardik-vatukiya/sanity.config.ts](file:///e:/Home/Hardik_Portfolio/studio-hardik-vatukiya/sanity.config.ts) — Studio routing, desk architecture, and singletons.
