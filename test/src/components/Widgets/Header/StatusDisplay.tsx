import { motion } from 'framer-motion'

interface StatusDisplayProps {
  className?: string
}

export default function StatusDisplay({ className }: StatusDisplayProps) {
  return (
    <div className={className}>
      Hire Me!
    </div>
  )
} 