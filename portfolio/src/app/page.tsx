'use client'

import { usePage } from '@/context/PageContext'
import { motion, AnimatePresence } from 'motion/react'

// Page components - you'll import these from your test project
// import Landing from '@/components/sections/Landing'
// import About from '@/components/sections/About'
// import Projects from '@/components/sections/Showcase'
// import Contact from '@/components/sections/Contact'

function HomeContent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-6xl font-light mb-4">Home / Landing</h1>
        <p className="text-lg text-gray-600">Landing section content will go here</p>
      </div>
    </div>
  )
}

function AboutContent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-6xl font-light mb-4">About</h1>
        <p className="text-lg text-gray-600">About section content will go here</p>
      </div>
    </div>
  )
}

function ProjectsContent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-6xl font-light mb-4">Projects</h1>
        <p className="text-lg text-gray-600">Projects section content will go here</p>
      </div>
    </div>
  )
}

function ContactContent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-6xl font-light mb-4">Contact</h1>
        <p className="text-lg text-gray-600">Contact section content will go here</p>
      </div>
    </div>
  )
}

function PageContent() {
  const { currentPage } = usePage()

  const pages = {
    home: <HomeContent />,
    about: <AboutContent />,
    projects: <ProjectsContent />,
    contact: <ContactContent />,
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {pages[currentPage]}
      </motion.div>
    </AnimatePresence>
  )
}

export default function Home() {
  return <PageContent />
}
