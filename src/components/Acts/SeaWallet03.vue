<script setup>
const emit = defineEmits(['next', 'prev'])
</script>

<template>
  <div class="w-full h-full flex">
    <!-- 文字區 (1/3) -->
    <div class="w-1/3 h-full bg-teal-800 flex flex-col justify-center px-12 border-r border-teal-700 relative">
        <div 
          class="absolute top-4 left-0 w-full text-2xl p-12 text-teal-400/30 cursor-pointer hover:text-teal-200 transition-colors z-20"
          @click="emit('prev')"
        >
          >>> Prev: SeaWallet
        </div>
        <div class="z-10">
          <h2 class="text-4xl font-bold text-white">
            Nereus
          </h2>
          <p class="mt-8 text-lg text-teal-100 leading-relaxed">
            Enhance your predictions with the power of LLMs in trustable execution environments.
          </p>
          <a href="https://example.com" target="_blank" rel="noopener noreferrer">
            <button class="my-8 px-4 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-400 transition shadow-lg">
              Explore Now
            </button>
          </a>
        </div>
        <div 
          class="absolute bottom-4 left-0 w-full text-2xl p-12 text-teal-400/30 cursor-pointer hover:text-teal-200 transition-colors z-20"
          @click="emit('next')"
        >
          <<< Next: SeaWallet
        </div>
    </div>
    
    <!-- 圖片區 (2/3) -->
    <div class="w-2/3 h-full overflow-hidden relative bg-teal-950">
        <img 
          src="/loadingscreen" 
          class="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-700 ease-out" 
          alt="App Preview"
        />
    </div>
  </div>
</template>