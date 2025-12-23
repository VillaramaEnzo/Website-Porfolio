
import { AudienceProvider } from '@/context'
import LandingText from '@/components/widgets/LandingText'

/**
 * Landing Section Component
 * 
 * Simple landing section - ready for GSAP tutorial implementation.
 */
export default function LandingSection() {
  return (
    <AudienceProvider>
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center">
        <LandingText />
      </div>
    </AudienceProvider>
  )
}
