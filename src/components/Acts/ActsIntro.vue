<script setup lang="ts">
const mouseTrack = (event: MouseEvent) => {
  const { clientX, clientY } = event;
  const x = (clientX / window.innerWidth) * 100;
  const y = (clientY / window.innerHeight) * 100;
  document.documentElement.style.setProperty('--mouse-x', `${x}%`);
  document.documentElement.style.setProperty('--mouse-y', `${y}%`);
};
</script>

<template>
  <div class="w-full h-full flex items-center justify-center bg-black/50" @mousemove="mouseTrack">
    <!-- 做個框框 -->
    <div
      class="text-white absolute w-11/12 h-5/6 text-7xl flex flex-col justify-between pointer-events-none transition-transform duration-100 ease-out"
      style="transform: translate(calc(var(--mouse-x) * -0.03), calc(var(--mouse-y) * -0.03));">
      <span class="top-0 left-0 w-full flex flex-row justify-between">
        <p>「 </p><span class="text-xl">Zzyzx Labs<br>2026<br>The end of ALLs</span>
      </span>
      <span class="self-end text-2xl"> >>> </span>
      <span class="self-end">」</span>
    </div>
    <div class="flex flex-col z-10 gap-y-8">
      <h2 class="text-white font-bold text-8xl"> Acts</h2>
      <p class="text-white text-3xl"> To Amplify the last of the planet, </p>
      <p class="text-white text-3xl">Zzyzx Labs makes the gears and the knowledge available to all.</p>
    </div>
    <div class="flex flex-col absolute gap-y-8"
      style="transform: translate(calc(var(--mouse-x) * -0.01), calc(var(--mouse-y) * -0.01));">
      <h2 class="text-cyan-400/50 font-bold text-8xl"> Acts</h2>
      <p class="text-cyan-400/50 text-3xl"> To Amplify the last of the planet, </p>
      <p class="text-cyan-400/50 text-3xl">Zzyzx Labs makes the gears and the knowledge available to all.</p>
    </div>
    <div class="flex flex-col absolute gap-y-8"
      style="transform: translate(calc(var(--mouse-x) * 0.01), calc(var(--mouse-y) * 0.01));">
      <h2 class="text-pink-500/50 font-bold text-8xl"> Acts</h2>
      <p class="text-pink-500/50 text-3xl"> To Amplify the last of the planet, </p>
      <p class="text-pink-500/50 text-3xl">Zzyzx Labs makes the gears and the knowledge available to all.</p>
    </div>
  </div>
</template>