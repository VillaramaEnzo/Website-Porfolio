'use client'

import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import Studiolights from '@/components/Studiolights'
import MacbookPro14 from '@/components/models/Macbook-14'

export default function Test3DPage() {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'l') {
        console.log('Press L key to toggle all labels (feature coming soon)')
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f0f0f0' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50, near: 0.1, far: 100 }}>
        <Studiolights />
        <MacbookPro14 scale={0.01} position={[0, 0, 0]} />
        <OrbitControls />
      </Canvas>
      
      <div style={{ 
        position: 'absolute', 
        top: 20, 
        left: 20, 
        background: 'rgba(0,0,0,0.7)', 
        color: 'white', 
        padding: '15px', 
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 1000
      }}>
        <p><strong>🔍 Mesh Debugger</strong></p>
        <p>• <strong>Hover</strong> over meshes to see names</p>
        <p>• <strong>Click</strong> meshes to lock label</p>
        <p>• Check <strong>console</strong> for detailed info</p>
      </div>
    </div>
  )
}
