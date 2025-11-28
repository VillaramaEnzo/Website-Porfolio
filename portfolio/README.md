# Portfolio - Single Page Application

A fresh Next.js portfolio built with single-page routing (like Vue SPA).

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## 📁 Project Structure

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

### Import Paths

All imports use shorthand paths configured in `tsconfig.json`:
- `@/components/...` → `src/components/...`
- `@/hooks/...` → `src/hooks/...`
- `@/context/...` → `src/context/...`
- `@/utils/...` → `src/utils/...`
- `@/lib/...` → `src/lib/...`

## 🔄 Migration from Test Project

See [MIGRATION.md](./MIGRATION.md) for detailed instructions on migrating components from the `test/` project.

### Quick Start Migration

1. **Copy working components** from `../test/src/components/` to `src/components/`
2. **Copy hooks** from `../test/src/hooks/` to `src/hooks/`
3. **Copy context providers** from `../test/src/context/` to `src/context/`
4. **Copy utilities** from `../test/src/utils/` to `src/utils/`
5. **Copy public assets** from `../test/public/` to `public/`
6. **Imports should work as-is!** The `@/` shorthand paths are already configured
7. **Integrate sections** into `src/app/page.tsx`

## 🎯 Client-Side Routing (No Page Reloads)

This project uses **Next.js App Router with client-side navigation**:

- Each route is a proper Next.js page (`/about`, `/contact`, etc.)
- Navigation uses Next.js `Link` components (no full page reloads!)
- Page transitions for smooth UX
- SSR/CSR hydration benefits for each route
- URLs work properly (can bookmark, share, etc.)

### How It Works

- Clicking navigation links uses Next.js `Link` → client-side navigation (no reload)
- Each route (`/about/page.tsx`, `/contact/page.tsx`) is a separate page
- `PageTransition` component wraps content for smooth transitions
- Navigation component tracks active route with `usePathname()`

### Adding a New Route

1. Create a new page: `src/app/new-route/page.tsx`
2. Add to navigation in `src/components/navigation/Nav.tsx`

Example:
```tsx
// src/app/new-route/page.tsx
export default function NewRoute() {
  return <div>New Route Content</div>
}

// In Nav.tsx, add to navLinks array:
{ href: '/new-route', name: 'New Route' }
```

## 🛠️ Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Motion (Framer Motion)** - Animations
- **React Icons** - Icons

## 📝 Next Steps

1. ✅ Project structure created
2. ✅ Dependencies installed
3. ✅ Single-page layout set up
4. ⏳ Migrate components from test project
5. ⏳ Set up preloader (if needed)
6. ⏳ Add smooth scroll animations
7. ⏳ Customize styling

## 🎨 Component Migration Priority

Start with these working components:

1. **Header** - `Widgets/Header/Header.tsx`
2. **Navigation** - `Widgets/Navigation/SectionNav.tsx`
3. **Landing Section** - `Sections/Landing.tsx`
4. **Matrix Rain** - `Widgets/MatrixRain.tsx`
5. **Scramble Text** - `Widgets/ScrambleText.tsx`

## 💡 Tips

- Keep `test/` project as reference
- Test components in isolation before integrating
- Use the migration guide for step-by-step instructions
- Update TypeScript types as you migrate
- Ensure all dependencies are in `package.json`

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Motion Documentation](https://motion.dev)
- [Tailwind CSS](https://tailwindcss.com)
