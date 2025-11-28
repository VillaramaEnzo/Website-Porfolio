# Component Migration Guide

This document helps you migrate working components from the `test/` project to this new single-page portfolio.

## Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx         # Single page with all sections
│   ├── components/
│   │   ├── sections/        # Page sections (Landing, About, Projects, etc.)
│   │   ├── widgets/         # Reusable UI components
│   │   └── navigation/      # Navigation components
│   ├── hooks/               # Custom React hooks
│   ├── context/             # React context providers
│   ├── utils/               # Utility functions
│   └── lib/                 # Library code
└── public/                  # Static assets
```

## Migration Steps

### 1. Copy Working Components

From `test/src/components/`, copy these to `portfolio/src/components/`:

**Sections:**
- `Sections/Landing.tsx` → `components/sections/Landing.tsx`
- `Sections/About.tsx` → `components/sections/About.tsx`
- `Sections/Showcase.tsx` → `components/sections/Showcase.tsx`
- `Sections/References.tsx` → `components/sections/References.tsx`
- `Sections/Values.tsx` → `components/sections/Values.tsx`
- `Sections/Gallery.tsx` → `components/sections/Gallery.tsx`

**Widgets:**
- `Widgets/Header/` → `components/widgets/Header/`
- `Widgets/Navigation/` → `components/navigation/`
- `Widgets/MatrixRain.tsx` → `components/widgets/MatrixRain.tsx`
- `Widgets/ScrambleText.tsx` → `components/widgets/ScrambleText.tsx`
- `Widgets/LandingText.tsx` → `components/widgets/LandingText.tsx`
- `Widgets/LandingVid.tsx` → `components/widgets/LandingVid.tsx`
- `Widgets/Clock/` → `components/widgets/Clock/`
- `Widgets/CommandCenter.tsx` → `components/widgets/CommandCenter.tsx`

**Other:**
- `Preloader/Preloader.tsx` → `components/Preloader.tsx`

### 2. Copy Hooks

From `test/src/hooks/` to `portfolio/src/hooks/`:
- `useNav.ts`
- `useScrollManager.ts`
- `useWindowSize.ts`
- `useClock.ts`
- `useScramble.ts`
- `useMatrixRain.ts`
- `useClientMount.ts`
- `useFadeTransition.ts`
- `useFetchData.ts`
- `useScrollLock.ts`
- `useAudienceAnimation.ts`

### 3. Copy Context Providers

From `test/src/context/` to `portfolio/src/context/`:
- `ScrollProvider.tsx`
- `HeaderProvider.tsx`
- `AudienceProvider.tsx`
- `ClientWrapper.tsx` (adapt for single-page)

### 4. Copy Utilities

From `test/src/utils/` to `portfolio/src/utils/`:
- `text.ts`
- `animations.ts`
- `getIcon.tsx`
- `getFormattedClockText.tsx`
- `calculateScrolHeights.tsx`
- `routes.ts` (adapt for single-page routing)

### 5. Copy Public Assets

From `test/public/` to `portfolio/public/`:
- `images/`
- `fonts/`
- `icons.json`
- `manifest.json`

### 6. Update Imports

When copying components, **keep the shorthand imports** - they should work as-is:
- `@/components/...` ✅ (already configured)
- `@/hooks/...` ✅
- `@/context/...` ✅
- `@/utils/...` ✅
- `@/lib/...` ✅

The `tsconfig.json` is already configured with `"@/*": ["./src/*"]`, so all your existing imports from the test project will work without changes!

### 7. Single-Page Integration

In `src/app/page.tsx`, import and use your sections:

```tsx
import Landing from '@/components/sections/Landing'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Showcase'
import Contact from '@/components/sections/Contact'

// Then in your sections array:
{sections.map((section, index) => {
  const SectionComponent = {
    landing: Landing,
    about: About,
    projects: Projects,
    contact: Contact,
  }[section.id]
  
  return (
    <section id={section.id} ref={(el) => { sectionRefs.current[index] = el }}>
      <SectionComponent />
    </section>
  )
})}
```

### 8. Client-Side Navigation

This project uses **Next.js App Router with client-side navigation**:
- Each route is a proper Next.js page (`/about/page.tsx`, `/contact/page.tsx`, etc.)
- Use Next.js `Link` component for navigation (already does client-side nav, no reloads!)
- Navigation component uses `usePathname()` to track active route
- `PageTransition` component provides smooth page transitions

### 9. Route Structure

Routes are set up as proper Next.js pages:
- `src/app/page.tsx` - Home/Landing page
- `src/app/about/page.tsx` - About page
- `src/app/contact/page.tsx` - Contact page
- `src/app/projects/page.tsx` - Projects page

Each page can import and render your section components. The navigation uses Next.js `Link` which automatically handles client-side navigation without page reloads.

### 10. Update Tailwind Config

Copy `test/tailwind.config.ts` to `portfolio/tailwind.config.ts` if you have custom config.

## Testing Components

Before migrating, test components in isolation:

1. Create a test page: `app/test/[component-name]/page.tsx`
2. Import and render the component
3. Fix any import/dependency issues
4. Once working, integrate into main page

## Notes

- Keep the `test/` project as reference
- Migrate one component at a time
- Test after each migration
- Update TypeScript types as needed
- Ensure all dependencies are in `package.json`

