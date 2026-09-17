# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Arcade Vault — a platform for playing games online and competing for the highest score (per README.md, in Spanish).

This is a freshly scaffolded Next.js app (App Router) with no custom routes, components, or game logic yet beyond the default `create-next-app` starter page.

## Commands

- `npm run dev` — start the dev server (Next.js 16, Turbopack by default)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint (flat config via `eslint.config.mjs`, using `eslint-config-next`)

There is no test setup yet.

## Architecture

- App Router lives in `app/`. `app/layout.tsx` is the root layout, `app/page.tsx` is the home page, `app/globals.css` holds global Tailwind styles.
- Path alias `@/*` maps to the repo root (see `tsconfig.json`).
- Styling uses Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config` file — v4 is CSS-first, configured in `app/globals.css`).
- Strict TypeScript is enabled (`strict: true` in `tsconfig.json`).

## Spec-driven workflow

The README indicates this project follows spec-driven development using the `/spec` and `/spec-impl` workflow from [Klerith/fernando-skills](https://github.com/Klerith/fernando-skills), installed via:

```bash
npx skills@latest add Klerith/fernando-skills
```

These skills are not currently installed in this environment — if `/spec` or `/spec-impl` are invoked and unavailable, the user may need to run the command above first.
