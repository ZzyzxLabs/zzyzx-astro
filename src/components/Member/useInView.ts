import { useEffect, useRef, useState } from "react";

/**
 * Triggers a one-shot boolean once the element scrolls into view.
 * Cleans up the observer after firing so it never resets.
 */
export function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || visible) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px", ...options }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [visible]);

  return [ref, visible] as const;
}
