
import * as React from "react"

// Enhanced breakpoints for more comprehensive mobile support
const BREAKPOINTS = {
  xs: 375,    // Small phones
  sm: 640,    // Large phones
  md: 768,    // Tablets
  lg: 1024,   // Small laptops
  xl: 1280,   // Large laptops
  "2xl": 1400 // Desktops
} as const;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.md - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < BREAKPOINTS.md)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Enhanced hook for better mobile detection and responsive design
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<keyof typeof BREAKPOINTS | 'xxs' | null>(null);

  React.useEffect(() => {
    const determineBreakpoint = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.xs) return 'xxs';
      if (width < BREAKPOINTS.sm) return 'xs';
      if (width < BREAKPOINTS.md) return 'sm';
      if (width < BREAKPOINTS.lg) return 'md';
      if (width < BREAKPOINTS.xl) return 'lg';
      if (width < BREAKPOINTS["2xl"]) return 'xl';
      return '2xl';
    };

    const handleResize = () => {
      setBreakpoint(determineBreakpoint());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

// New hook for viewport height handling (mobile browsers)
export function useViewportHeight() {
  const [viewportHeight, setViewportHeight] = React.useState<number>(0);

  React.useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
      // Set CSS custom property for mobile viewport height
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  return viewportHeight;
}

// Touch detection hook
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = React.useState(false);

  React.useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
}
