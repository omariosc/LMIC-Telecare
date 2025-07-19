## Relevant Files

- `src/pages/index.tsx` - Main landing page component with all sections
- `src/pages/index.test.tsx` - Unit tests for landing page
- `src/components/Hero.tsx` - Hero section component with CTAs
- `src/components/Hero.test.tsx` - Unit tests for Hero component
- `src/components/ProblemStatement.tsx` - Problem statement section with statistics
- `src/components/ProblemStatement.test.tsx` - Unit tests for ProblemStatement
- `src/components/HowItWorks.tsx` - Process explanation component
- `src/components/HowItWorks.test.tsx` - Unit tests for HowItWorks
- `src/components/Features.tsx` - Features overview component
- `src/components/Features.test.tsx` - Unit tests for Features
- `src/components/ImpactMetrics.tsx` - Impact metrics with coming soon placeholders
- `src/components/ImpactMetrics.test.tsx` - Unit tests for ImpactMetrics
- `src/components/Testimonials.tsx` - Trust signals and testimonials component
- `src/components/Testimonials.test.tsx` - Unit tests for Testimonials
- `src/components/FAQ.tsx` - Collapsible FAQ component
- `src/components/FAQ.test.tsx` - Unit tests for FAQ
- `src/components/Partners.tsx` - Partner organizations display
- `src/components/Partners.test.tsx` - Unit tests for Partners
- `src/components/LanguageToggle.tsx` - Language switching component
- `src/components/LanguageToggle.test.tsx` - Unit tests for LanguageToggle
- `src/hooks/useLanguage.ts` - Language detection and management hook
- `src/hooks/useLanguage.test.ts` - Unit tests for language hook
- `src/utils/analytics.ts` - Analytics tracking utilities
- `src/utils/analytics.test.ts` - Unit tests for analytics
- `src/styles/globals.css` - Global styles and CSS variables
- `src/locales/en.json` - English translations
- `src/locales/ar.json` - Arabic translations

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Set up project foundation and infrastructure
  - [x] 1.1 Initialize Next.js project with TypeScript and strict mode configuration
  - [x] 1.2 Set up TailwindCSS with mobile-first responsive breakpoints
  - [x] 1.3 Configure PWA support with next-pwa for offline capabilities
  - [ ] 1.4 Set up Jest and React Testing Library for TDD
  - [ ] 1.5 Create global styles with medical color palette (blues/greens)
  - [ ] 1.6 Set up environment variables for API endpoints and analytics keys
  - [ ] 1.7 Configure ESLint and Prettier for code consistency
  - [ ] 1.8 Create base layout component with semantic HTML structure

- [ ] 2.0 Implement core landing page sections
  - [ ] 2.1 Build Hero component with crisis headline and surgeon statistic
  - [ ] 2.2 Implement ProblemStatement component with Gaza healthcare statistics
  - [ ] 2.3 Create HowItWorks component with 3-4 step visual process
  - [ ] 2.4 Build Features component with icon grid and descriptions
  - [ ] 2.5 Develop ImpactMetrics component with "Coming Soon" placeholders
  - [ ] 2.6 Create Testimonials component with GMC verification badge
  - [ ] 2.7 Build FAQ component with collapsible mobile-optimized sections
  - [ ] 2.8 Implement Partners component with logo display
  - [ ] 2.9 Add multiple CTA sections throughout the page
  - [ ] 2.10 Create donation section with blockade impact messaging

- [ ] 3.0 Build internationalization and language support
  - [ ] 3.1 Set up next-i18next for internationalization framework
  - [ ] 3.2 Create English translation file (en.json) with all content
  - [ ] 3.3 Create Arabic translation file (ar.json) with medical accuracy
  - [ ] 3.4 Implement LanguageToggle component with flag icons
  - [ ] 3.5 Build useLanguage hook for auto-detection based on location
  - [ ] 3.6 Configure RTL layout support for Arabic version
  - [ ] 3.7 Add language persistence in localStorage
  - [ ] 3.8 Test all components for proper RTL rendering
  - [ ] 3.9 Ensure "Hack for Gaza 2025 Winner (إن شاء الله)" displays correctly

- [ ] 4.0 Optimize performance and mobile experience
  - [ ] 4.1 Implement image optimization with next/image and WebP format
  - [ ] 4.2 Set up lazy loading for below-fold content
  - [ ] 4.3 Inline critical CSS for faster first paint
  - [ ] 4.4 Configure CDN deployment (Vercel or similar)
  - [ ] 4.5 Implement service worker for offline access
  - [ ] 4.6 Optimize bundle size to stay under 2MB total
  - [ ] 4.7 Add loading states and skeleton screens
  - [ ] 4.8 Test on 3G throttled connection to ensure <3s load time
  - [ ] 4.9 Implement responsive images with srcset
  - [ ] 4.10 Add touch-friendly interactions (minimum 44px tap targets)

- [ ] 5.0 Integrate analytics and tracking
  - [ ] 5.1 Set up Google Analytics 4 with custom events
  - [ ] 5.2 Implement analytics utility functions for event tracking
  - [ ] 5.3 Add conversion tracking for all CTAs
  - [ ] 5.4 Set up scroll depth tracking for engagement metrics
  - [ ] 5.5 Implement GDPR-compliant cookie consent banner
  - [ ] 5.6 Configure heatmap tracking (Hotjar integration)
  - [ ] 5.7 Add custom events for language toggle usage
  - [ ] 5.8 Set up A/B testing framework for CTA variations
  - [ ] 5.9 Create analytics dashboard for monitoring KPIs
  - [ ] 5.10 Test all tracking events in development environment
