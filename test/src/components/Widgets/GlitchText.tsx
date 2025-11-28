import { motion, useAnimationControls } from 'motion/react'
import { useEffect } from 'react'

interface GlitchTextProps {
  text: string
}

export default function GlitchText({ text }: GlitchTextProps) {
  const controls = useAnimationControls()
  const beforeControls = useAnimationControls()
  const afterControls = useAnimationControls()

  useEffect(() => {
    const glitchSequence = async () => {
      while (true) {
        // Main text glitch
        await controls.start({
          transform: [
            'translate(2px, 0) skew(0deg)',
            'translate(-2px, 0) skew(0deg)',
            'translate(0, 0) skew(5deg)',
            'translate(0, 0) skew(0deg)',
          ],
          transition: {
            duration: 0.2,
            times: [0, 0.2, 0.4, 1]
          }
        })

        // Before/After pseudo elements glitch
        await Promise.all([
          beforeControls.start({
            clipPath: [
              'inset(30% -6px 0 0)',
              'inset(50% -6px 30% 0)',
              'inset(10% -6px 85% 0)',
            ],
            x: [2, -1, 1],
            transition: {
              duration: 0.3,
              times: [0, 0.5, 1]
            }
          }),
          afterControls.start({
            clipPath: [
              'inset(70% -6px 0 0)',
              'inset(20% -6px 65% 0)',
              'inset(80% -6px 15% 0)',
            ],
            x: [-2, 1, -1],
            transition: {
              duration: 0.3,
              times: [0, 0.5, 1]
            }
          })
        ])

        // Pause between glitches
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000))
      }
    }

    glitchSequence()
  }, [controls, beforeControls, afterControls])

  return (
    <div className="relative font-mono font-semibold uppercase tracking-wider text-base">
      <motion.div
        animate={controls}
        className="relative text-white"
      >
        {text}
        <motion.div
          animate={beforeControls}
          className="absolute inset-0 text-[#ff00c1]"
          style={{ textShadow: '-2px 0 #ff00c1' }}
        >
          {text}
        </motion.div>
        <motion.div
          animate={afterControls}
          className="absolute inset-0 text-[#00fff9]"
          style={{ textShadow: '2px 0 #00fff9' }}
        >
          {text}
        </motion.div>
      </motion.div>
    </div>
  )
} 