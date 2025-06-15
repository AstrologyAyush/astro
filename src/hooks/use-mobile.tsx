
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

// Enhanced viewport height handling (mobile browsers with better performance)
export function useViewportHeight() {
  const [viewportHeight, setViewportHeight] = React.useState<number>(0);

  React.useEffect(() => {
    const updateHeight = () => {
      const height = window.innerHeight;
      setViewportHeight(height);
      // Set CSS custom property for mobile viewport height with better performance
      document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
    };

    // Throttle resize events for better performance
    let timeoutId: NodeJS.Timeout;
    const throttledUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateHeight, 100);
    };

    updateHeight();
    window.addEventListener('resize', throttledUpdate);
    window.addEventListener('orientationchange', throttledUpdate);

    // Additional mobile-specific events
    window.addEventListener('scroll', throttledUpdate, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', throttledUpdate);
      window.removeEventListener('orientationchange', throttledUpdate);
      window.removeEventListener('scroll', throttledUpdate);
    };
  }, []);

  return viewportHeight;
}

// Enhanced touch detection hook
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = React.useState(false);

  React.useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0 || (window as any).DocumentTouch && document instanceof (window as any).DocumentTouch);
    };
    
    checkTouch();
    
    // Re-check on focus change (helpful for hybrid devices)
    window.addEventListener('focus', checkTouch);
    return () => window.removeEventListener('focus', checkTouch);
  }, []);

  return isTouch;
}

// New hook for safe area insets (mobile devices with notches)
export function useSafeAreaInsets() {
  const [insets, setInsets] = React.useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });

  React.useEffect(() => {
    const updateInsets = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      setInsets({
        top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
        right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
        left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0')
      });
    };

    updateInsets();
    window.addEventListener('orientationchange', updateInsets);
    return () => window.removeEventListener('orientationchange', updateInsets);
  }, []);

  return insets;
}

// Hook for mobile keyboard detection
export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = React.useState(false);

  React.useEffect(() => {
    const initialViewportHeight = window.visualViewport?.height || window.innerHeight;
    
    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;
      
      if (heightDifference > 150) { // Threshold for keyboard detection
        setKeyboardHeight(heightDifference);
        setIsKeyboardOpen(true);
      } else {
        setKeyboardHeight(0);
        setIsKeyboardOpen(false);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      return () => window.visualViewport.removeEventListener('resize', handleViewportChange);
    } else {
      window.addEventListener('resize', handleViewportChange);
      return () => window.removeEventListener('resize', handleViewportChange);
    }
  }, []);

  return { keyboardHeight, isKeyboardOpen };
}
