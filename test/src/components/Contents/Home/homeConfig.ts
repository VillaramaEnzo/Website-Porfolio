import dynamic from 'next/dynamic'

const Landing = dynamic(() => import('@/components/Sections/Landing'), { ssr: false })
const Projects = dynamic(() => import('@/components/Sections/Showcase'), { ssr: true })
const Gallery = dynamic(() => import('@/components/Sections/Gallery'), { ssr: true })
const Values = dynamic(() => import('@/components/Sections/Values'), { ssr: true })
const Background = dynamic(() => import('@/components/Sections/Background'), { ssr: true })
const References = dynamic(() => import('@/components/Sections/References'), { ssr: true })
const About = dynamic(() => import('@/components/Sections/About'), { ssr: true })
// Import additional sections here

export const homeSections = [
  { name: 'Introduction', component: Landing, height: '100vh' },
  { name: 'Projects', component: Projects, height: '100vh' },
  { name: 'Gallery', component: Gallery, height: '100vh' },
  { name: 'Values', component: Values, height: '100vh' },
  { name: 'Background', component: Background, height: '100vh' },
  { name: 'References', component: References, height: '100vh' },
  { name: 'About', component: About, height: '100vh' },
  // Add Additional sections here
]
