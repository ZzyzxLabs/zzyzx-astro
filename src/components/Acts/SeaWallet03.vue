<template>
  <div class="w-full h-full flex">
    <!-- 文字區 (1/3) -->
    <div class="w-1/3 h-full bg-emerald-500 flex flex-col justify-center px-12 border-r border-emerald-800 relative">
        <p class="text-9xl font-black text-emerald-200 absolute top-10 left-10 select-none z-0">03</p>
        <div class="z-10">
          <h2 class="text-4xl font-bold underline decoration-teal-500 decoration-4 text-emerald-800">
            Sea Wallet
          </h2>
          <p class="mt-8 text-lg text-emerald-600 leading-relaxed">
            Store, inherit, utilize your asset with the most intelligent smart contract wallet 
            on Sui network.
          </p>
          <a href="https://example.com" target="_blank" rel="noopener noreferrer">
            <button class="mt-8 px-8 py-3 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition shadow-lg">
              Explore Now
            </button>
          </a>
        </div>
    </div>
    
    <!-- 圖片區 (2/3) -->
    <div class="w-2/3 h-full overflow-hidden relative bg-emerald-800">
        <img 
          src="/loadingscreen" 
          class="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-700 ease-out" 
          alt="App Preview"
        />
    </div>
  </div>
</template>