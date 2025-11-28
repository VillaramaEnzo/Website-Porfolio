"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollContext } from '@/context/ScrollProvider';

interface BackToTopButtonProps {
  thresholdPercentage?: number;
}

const BackToTopButton: React.FC<BackToTopButtonProps> = ({ thresholdPercentage = 20 }) => {
  const { scrollY, scrollToTop } = useScrollContext();
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle scroll visibility
  useEffect(() => {
    if (!isMounted) return;
    
    const threshold = (window.innerHeight * thresholdPercentage) / 100;
    setIsVisible(scrollY > threshold);
  }, [scrollY, thresholdPercentage, isMounted]);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-gray-500 hover:bg-blue-400 text-white font-bold w-12 aspect-square rounded-full shadow-lg z-50 flex items-center justify-center"
          aria-label="Back to top"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTopButton;
