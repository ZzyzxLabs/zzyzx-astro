<script setup lang="ts">
const mouseTrack = (event: MouseEvent) => {
  const x = (event.clientX / window.innerWidth) * 100;
  const y = (event.clientY / window.innerHeight) * 100;
  document.documentElement.style.setProperty('--acts-mx', `${x}%`);
  document.documentElement.style.setProperty('--acts-my', `${y}%`);
};
</script>

<template>
  <div
    class="relative w-full h-full flex items-center justify-center bg-[rgb(7,11,20)] overflow-hidden"
    @mousemove="mouseTrack"
  >
    <!-- Subtle background glow that drifts with the cursor -->
    <div
      class="absolute inset-0 pointer-events-none transition-[background] duration-300"
      style="background: radial-gradient(800px circle at var(--acts-mx, 50%) var(--acts-my, 50%), rgba(0, 229, 255, 0.06), transparent 60%);"
    ></div>

    <!-- Frame brackets -->
    <div class="absolute inset-x-5 inset-y-8 md:inset-x-16 md:inset-y-16 pointer-events-none border border-white/8">
      <div class="absolute -top-px -left-px w-8 h-8 md:w-10 md:h-10 border-t border-l border-primary/60"></div>
      <div class="absolute -top-px -right-px w-8 h-8 md:w-10 md:h-10 border-t border-r border-primary/60"></div>
      <div class="absolute -bottom-px -left-px w-8 h-8 md:w-10 md:h-10 border-b border-l border-primary/60"></div>
      <div class="absolute -bottom-px -right-px w-8 h-8 md:w-10 md:h-10 border-b border-r border-primary/60"></div>
    </div>

    <!-- Top metadata strip -->
    <div class="absolute top-10 left-10 right-10 md:top-20 md:left-20 md:right-20 flex justify-between text-text-faint text-[10px] md:text-xs uppercase tracking-[0.3em] font-light">
      <span>Zzyzx Labs / Acts</span>
      <span class="hidden md:inline">2026 — The end of all gatekeeping</span>
    </div>

    <!-- Main content -->
    <div class="relative z-10 max-w-4xl text-center px-8">
      <span class="eyebrow mb-6 md:mb-8 justify-center inline-flex">Section 02</span>
      <h2 class="font-display font-semibold text-white tracking-tight leading-none acts-title">
        Acts
      </h2>
      <p class="mt-6 md:mt-10 text-base sm:text-xl md:text-2xl text-text-muted leading-relaxed max-w-2xl mx-auto">
        To amplify the last frontier of the planet, Zzyzx Labs makes the gears
        and the knowledge available to all.
      </p>
    </div>

    <!-- Scroll cue -->
    <div class="absolute bottom-10 right-10 md:bottom-20 md:right-20 text-text-faint text-[10px] md:text-xs uppercase tracking-[0.3em]">
      Scroll →
    </div>
  </div>
</template>

<style scoped>
.acts-title {
  font-size: clamp(4rem, 14vw, 9rem);
}
</style>
