<script setup>
const emit = defineEmits(['prev'])
</script>

<template>
  <div class="w-full h-full flex">
    <!-- 文字區 (1/3) -->
    <div class="w-1/3 h-full bg-slate-900 flex flex-col justify-center px-12 border-r border-slate-700 relative">
        <div 
          class="absolute top-4 left-0 w-full text-2xl p-12 text-cyan-500/50 cursor-pointer hover:text-cyan-400 transition-colors z-20"
          @click="emit('prev')"
        >
          <<< Prev: Nereus
        </div>
        <div class="z-10">
          <h2 class="text-4xl font-bold text-white tracking-wider">
            Bermu<span class="text-cyan-500">DAO</span>
          </h2>
          <p class="mt-8 text-lg text-slate-300 leading-relaxed">
            Learn, Connect, Collaborate with the most vibrant community of Web3 developers.
          </p>
          <a href="https://example.com" target="_blank" rel="noopener noreferrer">
            <button class="my-8 px-4 py-2 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-500 transition shadow-lg shadow-cyan-900/20">
              Explore Now
            </button>
          </a>
        </div>
    </div>
    
    <!-- 圖片區 (2/3) -->
    <div class="w-2/3 h-full overflow-hidden relative bg-slate-950">
        <img 
          src="/bermuBlackG.png" 
          class="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-700 ease-out" 
          alt="App Preview"
        />
    </div>
  </div>
</template>