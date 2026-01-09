<script setup>
const emit = defineEmits(['next', 'prev'])
</script>

<template>
  <div class="w-full h-full flex">
    <!-- 文字區 (1/3) -->
    <div class="w-1/3 h-full bg-slate-300 flex flex-col justify-center px-12 border-r border-slate-800 relative">
        <div 
          class="absolute top-4 left-0 w-full text-2xl p-12 text-slate-500 cursor-pointer hover:text-slate-800 transition-colors z-20"
          @click="emit('prev')"
        >
          >>> Prev: Intro
        </div>
      <div class="z-10">
          <h2 class="text-4xl font-bold text-black">
            SeaWallet
          </h2>
          <p class="mt-8 text-lg text-slate-600 leading-relaxed">
            Store, inherit, utilize your asset with the most intelligent smart contract wallet 
            on Sui network.
          </p>
          <a href="https://example.com" target="_blank" rel="noopener noreferrer">
            <button class="my-8 px-4 py-2 rounded-lg bg-slate-700 text-amber-100">Launch App</button>
          </a>
        </div>
        <div 
          class="absolute bottom-4 left-0 w-full text-2xl p-12 text-slate-500 cursor-pointer hover:text-slate-800 transition-colors"
          @click="emit('next')"
        >
          <<< Next: Nereus
        </div>
    </div>
    
    <!-- 圖片區 (2/3) -->
    <div class="w-2/3 h-full overflow-hidden relative bg-slate-800">
        <!-- 操作影片之類的 -->
        <img 
          src="/loadingscreen.png" 
          class="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-700 ease-out" 
          alt="App Preview"
        />
    </div>
  </div>
</template>