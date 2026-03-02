# Parallax & Scroll Animation Examples

This document shows how to use the ScrollProvider with parallax effects for different use cases.

## Setup

```tsx
import { ScrollProvider } from '@/context/ScrollProvider'
import { useParallax, useSectionParallax, useElementInView, useCrossSectionParallax } from '@/hooks/useParallax'

// Window scroll mode (for parallax)
<ScrollProvider sectionRefs={sectionRefs} sectionNames={names}>
  {/* Your content */}
</ScrollProvider>
```

---

## 1. Parallax Effects on Entire Sections

Animate entire sections as they scroll into view.

**Important**: Apply transforms to inner content, not the section element itself, to prevent gaps between sections.

```tsx
import { useRef } from 'react'
import { motion, useTransform } from 'motion/react'
import { useSectionParallax } from '@/hooks/useParallax'

function Section({ index }: { index: number }) {
  const sectionRef = useRef<HTMLElement>(null)
  const progress = useSectionParallax(index, 0, 1) // Track section 0
  
  // Parallax: move content up as it scrolls
  const y = useTransform(progress, [0, 1], [100, -100])
  const opacity = useTransform(progress, [0, 0.5, 1], [0, 1, 0.8])
  
  return (
    <section
      ref={sectionRef}
      className="h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Apply transforms to inner content, not the section */}
      <motion.div
        style={{ y, opacity }}
        className="w-full"
      >
        <h2>Section {index}</h2>
      </motion.div>
    </section>
  )
}
```

**Why**: Transforming the section element creates visual gaps because the layout still reserves space. Transforming inner content keeps sections flush while achieving the parallax effect.

---

## 2. Parallax Effects on Components Within a Section

Animate individual components as they scroll into view.

```tsx
import { useRef } from 'react'
import { motion, useTransform } from 'motion/react'
import { useParallax } from '@/hooks/useParallax'

function ParallaxCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const progress = useParallax(cardRef, 0, 1)
  
  // Different parallax speeds for different elements
  const cardY = useTransform(progress, [0, 1], [50, -50])
  const imageY = useTransform(progress, [0, 1], [100, -100]) // Faster parallax
  const textOpacity = useTransform(progress, [0, 0.3, 0.7, 1], [0, 0, 1, 1])
  
  return (
    <motion.div
      ref={cardRef}
      style={{ y: cardY }}
      className="relative"
    >
      <motion.img
        src="/image.jpg"
        style={{ y: imageY }}
        className="w-full"
      />
      <motion.p style={{ opacity: textOpacity }}>
        Text fades in as card scrolls
      </motion.p>
    </motion.div>
  )
}
```

---

## 3. Cross-Section Parallax (Component Triggered by Different Section)

Animate a component based on another section's scroll position.

```tsx
import { useRef } from 'react'
import { motion, useTransform } from 'motion/react'
import { useCrossSectionParallax } from '@/hooks/useParallax'

function CrossSectionAnimation() {
  // Element in Section 1 that triggers animation
  const triggerRef = useRef<HTMLDivElement>(null)
  
  // Element in Section 2 that gets animated
  const targetRef = useRef<HTMLDivElement>(null)
  
  // Animation progress based on trigger element's scroll
  const progress = useCrossSectionParallax(triggerRef, targetRef, 0, 1)
  
  const scale = useTransform(progress, [0, 1], [0.5, 1])
  const rotate = useTransform(progress, [0, 1], [0, 360])
  
  return (
    <>
      {/* Section 1 - Trigger */}
      <section>
        <div ref={triggerRef} className="h-screen">
          <h2>Section 1 - Scroll here to animate Section 2</h2>
        </div>
      </section>
      
      {/* Section 2 - Animated */}
      <section>
        <motion.div
          ref={targetRef}
          style={{ scale, rotate }}
          className="fixed top-1/2 left-1/2"
        >
          Animated by Section 1's scroll!
        </motion.div>
      </section>
    </>
  )
}
```

---

## 4. Scroll-Triggered Visibility

Show/hide elements when they enter the viewport.

```tsx
import { useRef } from 'react'
import { motion } from 'motion/react'
import { useElementInView } from '@/hooks/useParallax'

function FadeInOnScroll() {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useElementInView(ref, 0.1) // 10% must be visible
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: isVisible.get() ? 1 : 0,
        y: isVisible.get() ? 0 : 50
      }}
      transition={{ duration: 0.6 }}
    >
      Fades in when scrolled into view
    </motion.div>
  )
}
```

---

## 5. Advanced: Using Raw Scroll Values

For custom parallax effects, use the raw scroll values directly.

```tsx
import { useScrollContext } from '@/context/ScrollProvider'
import { useTransform } from 'motion/react'

function CustomParallax() {
  const { scrollY, scrollYProgress } = useScrollContext()
  
  // Custom parallax calculation
  const parallaxY = useTransform(
    scrollY,
    [0, 1000], // Scroll range
    [0, -200]  // Movement range
  )
  
  // Opacity based on overall scroll progress
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 0.5, 0]
  )
  
  return (
    <motion.div style={{ y: parallaxY, opacity }}>
      Custom parallax effect
    </motion.div>
  )
}
```

---

## 6. Staggered Animations Within a Section

Animate multiple elements with staggered timing.

```tsx
import { useRef } from 'react'
import { motion, useTransform } from 'motion/react'
import { useParallax } from '@/hooks/useParallax'

function StaggeredCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const progress = useParallax(containerRef, 0, 1)
  
  const cards = [0, 1, 2, 3]
  
  return (
    <div ref={containerRef}>
      {cards.map((card, index) => {
        // Stagger the animation start
        const cardProgress = useTransform(
          progress,
          [index * 0.2, (index * 0.2) + 0.3],
          [0, 1],
          { clamp: true }
        )
        
        const y = useTransform(cardProgress, [0, 1], [50, 0])
        const opacity = useTransform(cardProgress, [0, 1], [0, 1])
        
        return (
          <motion.div
            key={card}
            style={{ y, opacity }}
            className="mb-4"
          >
            Card {card}
          </motion.div>
        )
      })}
    </div>
  )
}
```

---

## Tips

1. **Window Scroll Mode**: Use `<ScrollProvider>` without `containerRef` for parallax
2. **Container Scroll Mode**: Use `<ScrollProvider containerRef={ref}>` for section tracking
3. **Performance**: Use `clamp: true` in `useTransform` to prevent unnecessary calculations
4. **Offset Values**: 
   - `0` = element enters viewport
   - `0.5` = element halfway through viewport
   - `1` = element fully past viewport
5. **Threshold**: For `useElementInView`, `0.1` means 10% of element must be visible

