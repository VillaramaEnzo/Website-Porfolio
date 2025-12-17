# Sections System

This directory contains reusable page sections that can be dynamically added/removed from pages.

## Structure

Each section should:
- Be a React component
- Accept no props (or minimal, optional props)
- Be self-contained with its own styling and logic
- Have a semantic `<section>` wrapper (handled by the page)

## Adding a New Section

1. Create a new component in this directory:
   ```tsx
   // src/components/sections/MyNewSection.tsx
   'use client'
   
   export default function MyNewSection() {
     return (
       <div className="min-h-screen">
         {/* Your section content */}
       </div>
     )
   }
   ```

2. Add it to the page configuration:
   ```tsx
   // src/app/homeConfig.ts (or page-specific config)
   import MyNewSection from '@/components/sections/MyNewSection'
   
   export const homeSections: SectionConfig[] = [
     // ... existing sections
     {
       name: 'My New Section',
       id: 'my-new-section',
       component: MyNewSection,
       height: 'min-h-screen',
     },
   ]
   ```

3. The section will automatically:
   - Be tracked by ScrollProvider
   - Be available for section navigation
   - Have proper semantic HTML structure

## Section Configuration

Each section in the config has:
- `name`: Display name (used for navigation)
- `id`: HTML id attribute (for anchor links)
- `component`: The React component to render
- `height`: Optional height class (defaults to 'min-h-screen')

## Example: LandingSection

The `LandingSection` wraps the `LandingText` widget and provides the `AudienceProvider` context. This pattern keeps widgets reusable while sections provide page-specific structure and context.

