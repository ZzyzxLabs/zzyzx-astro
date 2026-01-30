<template>
    <div class="h-full w-full flex flex-col items-center justify-center gap-y-12">
        <div class="service-item">
            <span class="service-text font-semibold text-xl md:text-2xl">
                Website Design
            </span>
        </div>
        <div class="service-item">
            <span class="service-text font-semibold text-xl md:text-2xl">
                Project Commission
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
// No script needed for static content
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap');

.service-text {
    font-family: 'Orbitron', sans-serif;
    color: #fff;
    cursor: default;
    text-align: center;
    display: block;
    
    /* Default Glow */
    text-shadow:
        0 0 5px #fff,
        0 0 10px #fff,
        0 0 20px #0ff,
        0 0 40px #0ff;
}

.service-item:hover .service-text {
    text-shadow: none;
    color: rgba(255, 255, 255, 0.9);
    transition: text-shadow 0.2s ease-in, color 0.2s;
}

.service-item .service-text {
    transition: text-shadow 0.7s ease-out;
}
</style>
