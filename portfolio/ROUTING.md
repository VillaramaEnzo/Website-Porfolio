# Routing Architecture

## Overview

This project uses **Next.js App Router with client-side navigation**. This means:

✅ **Proper Next.js routes** - Each page is a real route (`/about`, `/contact`, etc.)  
✅ **No page reloads** - Navigation uses Next.js `Link` (client-side navigation)  
✅ **SSR/CSR benefits** - Each route gets server-side rendering and client-side hydration  
✅ **Smooth transitions** - Page transitions for better UX  
✅ **SEO friendly** - Each route is crawlable and shareable  

## How It Works

### 1. Route Structure

```
src/app/
├── page.tsx           # Home route (/)
├── about/
│   └── page.tsx       # About route (/about)
├── contact/
│   └── page.tsx        # Contact route (/contact)
└── projects/
    └── page.tsx        # Projects route (/projects)
```

### 2. Navigation Component

The `Nav` component (`src/components/navigation/Nav.tsx`) uses:
- Next.js `Link` component for navigation
- `usePathname()` hook to track active route
- Motion animations for active state indicator

```tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Link automatically does client-side navigation (no reload!)
<Link href="/about">About</Link>
```

### 3. Page Transitions

The `PageTransition` component (`src/components/PageTransition.tsx`) wraps page content in the layout to provide smooth transitions between routes.

### 4. Layout

The root layout (`src/app/layout.tsx`) includes:
- Navigation component (persists across routes)
- PageTransition wrapper (handles transitions)
- Global styles

## Adding a New Route

### Step 1: Create the Page

```tsx
// src/app/new-route/page.tsx
export default function NewRoute() {
  return (
    <div className="min-h-screen">
      <h1>New Route</h1>
      {/* Your content here */}
    </div>
  )
}
```

### Step 2: Add to Navigation

```tsx
// src/components/navigation/Nav.tsx
const navLinks: NavLink[] = [
  // ... existing links
  { href: '/new-route', name: 'New Route' },
]
```

That's it! Next.js `Link` automatically handles client-side navigation.

## Client-Side Navigation Explained

When you use Next.js `Link`:

```tsx
<Link href="/about">About</Link>
```

Next.js:
1. **Prefetches** the route on hover (in production)
2. **Navigates** client-side (no full page reload)
3. **Updates** the URL in the browser
4. **Renders** the new page component
5. **Maintains** React state and component tree

This is different from:
- ❌ `<a href="/about">` - Causes full page reload
- ✅ `<Link href="/about">` - Client-side navigation (no reload)

## Programmatic Navigation

You can also navigate programmatically:

```tsx
'use client'
import { useRouter } from 'next/navigation'

export default function MyComponent() {
  const router = useRouter()
  
  const handleClick = () => {
    router.push('/about') // Client-side navigation
  }
  
  return <button onClick={handleClick}>Go to About</button>
}
```

## Benefits

1. **Fast Navigation** - No page reloads, instant transitions
2. **Better UX** - Smooth page transitions
3. **SEO Friendly** - Each route is a real URL, crawlable
4. **Shareable URLs** - Users can bookmark and share specific routes
5. **SSR Benefits** - Each route gets server-side rendering
6. **State Preservation** - React state persists during navigation

## Migration from Test Project

When migrating components from the test project:

1. **Keep Next.js `Link` components** - They already do client-side nav
2. **Update route paths** - Use `/about` instead of `#about`
3. **Create page files** - Each route needs its own `page.tsx`
4. **Import components** - Import your section components into each page

Example migration:

```tsx
// Before (test project - hash routing)
<a href="#about">About</a>

// After (portfolio - Next.js routing)
<Link href="/about">About</Link>
```

## Notes

- Navigation is handled by Next.js automatically
- No need for custom routing logic
- Page transitions are optional but recommended for better UX
- Each route can have its own metadata, layout, etc.

