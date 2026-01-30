<script setup>
const emit = defineEmits(['next', 'prev'])
</script>

<template>
  <div class="w-full h-full flex">
    <!-- 文字區 (1/3) -->
    <div class="w-1/3 h-full bg-[#050a14] flex flex-col justify-center px-12 border-r border-white/5 relative">
        <div 
          class="absolute top-4 left-0 w-full text-2xl p-12 text-white/20 cursor-pointer hover:text-amber-500 transition-colors z-20"
          @click="emit('prev')"
        >
          <<< Prev: SeaWallet
        </div>
        <div class="z-10">
          <h2 class="text-4xl font-bold text-white font-serif">
            Nereus
          </h2>
          <p class="mt-8 text-lg text-slate-300 leading-relaxed">
            Enhance your predictions with the power of LLMs in trustable execution environments.
          </p>
          <a href="https://www.trynereus.xyz/" target="_blank" rel="noopener noreferrer">
            <button class="my-8 px-6 py-2 rounded bg-[#ff9f1c] text-[#050a14] font-semibold hover:bg-[#ffb74d] transition shadow-[0_0_15px_rgba(255,159,28,0.3)]">
              Explore Now
            </button>
          </a>
        </div>
        <div 
          class="absolute bottom-4 left-0 w-full text-2xl p-12 text-white/20 cursor-pointer hover:text-amber-500 transition-colors z-20"
          @click="emit('next')"
        >
          >>> Next: BermuDAO
        </div>
    </div>
    
    <!-- 圖片區 (2/3) -->
    <div class="w-2/3 h-full overflow-hidden relative bg-black">
        <img 
          src="/nereus.png" 
          class="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-700 ease-out" 
          alt="App Preview"
        />
    </div>
  </div>
</template>