<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ActsIntro from './ActsIntro.vue'
import SeaWallet02 from './SeaWallet02.vue'
import SeaWallet03 from './SeaWallet03.vue'
import SeaWallet04 from './SeaWallet04.vue'

const trackRef = ref(null)
const progress = ref(0)
const dampedProgress = ref(0)
let animationId = null

// 阻尼常數
const dampingFactor = 0.08

// 動畫參數設定 (vh 為單位)
const animDuration = 150 // 每個卡片進場的滾動距離
const bufferDuration = 40 // 卡片之間的緩衝距離
// 第一張改為靜態，所以減少一個 animDuration，總共 3 個動畫區間
const totalScroll = (animDuration * 3) + (bufferDuration * 3) 

const getRangeProgress = (current, start, duration) => {
  const startP = start / totalScroll
  const durationP = duration / totalScroll
  return Math.max(0, Math.min((current - startP) / durationP, 1))
}
// 處理捲動邏輯
const handleScroll = () => {
  if (!trackRef.value) return
  // 取得外層軌道相對於視窗的位置
  const rect = trackRef.value.getBoundingClientRect()
  // 視窗高度
  const viewportHeight = window.innerHeight
  
  // 大div長度：依照計算出的總距離
  const scrollZoneVH = totalScroll

  // 計算橫向滾動所需的實際像素距離
  const scrollZonePx = (scrollZoneVH / 100) * viewportHeight - viewportHeight
  
  // 計算目前捲了多少 (轉為正數)
  const scrolled = -rect.top
  
  // 計算百分比，但只基於橫向滾動區域 (0 ~ 1)
  let p = scrolled / scrollZonePx
  
  // 限制範圍在 0 到 1 之間
  if (p < 0) p = 0
  if (p > 1) p = 1
  
  progress.value = p
}

// 使用 requestAnimationFrame 來更新阻尼進度，確保幀同步
const updateDampedProgress = () => {
  dampedProgress.value += (progress.value - dampedProgress.value) * dampingFactor
  animationId = requestAnimationFrame(updateDampedProgress)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  // 啟動動畫迴圈
  updateDampedProgress()
  // 初始化一次
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (animationId) cancelAnimationFrame(animationId)
})

// 計算每張卡片的位移
const card1Transform = computed(() => {
  // 第1張為靜態顯示，不需位移
  return {} 
})

const card2Transform = computed(() => {
  const w = typeof window !== 'undefined' ? window.innerWidth : 0
  
  // 第2張
  // Start: 40 (buf1) 
  // 第一張靜態後，經過一個緩衝就開始第二張
  const start = bufferDuration
  const p = getRangeProgress(dampedProgress.value, start, animDuration)
  return { transform: `translate3d(-${p * w}px, 0, 0)` }
})

const card3Transform = computed(() => {
  const w = typeof window !== 'undefined' ? window.innerWidth : 0
  
  // 第3張
  // Start: 40 + 150 (anim2) + 40 (buf2) = 230
  const start = bufferDuration + animDuration + bufferDuration
  const p = getRangeProgress(dampedProgress.value, start, animDuration)
  return { transform: `translate3d(${p * w}px, 0, 0)` }
})

const card4Transform = computed(() => {
  const w = typeof window !== 'undefined' ? window.innerWidth : 0
  
  // 第4張
  // Start: 230 + 150 (anim3) + 40 (buf3) = 420
  const start = (bufferDuration * 3) + (animDuration * 2)
  const p = getRangeProgress(dampedProgress.value, start, animDuration)
  return { transform: `translate3d(-${p * w}px, 0, 0)` }
})
</script>

<template>
  <div class="relative w-full">
    <!-- 
      Track
      h-[600vh]: 總滾動距離 (570vh) + 緩衝區 (30vh)
    -->
    <div ref="trackRef" class="relative h-[600vh]">      
      <!-- 
        Sticky 容器 
        sticky top-0: 當軌道頂部碰到視窗頂部時，這個 div 會黏住不動，
        直到軌道底部到達視窗底部才會被推走。
      -->
      <div class="sticky top-0 h-screen w-screen overflow-hidden">
        
        <!-- 卡片容器 - 每張卡片獨立定位 -->
        <div class="relative w-full h-full">
          <div 
            class="absolute top-0 left-0 w-screen h-full will-change-transform"
            :style="card1Transform"
          >
            <ActsIntro />
          </div>
          <div 
            class="absolute top-0 left-full w-screen h-full flex will-change-transform"
            :style="card2Transform"
          >
            <SeaWallet02 />
          </div>

          <!-- 第三張卡片: Sea Wallet 副本 (從左往右) -->
          <div 
            class="absolute top-0 -left-full w-screen h-full flex will-change-transform"
            :style="card3Transform"
          >
            <SeaWallet03 />
          </div>

          <!-- 第四張卡片: Sea Wallet 副本 (從右往左) -->
          <div 
            class="absolute top-0 left-full w-screen h-full flex will-change-transform"
            :style="card4Transform"
          >
            <SeaWallet04 />
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* 為了讓捲動更平滑，可以加上這個設定。
  但在某些瀏覽器可能會導致 position: sticky 失效。
*/
html {
  scroll-behavior: smooth;
}
</style>