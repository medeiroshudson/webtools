# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WebTools is a collection of browser-based utility tools built with Next.js 16, React 19, and TypeScript. All tools run client-side - no server-side file processing. The app supports Portuguese (pt-BR) and English via next-intl.

**Available Tools:**
- JSON Formatter (format, minify, validate)
- Base64 Converter (files, images, PDFs, text)
- XML Formatter (format, minify, convert to JSON)
- PDF Tools (merge, split, compress, rotate, extract images)
- Collaborative Notes (the only tool using Supabase backend)

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

**Supabase Database (Notes feature only):**
```bash
npm run supabase:link    # Link local project to Supabase
npm run supabase:push    # Push migrations to remote DB
npm run supabase:pull    # Pull schema from remote DB
npm run supabase:types   # Generate TypeScript types from DB
npm run db:setup         # Run link + push automatically
```

## Architecture

### Project Structure
```
app/                    # Next.js App Router pages
├── [tool-name]/        # Route for each tool
components/
├── ui/                 # Shadcn/UI components (Radix UI primitives)
├── layout/             # Navbar, Footer, etc.
└── [tool-name]/        # Tool-specific components
lib/
├── i18n/               # Translation dictionaries (pt-BR, en)
├── api/                # API utilities (Supabase client)
└── pdf/                # PDF processing helpers
supabase/migrations/    # Database migrations
```

### Key Patterns

**Adding a New Tool:**
1. Create `app/[tool-name]/page.tsx` for the route
2. Create `components/[tool-name]/` for tool components
3. Add translations in `lib/i18n/[locale].ts`
4. Add navigation link in `components/layout/Navbar.tsx`

**State Management:**
- Use React `useState` for simple component state
- Use Zustand stores for complex state (see PDF tools)
- I18n uses `next-intl` hooks

**File Processing:**
- All file operations happen in-browser using appropriate libraries
- Use `URL.createObjectURL()` for efficient file handling
- Never upload files to servers

**UI Components:**
- Use Shadcn/UI components from `components/ui/`
- Follow existing component patterns for consistency
- TailwindCSS v4 with CSS variables for theming

### Database (Supabase)

Only the Notes feature uses Supabase. The database is optional for other tools.

**Setup:** Requires `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

All database operations are protected by Row Level Security (RLS). Migrations are in `supabase/migrations/`.

## Technology Stack

- **Framework:** Next.js 16.1.2 (App Router) with React Compiler enabled
- **UI:** Shadcn/UI + Radix UI + TailwindCSS v4
- **State:** Zustand for complex state, React hooks otherwise
- **i18n:** next-intl (pt-BR, en)
- **PDF:** pdf-lib, react-pdf, pdfjs-dist
- **Icons:** Lucide React
- **Database:** Supabase (Notes feature only)

## Path Aliases

Use `@/` prefix for imports from project root:
```typescript
import { Component } from "@/components/ui/component"
import { function } from "@/lib/utils"
```
