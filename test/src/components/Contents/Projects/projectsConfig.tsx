import dynamic from 'next/dynamic'


const Projects = dynamic(() => import('@/components/Sections/projects/ProjectCarousel'), { ssr: false })

export const projectsSections = [
    { name: 'Projects', component: Projects, height: '100vh'},
] as const;


