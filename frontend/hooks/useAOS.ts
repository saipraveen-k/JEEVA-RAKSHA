import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const useAOS = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out-cubic',
      once: true,
      offset: 50,
      delay: 50,
      mirror: false,
      disable: false,
      startEvent: 'DOMContentLoaded',
      initClassName: 'aos-init',
      animatedClassName: 'aos-animate',
      useClassNames: false,
      disableMutationObserver: false,
      debounceDelay: 50,
      throttleDelay: 99
    });

    // Refresh AOS on route changes
    const refreshAOS = () => {
      AOS.refresh();
    };

    // Listen for route changes if using a router
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', refreshAOS);
      window.addEventListener('load', refreshAOS);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', refreshAOS);
        window.removeEventListener('load', refreshAOS);
      }
    };
  }, []);

  return {
    refresh: () => AOS.refresh(),
    refreshHard: () => AOS.refreshHard()
  };
};