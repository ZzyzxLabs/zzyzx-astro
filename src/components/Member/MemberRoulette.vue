<script setup>
import { ref } from 'vue';

const activeCard = ref(null);

const toggleCard = (index) => {
    activeCard.value = activeCard.value === index ? null : index;
};

    const members =[
        {
            name:"Zou",
            role:"Role A",
            pic:"oerson.png",
            description: "Passionate developer with a knack for creating intuitive user experiences."
        },
        {
            name:"KC",
            role:"Role B",
            pic:"oerson.png",
            description: "Expert in backend architecture and database management, ensuring smooth data flow."
        },
        {
            name:"Lun",
            role:"Role C",
            pic:"oerson.png",
            description: "Creative designer who brings ideas to life with stunning visuals and layouts."
        },
                {
            name:"Zou",
            role:"Role A",
            pic:"oerson.png",
            description: "Passionate developer with a knack for creating intuitive user experiences."
        },
        {
            name:"KC",
            role:"Role B",
            pic:"oerson.png",
            description: "Expert in backend architecture and database management, ensuring smooth data flow."
        },
        {
            name:"Lun",
            role:"Role C",
            pic:"oerson.png",
            description: "Creative designer who brings ideas to life with stunning visuals and layouts."
        },
                {
            name:"Zou",
            role:"Role A",
            pic:"oerson.png",
            description: "Passionate developer with a knack for creating intuitive user experiences."
        },
        {
            name:"KC",
            role:"Role B",
            pic:"oerson.png",
            description: "Expert in backend architecture and database management, ensuring smooth data flow."
        },
        {
            name:"Lun",
            role:"Role C",
            pic:"oerson.png",
            description: "Creative designer who brings ideas to life with stunning visuals and layouts."
        }
        
    ]
</script>
<template>
<div class="w-5/6 h-1/2 p-4 rounded-xl gap-x-8 bg-slate-400 items-center justify-center overflow-x-auto no-scrollbar flex whitespace-nowrap">
<div class="group w-11/12 rounded-2xl p-4 gap-x-8 bg-slate-400 items-center overflow-x-auto no-scrollbar flex whitespace-nowrap">
    <div 
        class="group/card relative rounded-md bg-gray-700 p-4 h-5/6 shrink-0 transition-all duration-500 ease-in-out cursor-pointer overflow-hidden" 
        :class="activeCard === index ? 'w-[40rem]' : 'w-48'"
        @click="toggleCard(index)"
        v-for="(person, index) in members" 
        :key="index"
    >
        <div class="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover/card:!opacity-0 pointer-events-none rounded-md z-10"></div>
        
        <div class="flex gap-6 h-full w-max">
            <div class="w-40 flex flex-col shrink-0">
                <img v-if="person.pic" :src="person.pic" alt="member picture" class="rounded-bl-2xl rounded-r-2xl w-full h-2/3 object-cover"/>
                <h3 class="text-4xl font-semibold text-amber-200 mt-2">{{ person.name }}</h3>
                <p class="text-xl text-gray-300">{{ person.role }}</p>
            </div>
            
            <div 
                class="w-96 whitespace-normal flex flex-col justify-center transition-opacity duration-500 delay-200"
                :class="activeCard === index ? 'opacity-100' : 'opacity-0'"
            >
                <div class="h-2/3 flex flex-col">
                    <h4 class="text-3xl font-bold text-white mb-4">About</h4>
                    <p class="text-xl text-gray-300 leading-relaxed">{{ person.description }}</p>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
</template>
