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

function initScrollAnimations() {
  const elements = document.querySelectorAll<HTMLElement>('[data-animate]');

  elements.forEach((el) => {
    const animationType = el.dataset.animate || 'fade-up';
    const classes = animationClasses[animationType] || animationClasses['fade-up'];

    // Add initial hidden state
    el.classList.add('transition-all', 'duration-700', 'ease-out', ...classes);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const animationType = el.dataset.animate || 'fade-up';
          const classes = animationClasses[animationType] || animationClasses['fade-up'];

          // Remove hidden classes to trigger transition
          requestAnimationFrame(() => {
            classes.forEach((cls) => el.classList.remove(cls));
          });

          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
}

// Run on DOMContentLoaded and also on Astro page navigation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}

document.addEventListener('astro:page-load', initScrollAnimations);
