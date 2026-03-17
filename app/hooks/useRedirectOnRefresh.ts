import { useEffect } from 'react';

export function useRedirectOnRefreshAlt() {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation?.type === 'reload') {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
}
