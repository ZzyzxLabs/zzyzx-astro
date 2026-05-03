<script setup>
const emit = defineEmits(['next', 'prev'])
</script>

<template>
  <div class="w-full h-full flex flex-col-reverse lg:flex-row bg-[rgb(7,11,20)]">
    <div class="w-full lg:w-1/3 h-1/2 lg:h-full flex flex-col justify-center px-8 lg:px-12 border-t lg:border-t-0 lg:border-r border-white/8 relative">
      <button
        type="button"
        class="absolute top-6 left-8 lg:top-10 lg:left-12 text-xs uppercase tracking-[0.3em] text-text-faint hover:text-primary transition-colors"
        @click="emit('prev')"
      >
        ← Prev · SeaWallet
      </button>

      <div>
        <div class="text-text-faint text-xs uppercase tracking-[0.3em] mb-4">Project 02</div>
        <h2 class="font-display text-4xl lg:text-5xl font-semibold text-white tracking-tight">Nereus</h2>
        <p class="mt-6 text-base text-text-muted leading-relaxed max-w-sm">
          Sharpen your predictions with LLMs running inside trustable execution
          environments.
        </p>
        <a
          href="https://www.trynereus.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white text-xs font-semibold uppercase tracking-[0.18em] hover:border-primary hover:text-primary transition-colors"
        >
          Explore Now
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <button
        type="button"
        class="absolute bottom-6 left-8 lg:bottom-10 lg:left-12 text-xs uppercase tracking-[0.3em] text-text-faint hover:text-primary transition-colors"
        @click="emit('next')"
      >
        Next · BermuDAO →
      </button>
    </div>

    <div class="w-full lg:w-2/3 h-1/2 lg:h-full overflow-hidden relative bg-bg-elev">
      <img
        src="/nereus.png"
        class="w-full h-full object-cover opacity-90"
        alt="Nereus preview"
      />
      <div class="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-bg-base/60 via-transparent to-transparent pointer-events-none"></div>
    </div>
  </div>
</template>
