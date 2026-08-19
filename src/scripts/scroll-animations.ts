/**
 * Scroll-triggered entrance animations using Intersection Observer.
 * Add `data-animate="fade-up"` (or other variants) to any element
 * to trigger animation when it scrolls into view.
 */

const animationClasses: Record<string, string[]> = {
  'fade-up': ['opacity-0', 'translate-y-8'],
  'fade-down': ['opacity-0', '-translate-y-8'],
  'fade-left': ['opacity-0', 'translate-x-8'],
  'fade-right': ['opacity-0', '-translate-x-8'],
  'fade-in': ['opacity-0'],
  'scale-up': ['opacity-0', 'scale-95'],
};

let activeObserver: IntersectionObserver | null = null;

function initScrollAnimations() {
  // A re-init must not leave the previous observer attached.
  activeObserver?.disconnect();
  activeObserver = null;

  const elements = document.querySelectorAll<HTMLElement>('[data-animate]');

  elements.forEach((el) => {
    if (el.dataset.animationInitialized === 'true') return;

    const animationType = el.dataset.animate || 'fade-up';
    const classes = animationClasses[animationType] || animationClasses['fade-up'];

    el.dataset.animationInitialized = 'true';
    // Tailwind v4 moves offsets onto the `translate`/`scale` properties, so `transform` alone never transitions.
    el.style.transitionProperty = 'opacity, transform, translate, scale';
    el.style.transitionDuration = '700ms';
    el.style.transitionTimingFunction = 'cubic-bezier(0.22, 1, 0.36, 1)';
    el.classList.add(...classes);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const animationType = el.dataset.animate || 'fade-up';
          const classes = animationClasses[animationType] || animationClasses['fade-up'];

          el.dataset.animationRevealed = 'true';

          // Remove hidden classes to trigger transition
          requestAnimationFrame(() => {
            classes.forEach((cls) => el.classList.remove(cls));
          });

          observer.unobserve(el);
        }
      });
    },
    {
      // A section taller than ~10 viewports never reaches a 0.1 ratio, so key off any intersection.
      threshold: 0,
      rootMargin: '0px 0px -80px 0px',
    }
  );

  activeObserver = observer;
  elements.forEach((el) => {
    if (el.dataset.animationRevealed !== 'true') observer.observe(el);
  });
}

// Run on DOMContentLoaded and also on Astro page navigation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}

document.addEventListener('astro:page-load', initScrollAnimations);
