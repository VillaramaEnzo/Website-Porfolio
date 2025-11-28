"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { useScrollContext } from '@/context/ScrollProvider';

export default function ScrollIndicator() {
  const { scrollY } = useScrollContext();
  const isVisible = scrollY <= 100;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="z-50"
    >
      <div className="flex flex-col items-start">
        <span className="text-sm text-gray-500 mb-2">Projects</span>
        <div className="w-[2px] h-20 bg-gray-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-400 animate-scroll-line" />
        </div>
      </div>
    </motion.div>
  );
}
