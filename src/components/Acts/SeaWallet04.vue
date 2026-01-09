<script setup>
const emit = defineEmits(['prev'])
</script>

<template>
  <div class="w-full h-full flex">
    <!-- 文字區 (1/3) -->
    <div class="w-1/3 h-full bg-rose-500 flex flex-col justify-center px-12 border-r border-rose-800 relative">
        <div 
          class="absolute top-4 left-0 w-full text-2xl p-12 text-rose-700/50 cursor-pointer hover:text-rose-900 transition-colors z-20"
          @click="emit('prev')"
        >
          >>> Prev: SeaWallet
        </div>
        <div class="z-10">
          <h2 class="text-4xl font-bold underline decoration-pink-500 decoration-4 text-rose-800">
            Sea Wallet
          </h2>
          <p class="mt-8 text-lg text-rose-600 leading-relaxed">
            Store, inherit, utilize your asset with the most intelligent smart contract wallet 
            on Sui network.
          </p>
          <a href="https://example.com" target="_blank" rel="noopener noreferrer">
            <button class="mt-8 px-8 py-3 bg-pink-600 text-white font-medium rounded-full hover:bg-pink-700 transition shadow-lg">
              Explore Now
            </button>
          </a>
        </div>
    </div>
    
    <!-- 圖片區 (2/3) -->
    <div class="w-2/3 h-full overflow-hidden relative bg-rose-800">
        <img 
          src="/loadingscreen" 
          class="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-700 ease-out" 
          alt="App Preview"
        />
    </div>
  </div>
</template>