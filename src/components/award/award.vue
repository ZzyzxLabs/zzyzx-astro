<template>
    <div class="-z-10 h-full w-full overflow-hidden flex flex-col items-center justify-center relative mask-gradient select-none opacity-80">
        <div class="scroll-content flex flex-col w-full">
            <div
                v-for="(award, index) in awards"
                :key="index"
                class="award-item py-6 text-center"
            >
                <span class="award-text font-semilight text-xl md:text-2xl transition-all duration-700 ease-out">
                    {{ award }}
                </span>
            </div>
            <!-- Duplicates for seamless loop (4 sets total to cover large screens) -->
            <div
                v-for="(award, index) in awards"
                :key="'dup1-' + index"
                class="award-item py-6 text-center"
            >
                <span class="award-text font-semilight text-xl md:text-2xl transition-all duration-700 ease-out">
                    {{ award }}
                </span>
            </div>
            <div
                v-for="(award, index) in awards"
                :key="'dup2-' + index"
                class="award-item py-6 text-center"
            >
                <span class="award-text font-semilight text-xl md:text-2xl transition-all duration-700 ease-out">
                    {{ award }}
                </span>
            </div>
            <div
                v-for="(award, index) in awards"
                :key="'dup3-' + index"
                class="award-item py-6 text-center"
            >
                <span class="award-text font-semilight text-xl md:text-2xl transition-all duration-700 ease-out">
                    {{ award }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const awards = [
    "Design Excellence",
    "Best Interaction",
    "Future Tech Gold",
    "Innovation 2025",
    "Cyber Award",
    "Top Startup",
    "Visual Aesthetics",
    "Global Impact"
];
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap');

.mask-gradient {
    mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
}

.scroll-content {
    animation: scroll-vertical 20s linear infinite;
}

/* Pause removed */

@keyframes scroll-vertical {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(-25%);
    }
}

.award-text {
    font-family: 'Orbitron', sans-serif;
    color: #fff;
    cursor: default;
    
    /* Default Glow */
    text-shadow:
        0 0 5px #fff,
        0 0 10px #fff,
        0 0 20px #0ff,
        0 0 40px #0ff;
}

/* Hover state: remove glow quickly */
.award-text:hover {
    text-shadow: none;
    color: rgba(255, 255, 255, 0.9);
    transition: text-shadow 0.2s ease-in, color 0.2s;
}

/* Return to glow slowly when mouse leaves - handled by the base class transition */
</style>
