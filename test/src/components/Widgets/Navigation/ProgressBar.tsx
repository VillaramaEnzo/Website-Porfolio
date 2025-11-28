import { useScrollContext } from '@/context/ScrollProvider'
import { motion } from 'motion/react'

const getColorForSection = (section: number | null) => {
    const colors = [
        'bg-blue-400',
        'bg-indigo-400',
        'bg-purple-400',
        'bg-pink-400',
        'bg-rose-400',
        'bg-orange-400',
    ];

    if (section === null) return colors[0];
    return colors[section % colors.length];
};

export default function ProgressBar() {
    const { scrollProgress, activeSection } = useScrollContext();
    
    return (
        <div className="w-full h-full bg-transparent">
            <motion.div 
                className={`h-full ${getColorForSection(activeSection)}`}
                style={{ 
                    scaleX: scrollProgress,
                    transformOrigin: "left"
                }} 
            />
        </div>
    );
}