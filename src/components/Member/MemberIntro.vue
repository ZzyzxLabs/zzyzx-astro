<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const containerRef = ref<HTMLElement | null>(null);

const scrollProgress = ref(0);
// A separate progress used ONLY for bracket scale so we can speed up damping
// without making the bracket scale animation feel too fast.
const bracketScaleProgress = ref(0);

const targetProgress = ref(0); // damping target

const mouseX = ref(0);
const mouseY = ref(0);

let animationFrameId = 0;
let lastTs = 0;

// 速度：越大越快追上 target
// Main scroll damping (text fade / general progress)
const FOLLOW_SPEED = 1000;
// Bracket scale damping (kept slower / more cinematic)
const BRACKET_SCALE_FOLLOW_SPEED = 40;

const updateProgress = () => {
  const diff = targetProgress.value - scrollProgress.value;
  if (Math.abs(diff) > 0.0001) {
    scrollProgress.value += diff * 0.05;
  } else {
    scrollProgress.value = targetProgress.value;
  }
};

const mouseTrack = (event: MouseEvent) => {
  const { clientX, clientY } = event;
  mouseX.value = (clientX / window.innerWidth) * 100;
  mouseY.value = (clientY / window.innerHeight) * 100;
};

const handleScroll = () => {
  const el = containerRef.value;
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  const totalScroll = rect.height - windowHeight;
  if (totalScroll <= 0) {
    targetProgress.value = 0;
    return;
  }

  const currentScroll = -rect.top;
  const p = currentScroll / totalScroll;

  targetProgress.value = Math.max(0, Math.min(1, p));
};

const loop = (ts: number) => {
  if (!lastTs) lastTs = ts;
  const dt = Math.min(0.05, (ts - lastTs) / 1000); // cap 50ms
  lastTs = ts;

  const diff = targetProgress.value - scrollProgress.value;

  // time-based exponential smoothing
  const k = 1 - Math.exp(-FOLLOW_SPEED * dt);
  scrollProgress.value += diff * k;

  // separate smoothing for bracket scale
  const diffScale = targetProgress.value - bracketScaleProgress.value;
  const kScale = 1 - Math.exp(-BRACKET_SCALE_FOLLOW_SPEED * dt);
  bracketScaleProgress.value += diffScale * kScale;

  // snap
  if (Math.abs(diff) < 0.0005) {
    scrollProgress.value = targetProgress.value;
  }

  if (Math.abs(diffScale) < 0.0005) {
    bracketScaleProgress.value = targetProgress.value;
  }

  animationFrameId = requestAnimationFrame(loop);
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
  animationFrameId = requestAnimationFrame(loop);
});

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});

const bracketStyle = computed(() => {
  const p = scrollProgress.value;
  const pScale = bracketScaleProgress.value;

  // scale 不要太爆炸，也可以加 easing
  const eased = smoothstep(0, 1, pScale);
  const scale = 1 + eased * 80;

  // 更晚才開始淡出：0.65 -> 1.0 才淡到 0
  const fadeT = smoothstep(0.65, 1.0, p);
  const opacity = 1 - fadeT;

  // blur 也跟 fade 一起加重（避免太早糊掉）
  const blur = fadeT * 6;

  return {
    transform: `scale(${scale}) translate(${mouseX.value * -0.05}%, ${mouseY.value * -0.05}%)`,
    opacity,
    filter: `blur(${blur}px)`,
  };
});

const textStyle = computed(() => {
  return {
    transform: `translate(${mouseX.value * -0.03}%, ${mouseY.value * -0.03}%)`,
  };
});
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full h-[300vh] bg-black"
    @mousemove="mouseTrack"
  >
    <!-- Sticky Viewport -->
    <div class="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
      <!-- The expanding bracket container -->
      <div
        class="text-white absolute w-11/12 h-5/6 text-7xl flex flex-col justify-between pointer-events-none origin-center will-change-transform z-20"
        :style="bracketStyle"
      >
        <!-- Top row -->
        <div class="top-0 left-0 w-full flex flex-row justify-between">
          <p>「</p>

          <div class="text-xl flex flex-col items-end text-right">
            <span>Zzyzx Labs</span>
            <span>2026</span>
            <span>The end of ALLs</span>
          </div>
        </div>

        <!-- Bottom row -->
        <div class="w-full flex items-end justify-between">
          <span class="absolute bottom-0 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
            V V V
          </span>
          <span class="self-end">」</span>
        </div>
      </div>

      <!-- Central Text Content -->
      <div
        class="flex flex-col z-10 gap-y-8 transition-opacity duration-300 items-center justify-center relative"
        :style="{ opacity: Math.max(0, 1 - scrollProgress * 2), ...textStyle }"
      >
        <h2 class="text-white font-bold text-8xl text-center relative z-20 mix-blend-difference">
          Members
        </h2>
        <p class="text-white text-3xl text-center relative z-20">
          Meets the most ambitious minds.
        </p>

        <!-- Glitch/layered effects -->
        <h2
          class="text-cyan-400/30 font-bold text-8xl text-center absolute top-0 left-0 w-full z-10 pointer-events-none select-none blur-[1px]"
          :style="{ transform: `translate(${mouseX * -0.02}%, ${mouseY * -0.02}%)` }"
        >
          Members
        </h2>

        <h2
          class="text-pink-500/30 font-bold text-8xl text-center absolute top-0 left-0 w-full z-10 pointer-events-none select-none blur-[1px]"
          :style="{ transform: `translate(${mouseX * 0.02}%, ${mouseY * 0.02}%)` }"
        >
          Members
        </h2>
      </div>
    </div>
  </div>
</template>
