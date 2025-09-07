'use client';

import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export const useOptimizedAnimation = (once = true) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once, margin: '0px 0px -10% 0px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const shouldAnimate = once ? (isInView && !hasAnimated) || !once : isInView;

  return {
    ref,
    shouldAnimate,
    isInView
  };
};

// Optimized animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
};

export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
};

export const slideInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
};