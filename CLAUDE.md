# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **multilingual logistics website** project for **Huang Shan Global** - a China-Vietnam logistics company. The project includes:
1. A standalone logistics template (`template_website_logistics.ts`)
2. A complete Next.js 15 application (`website/` directory)

The website features a modern, animated logistics platform with full internationalization support for Vietnamese (default), Chinese, and English. It includes a comprehensive company presentation with services, company information, and multi-page navigation.

## Essential Commands

**Development (run from `website/` directory):**
```bash
npm run dev        # Start development server at http://localhost:3000
npm run build      # Create production build
npm run start      # Start production server (requires build first)
npm run lint       # Check code quality with ESLint
```

**Before committing any changes:**
1. Run `npm run lint` to ensure code quality
2. Run `npm run build` to verify production build works
3. Test `npm run dev` starts successfully

**Development Server Notes:**
- If port 3000 shows "EADDRINUSE" error, the development server is already running
- No need to start a new server on a different port - just use the existing one
- Check http://localhost:3000 to verify main website is working

## Architecture & Structure

**Technology Stack:**
- Next.js 15 with App Router and React 19
- TypeScript with strict mode enabled
- Tailwind CSS 4 for styling
- Framer Motion for animations
- next-intl for internationalization
- Lucide React for icons

**Key Directories:**
- `src/app/[locale]/` - Next.js App Router with locale-based routing
- `src/app/[locale]/about/` - About page route
- `src/components/` - Reusable React components (LogisticsLandingPage, AboutPage, LanguageSwitcher)
- `messages/` - Translation files (en.json, vi.json, zh.json)
- `src/i18n.ts` - Internationalization configuration with next-intl

**Import Aliases:**
- Use `@/*` for imports from `src/` directory
- Example: `import Component from '@/components/Component'`

**Routing Architecture:**
- Uses Next.js 15 App Router with `[locale]` dynamic routing
- Main layout in `src/app/[locale]/layout.tsx` handles i18n setup
- Root layout in `src/app/layout.tsx` is minimal wrapper
- Page routing: `/` (home), `/about` (company info)
- Navigation links use proper locale-aware routing

**Content Management:**
- Company content sourced from Notion API
- Translation keys in `messages/*.json` organized by sections
- All Vietnamese content reflects Huang Shan Global branding

## Development Guidelines

**Component Patterns:**
- Functional components with TypeScript interfaces
- Framer Motion for animations with `viewport={{ once: true }}` pattern
- Responsive design with Tailwind CSS utility classes
- Internationalization using `useTranslations` hook from next-intl

**Animation Conventions:**
- Staggered entrance animations using `delay: index * 0.1`
- Scroll-triggered animations with `useInView` hook
- Spring-based animations for smooth interactions

**Navigation System:**
- Fixed header with backdrop blur effect and responsive design  
- Desktop: horizontal navigation, mobile: hamburger menu with AnimatePresence
- Navigation state managed with React useState for mobile menu toggle
- Menu items: Home, About, Services, Policies, Recruitment, News, Knowledge, Contact
- Links use href routing with proper section IDs and cross-page navigation

**Internationalization:**
- Default locale: Vietnamese (vi)
- Translation keys organized by sections (nav, hero, about, services, stats, etc.)
- All user-facing text must have translation keys
- Supports content updates from Notion API integration

## Code Quality Standards

- TypeScript strict mode compliance required
- ESLint configuration extends Next.js and TypeScript rules
- Mobile-first responsive design approach
- Accessibility considerations with semantic HTML and ARIA labels
- Performance optimization for animations and build size