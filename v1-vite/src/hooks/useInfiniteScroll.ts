import { useEffect, useRef } from 'react';

const useInfiniteScroll = (callback: () => void, isLoading: boolean, hasMore: boolean) => {
  const observerRef = useRef<IntersectionObserver>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || !hasMore) return;

    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current && sentinelRef.current) {
        observerRef.current.unobserve(sentinelRef.current);
      }
    };
  }, [callback, isLoading, hasMore]);

  return sentinelRef;
};

export default useInfiniteScroll;