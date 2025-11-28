import { motion, useTransform, AnimatePresence } from 'framer-motion'
import { useAudience } from '@/context/AudienceProvider'
import { intitialFadeIn } from '@/utils/animations'
import PlayButton from './PlayButton'
import Image from 'next/image'
import { audienceTexts } from '@/utils/text'

// Define the type for image configurations
type ImageConfig = {
  src: string
  alt: string
  className?: string
  style?: {
    objectPosition?: string
    scale?: number
    translateX?: string
    translateY?: string
    [key: string]: any
  }
  priority?: boolean
}

// Create image mappings dynamically for Lorem Picsum with default config
const audienceImages: Record<string, ImageConfig> = {
  default: {
    src: "https://picsum.photos/seed/default/1440/848",
    alt: "Default background",
    className: "object-cover",
    priority: true
  },
  ...Object.fromEntries(
    audienceTexts.map(({ audience, image }) => [
      audience,
      {
        src: image.src,
        alt: `${audience} background`,
        className: "object-cover",
        priority: true
      }
    ])
  )
};

/* Example for your own images:
const audienceImages: Record<string, ImageConfig> = {
  default: {
    src: "/images/default-hero.jpg",
    alt: "Default background",
    className: "object-cover",
    priority: true
  },
  ...Object.fromEntries(
    audienceTexts.map(({ audience }) => {
      // Custom configurations per audience
      const configs: Record<string, Partial<ImageConfig>> = {
        "For Anyone": {
          src: "/images/anyone-hero.jpg",
          className: "object-cover object-right",
          style: { scale: 1.2, translateX: '5%' }
        },
        // Add configs for other audiences...
      };

      return [
        audience,
        {
          src: configs[audience]?.src || `/images/${audience.toLowerCase()}-hero.jpg`,
          alt: `${audience} background`,
          className: configs[audience]?.className || "object-cover",
          style: configs[audience]?.style,
          priority: true
        }
      ];
    })
  )
};
*/

export default function LandingVid() {
  const { currentIndex } = useAudience();
  const currentAudience = audienceTexts[currentIndex % audienceTexts.length].audience;
  const imageConfig = audienceImages[currentAudience] || audienceImages.default;

  return (
    <motion.div 
      className="flex items-end bg-opacity-30 ml-auto mt-auto w-[80%] h-[50vh] bg-blue-500 pointer-events-auto relative overflow-hidden"
      initial={{ 
        width: '0vw'
      }}
      animate={{ 
        width: ['0vw', '85vw', '80vw']
      }}
      transition={intitialFadeIn}
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentAudience}
          className="absolute inset-0 w-full h-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Image 
            src={imageConfig.src}
            alt={imageConfig.alt}
            fill
            className={`${imageConfig.className}`}
            priority={imageConfig.priority}
            quality={100}
            style={{ 
              ...imageConfig.style 
            }}
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-0 left-0 z-10">
        <PlayButton />
      </div>
    </motion.div>
  )
}
