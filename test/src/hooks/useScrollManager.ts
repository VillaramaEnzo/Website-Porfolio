"use client"

/*

Scroll Jacking is lame, so I'm not doing it.

*/

import { useState, useEffect, RefObject, useCallback, useRef } from 'react';
import { useScroll, animate, useTransform, MotionValue } from 'motion/react';

/**
 * Represents the current scroll state
 * @interface ScrollState
 * @property {number} scrollY - Current scroll position
 * @property {boolean} isScrolling - Whether the user is currently scrolling
 * @property {'up' | 'down' | null} scrollDirection - Direction of scroll
 * @property {number | null} activeSection - Index of the currently active section
 */
interface ScrollState {
  scrollY: number;
  isScrolling: boolean;
  scrollDirection: "up" | "down" | null;
  activeSection: number | null;
}

/**
 * Configuration options for the scroll manager
 * @interface ScrollManagerOptions
 * @property {RefObject<HTMLElement>} containerRef - Reference to scrollable container (optional)
 * @property {RefObject<(HTMLElement | null)[]>} sectionRefs - References to section elements (optional)
 * @property {number} scrollThreshold - Minimum scroll distance to trigger updates (optional)
 * @property {number} debounceMs - Debounce delay for scroll events (optional)
 */
interface ScrollManagerOptions {
  containerRef?: RefObject<HTMLElement>;
  sectionRefs?: RefObject<(HTMLElement | null)[]>;
  scrollThreshold?: number;
  debounceMs?: number;
  sectionNames?: string[];
}

/**
 * A hook that centralizes scroll-related functionality across different components
 * @param {ScrollManagerOptions} options - Configuration options for the scroll manager
 * @returns {Object} Scroll state and control functions
 */
export function useScrollManager({
  containerRef,
  sectionRefs,
  debounceMs = 100,
  sectionNames = []
}: ScrollManagerOptions = {}) {
  /**
   * Initialize scroll state with default values
   */
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    isScrolling: false,
    scrollDirection: null,
    activeSection: null
  });

  useEffect(() => {
    
    const initialActiveSection = calculateActiveSection()
    if (initialActiveSection !== null) {
      setScrollState(prev => ({ 
        ...prev, 
        activeSection: initialActiveSection 
      }));
    }
  }, [])


  const { scrollY, scrollYProgress, scrollX, scrollXProgress } = useScroll(
    containerRef ? {
      container: containerRef
    } : undefined
  );

  const scrollTimeout = useRef<NodeJS.Timeout>();
  const lastScrollY = useRef(0);
  const lastLoggedSection = useRef<number | null>(null);

  /**
   * Calculates which section is currently active based on scroll position
   * Used by SectionNav to highlight the current section
   * @returns {number | null} Index of the active section or null if not applicable
   */
  const calculateActiveSection = useCallback(() => {
    if (!sectionRefs?.current || !containerRef?.current) return null;

    const scrollPosition = scrollY.get();
    const sections = sectionRefs.current.filter((ref): ref is HTMLElement => ref !== null) || [];

    let minDistance = Infinity;
    let currentSection = 0;

    sections.forEach((section, index) => {
      const distance = Math.abs(scrollPosition - section.offsetTop);
      if (distance < minDistance) {
        minDistance = distance;
        currentSection = index;
      }
    });


    return currentSection;
  }, [containerRef, sectionRefs, scrollY]);

  const calculateSectionMetrics = useCallback((currentSection: number) => {
    const sections = sectionRefs?.current?.filter((ref): ref is HTMLElement => ref !== null) || [];
    const boundaryOffset = sections[currentSection || 0]?.offsetTop || 0;
    const containerHeight = containerRef?.current?.scrollHeight || 0;
    const boundaryPercentage = ((boundaryOffset / containerHeight) * 100).toFixed(1);
    
    return {
      boundaryOffset,
      boundaryPercentage,
      containerHeight
    };
  }, [containerRef, sectionRefs]);

  /**
   * Sets up scroll event listeners and handles scroll updates
   * Manages both container and window scroll events
   */

  const handleScroll = useCallback(() => {
    const currentScrollY = scrollY.get();
    const progress = scrollYProgress.get();
    const lastSection = scrollState.activeSection;
    const currentSection = calculateActiveSection();

    // Calculate direction before any state updates
    const direction = currentScrollY > lastScrollY.current ? "down" : "up";
    lastScrollY.current = currentScrollY;

    // Always set isScrolling true when scroll occurs
    setScrollState((prev: ScrollState) => ({ ...prev, isScrolling: true }));
    
    // Clear existing timeout and set new one
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      setScrollState((prev: ScrollState) => ({ ...prev, isScrolling: false }));
    }, debounceMs);

    // Only update state once with all changes
    setScrollState((prev: ScrollState) => {
      const newState: ScrollState = {
        ...prev,
        scrollY: currentScrollY,
        scrollDirection: direction,
        activeSection: currentSection ?? prev.activeSection,
        isScrolling: true
      };

      // Only log if section changed and hasn't been logged yet
      if (currentSection !== null && currentSection !== lastLoggedSection.current) {
        const metrics = calculateSectionMetrics(currentSection);
        
        console.group('Section Change');
        console.log(`Current Active Section: Index ~ 0${newState.activeSection} | Section Name ~ ${sectionNames[currentSection]}`);
        console.log('Section Names:', sectionNames);
        console.log('Section Boundary:', `${metrics.boundaryPercentage}%`);
        console.log('Current Scroll Position:', Math.round(currentScrollY));
        console.log('Current Progress:', `${(progress * 100).toFixed(1)}%`);
        console.log('Direction:', direction);
        console.groupEnd();

        lastLoggedSection.current = currentSection;
      }

      return newState;
    });
  }, [scrollY, scrollYProgress, debounceMs, calculateActiveSection, calculateSectionMetrics]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    scrollY.on('change', handleScroll);

    // Set initial scroll position
    const initialScrollY = containerRef?.current 
      ? containerRef.current.scrollTop 
      : window.scrollY;
    setScrollState(prev => ({ ...prev, scrollY: initialScrollY }));

    return () => {
      scrollY.clearListeners();
      clearTimeout(scrollTimeout.current);
    };
  }, [scrollY, handleScroll]);

  /**
   * Scrolls to a specific section by index
   * Used by SectionNav for navigation
   * @param {number} index - Index of the section to scroll to
   */
  const scrollToSection = useCallback((index: number) => {
    if (!containerRef?.current || !sectionRefs?.current?.[index]) return;
    
    const container = containerRef.current;
    const targetPosition = sectionRefs.current[index].offsetTop;
    
    animate(container.scrollTop, targetPosition, {
      duration: 1.8,  /* Duration in seconds
                        Examples:
                        - Faster: 0.8
                        - Default: 1.2
                        - Slower: 1.8
                        - Very slow: 2.5 */
                      
      ease: [0.4, 0, 0.2, 1],  /* Cubic bezier curve [x1, y1, x2, y2]
                                Examples for different feels:
                                - Snappy: [0.16, 1, 0.3, 1]  // Quick, but smooth
                                - Smooth: [0.4, 0, 0.2, 1]   // Gentle acceleration/deceleration
                                - Bouncy: [0.68, -0.6, 0.32, 1.6]  // Slight overshoot
                                - Progressive: [0.34, 1.56, 0.64, 1]  // Slow start, fast middle
                                - Linear: [0, 0, 1, 1]  // Constant speed (not recommended) */
      onUpdate: (value) => {
        container.scrollTop = value;
      }
    });
  }, [containerRef, sectionRefs]);

  /**
   * Scrolls to the top of the container or window
   * Used by BackToTopButton component
   */
  const scrollToTop = useCallback(() => {
    if (!containerRef?.current) {
      // Fallback for window scrolling
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    const container = containerRef.current;
    animate(container.scrollTop, 0, {
      duration: 1.8,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (value) => {
        container.scrollTop = value;
      }
    });
  }, [containerRef]);

  /**
   * Gets the normalized progress (0-1) for a specific section
   * @param {number} sectionIndex - Index of the section
   * @returns {MotionValue<number>} Normalized progress for the section
   */
  const getSectionIndexByName = useCallback((sectionName: string) => {
    return sectionNames.findIndex(name => 
      name.toLowerCase() === sectionName.toLowerCase()
    );
  }, [sectionNames]);

  return {
    ...scrollState,
    scrollToSection,
    scrollToTop,
    scrollProgress: scrollYProgress,
    scrollPosition: scrollY,
    containerRef,
    sectionRefs,
    sectionNames,
    getSectionIndexByName,
  };
} 