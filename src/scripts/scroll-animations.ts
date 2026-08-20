/**
 * Scroll-triggered entrance animations using Intersection Observer.
 *
 * `data-animate="fade-up"` reveals a single element when it scrolls into view.
 *
 * `data-animate-group` on a container reveals its `[data-animate-item]`
 * children together, staggered, when the *container* intersects. Observing the
 * items individually instead leaves a grid half-drawn: the cells below the fold
 * stay at zero opacity inside borders that are already painted, so the section
 * reads as broken rather than as arriving.
 *
 * Reduced motion is handled here rather than in each component's stylesheet.
 * Three components shipped `data-animate` with no `prefers-reduced-motion`
 * rule at all, so their readers still got a 700ms transition. Bailing out
 * before the hiding classes are ever applied covers every component at once.
 */

const animationClasses: Record<string, string[]> = {
  'fade-up': ['opacity-0', 'translate-y-8'],
  'fade-down': ['opacity-0', '-translate-y-8'],
  'fade-left': ['opacity-0', 'translate-x-8'],
  'fade-right': ['opacity-0', '-translate-x-8'],
  'fade-in': ['opacity-0'],
  'scale-up': ['opacity-0', 'scale-95'],
};

const STAGGER_MS = 70;

let activeObserver: IntersectionObserver | null = null;

function classesFor(el: HTMLElement) {
  const type = el.dataset.animate || el.dataset.animateItem || 'fade-up';
  return animationClasses[type] || animationClasses['fade-up'];
}

function hide(el: HTMLElement, delay?: string) {
  if (el.dataset.animationInitialized === 'true') return;
  el.dataset.animationInitialized = 'true';
  // Tailwind v4 moves offsets onto the `translate`/`scale` properties, so `transform` alone never transitions.
  el.style.transitionProperty = 'opacity, transform, translate, scale';
  el.style.transitionDuration = '700ms';
  el.style.transitionTimingFunction = 'cubic-bezier(0.22, 1, 0.36, 1)';
  if (delay) el.style.transitionDelay = delay;
  el.classList.add(...classesFor(el));
}

function reveal(el: HTMLElement) {
  el.dataset.animationRevealed = 'true';
  requestAnimationFrame(() => {
    classesFor(el).forEach((cls) => el.classList.remove(cls));
  });
}

function initScrollAnimations() {
  // A re-init must not leave the previous observer attached.
  activeObserver?.disconnect();
  activeObserver = null;

  const singles = Array.from(document.querySelectorAll<HTMLElement>('[data-animate]'));
  const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-animate-group]'));

  // Content is visible by default and the hiding classes are applied here, so
  // returning early leaves every section rendered exactly as authored.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  singles.forEach((el) => hide(el, el.dataset.animateDelay));
  groups.forEach((group) => {
    group.querySelectorAll<HTMLElement>('[data-animate-item]').forEach((item, index) => {
      hide(item, `${index * STAGGER_MS}ms`);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        if (el.hasAttribute('data-animate-group')) {
          el.querySelectorAll<HTMLElement>('[data-animate-item]').forEach(reveal);
        } else {
          reveal(el);
        }
        observer.unobserve(el);
      });
    },
    {
      // A section taller than ~10 viewports never reaches a 0.1 ratio, so key off any intersection.
      threshold: 0,
      rootMargin: '0px 0px -80px 0px',
    }
  );

  activeObserver = observer;
  [...singles, ...groups].forEach((el) => {
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
