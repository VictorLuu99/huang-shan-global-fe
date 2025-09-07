# Deployment Guide - Huang Shan Global Logistics Website

## Overview
This is a multilingual Next.js 15 application with internationalization support for Vietnamese (default), Chinese, and English. The application features a modern logistics company presentation with comprehensive SEO optimization.

## Prerequisites
- Node.js 18+ (recommended: 20+)
- npm or pnpm
- Git

## Environment Setup

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Development Server
```bash
npm run dev
# Application will be available at http://localhost:3000
```

### 3. Production Build
```bash
npm run build
npm run start
```

## Deployment Options

### Option 1: Vercel (Recommended)
1. Connect repository to Vercel
2. Configure build settings:
   - Framework Preset: Next.js
   - Node.js Version: 20.x
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `.next` (default)

### Option 2: Netlify
1. Connect repository to Netlify
2. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `.next`
   - Node Version: 20

### Option 3: Static Export
```bash
npm run export
# Static files will be generated in the 'out' directory
```

### Option 4: Docker Deployment
```bash
# Build Docker image
docker build -t huang-shan-logistics .

# Run container
docker run -p 3000:3000 huang-shan-logistics
```

## Environment Variables
Currently, no environment variables are required. All configuration is handled through the codebase.

## Performance Features
- Dynamic imports for route-based code splitting
- Optimized images using CSS background-image
- Memoized components to prevent unnecessary re-renders
- Efficient animation loading with Framer Motion
- Optimized loading states with custom loader component

## SEO Features
- Complete meta tags with Open Graph and Twitter Cards
- Structured data (JSON-LD) for Organization, Website, and Article schemas
- Proper canonical URLs
- Language-specific alternates
- Sitemap-ready structure

## Internationalization
- Default locale: Vietnamese (vi)
- Supported locales: Vietnamese (vi), Chinese (zh), English (en)
- Automatic locale detection and persistence via cookies
- Complete translations for all user-facing content

## Browser Support
- Modern browsers (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- Mobile responsive design
- Progressive enhancement approach

## Performance Monitoring
- Core Web Vitals optimized
- Bundle size analysis available via `npm run analyze`
- Loading performance optimized with Suspense boundaries

## Quality Assurance Checklist
- [x] TypeScript strict mode compliance
- [x] ESLint configuration with Next.js rules
- [x] Mobile-first responsive design
- [x] Accessibility considerations (ARIA labels, semantic HTML)
- [x] SEO optimization
- [x] Performance optimization
- [x] Cross-browser compatibility
- [x] Internationalization support

## Post-Deployment Verification
1. Test all language switching functionality
2. Verify SEO meta tags using browser dev tools
3. Check mobile responsiveness on various devices
4. Test all navigation and form functionality
5. Verify page load performance using Lighthouse

## Support
For technical support or questions about deployment, refer to:
- Next.js documentation: https://nextjs.org/docs
- Tailwind CSS documentation: https://tailwindcss.com/docs
- Framer Motion documentation: https://www.framer.com/motion/
- next-intl documentation: https://next-intl-docs.vercel.app/