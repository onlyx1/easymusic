<template>
    <div class="discover-music">
      <Carousel />
      <div class="content">
        <RecommendedPlaylists />
        <LatestMusicList />
        <RecommendedMVs />
      </div>
    </div>
  </template>
  
  <script setup>
  import Carousel from '@/components/Carousel.vue'
  import RecommendedPlaylists from '@/components/RecommendedPlaylists.vue'
  import LatestMusicList from '@/components/LatestMusicList.vue'
  import RecommendedMVs from '@/components/RecommendedMVs.vue'
  </script>
  
  <style scoped>
  .discover-music {
    width: 100%;
  }

  .content {
    margin-top: 30px;
  }
  </style>