# Easter Egg Page Guide

## Overview

This is a secret route (`/play`) that's not linked in the navigation - perfect for a fun 3D interactive experience like [Bruno Simon's portfolio](https://bruno-simon.com).

## How It Works

1. **Secret Route**: `/play` - accessible via direct URL but not in navigation
2. **No Navbar**: The navbar is automatically hidden on this page
3. **Full Screen**: Uses a full-screen layout for immersive 3D experience

## Accessing the Page

Users can access it by:
- Typing `/play` in the URL
- Clicking a hidden link/element (you can add easter egg triggers)
- Keyboard shortcuts (you can add these)

## Building the 3D Experience

### Step 1: Install Dependencies

```bash
npm install three @types/three
npm install @react-three/fiber @react-three/drei
npm install @react-three/rapier
npm install howler @types/howler
```

### Step 2: Basic Three.js Setup

Create a component like `src/components/play/Scene.tsx`:

```tsx
'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <OrbitControls />
    </Canvas>
  )
}
```

### Step 3: Add to Play Page

Update `src/app/play/page.tsx` to use your Scene component.

### Step 4: Add Physics (Optional)

Use Rapier for physics-based interactions:

```tsx
import { Physics } from '@react-three/rapier'

<Physics>
  {/* Your physics objects */}
</Physics>
```

### Step 5: Add Audio (Optional)

Use Howler.js for background music and sound effects:

```tsx
import { Howl } from 'howler'

const sound = new Howl({
  src: ['/audio/background.mp3'],
  loop: true
})
```

## Resources

- **Bruno Simon's Portfolio**: https://bruno-simon.com
- **Bruno's GitHub**: https://github.com/brunosimon/portfolio-2024
- **Three.js Journey**: https://threejs-journey.com (Bruno's course)
- **React Three Fiber Docs**: https://docs.pmnd.rs/react-three-fiber
- **Three.js Docs**: https://threejs.org/docs

## Ideas for Your Easter Egg

- Interactive 3D scene with your projects
- Mini game or interactive experience
- 3D showcase of your work
- Fun animations and interactions
- Hidden achievements or secrets

## Notes

- The page is fully functional but currently shows a placeholder
- Navbar is automatically hidden on `/play` route
- Full-screen layout is ready for 3D canvas
- You can add easter egg triggers anywhere in your site to reveal this page

