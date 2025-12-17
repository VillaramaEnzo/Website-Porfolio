/**
 * Home page section configuration
 * Add or remove sections here to dynamically update the page
 */

import { ComponentType } from 'react'
import LandingSection from '@/components/sections/LandingSection'
import NewSection from '@/components/sections/NewSection'

export interface SectionConfig {
  name: string
  id: string
  component: ComponentType
  height?: string // Optional: 'h-screen', 'min-h-screen', etc.
}

export const homeSections: SectionConfig[] = [
  {
    name: 'Landing',
    id: 'landing',
    component: LandingSection,
    height: 'h-screen',
  },
  {
    name: 'About',
    id: 'about',
    component: NewSection,
    height: 'h-screen',
  },
  // Add more sections here:
  // {
  //   name: 'About',
  //   id: 'about',
  //   component: AboutSection,
  //   height: 'min-h-screen',
  // },
]

