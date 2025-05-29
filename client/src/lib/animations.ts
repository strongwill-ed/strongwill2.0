// Animation utilities for enhanced UX
export const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

export const slideInVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const staggerChildrenVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const scaleOnHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

// CSS transition classes for non-Framer Motion components
export const transitionClasses = {
  smooth: "transition-all duration-300 ease-in-out",
  fast: "transition-all duration-150 ease-in-out",
  slow: "transition-all duration-500 ease-in-out",
  bounce: "transition-all duration-300 ease-bounce",
};

// Reduced motion utilities
export function respectsReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getAnimationProps(variants: any) {
  if (respectsReducedMotion()) {
    return {
      initial: "visible",
      animate: "visible",
      variants: {
        visible: { opacity: 1, scale: 1, x: 0, y: 0 }
      }
    };
  }
  return {
    initial: "hidden",
    animate: "visible",
    variants
  };
}