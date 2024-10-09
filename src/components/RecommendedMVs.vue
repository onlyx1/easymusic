<template>
  <div class="recommended-mvs">
    <h2 class="section-title">推荐MV</h2>
    <div class="mvs-grid">
      <div v-for="mv in mvs" :key="mv.id" class="mv-item" @click="playMV(mv)">
        <div class="mv-cover-container">
          <img :src="mv.coverUrl" :alt="mv.name" class="mv-cover">
          <div class="play-icon">▶</div>
        </div>
        <div class="mv-info">
          <p class="mv-name">{{ mv.name }}</p>
          <p class="mv-artist">{{ mv.artist }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 模拟MV数据，实际应用中这可能来自API
const mvs = ref([
  { id: 1, name: 'MV1', artist: '歌手1', coverUrl: new URL('../assets/img/mv1.jpg', import.meta.url).href },
  { id: 2, name: 'MV2', artist: '歌手2', coverUrl: new URL('../assets/img/mv2.jpg', import.meta.url).href },
  { id: 3, name: 'MV3', artist: '歌手3', coverUrl: new URL('../assets/img/mv1.jpg', import.meta.url).href },
  { id: 4, name: 'MV4', artist: '歌手4', coverUrl: new URL('../assets/img/mv2.jpg', import.meta.url).href },
  { id: 5, name: 'MV5', artist: '歌手5', coverUrl: new URL('../assets/img/mv2.jpg', import.meta.url).href },
  { id: 6, name: 'MV6', artist: '歌手6', coverUrl: new URL('../assets/img/mv1.jpg', import.meta.url).href },
  { id: 7, name: 'MV7', artist: '歌手7', coverUrl: new URL('../assets/img/mv2.jpg', import.meta.url).href },
  { id: 8, name: 'MV8', artist: '歌手8', coverUrl: new URL('../assets/img/mv1.jpg', import.meta.url).href },
]);
const playMV = (mv) => {
  // 这里实现跳转到MV播放页面的逻辑
  console.log('播放MV:', mv.name);
  // 例如：router.push({ name: 'mvPlayer', params: { id: mv.id } })
}
</script>

<style scoped>
.recommended-mvs {
  margin-top: 40px;
}

.section-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.mvs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.mv-item {
  text-align: center;
}

.mv-cover-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  aspect-ratio: 16 / 9;
}

.mv-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mv-cover-container:hover .mv-cover {
  transform: scale(1.1);
}

.mv-cover-container:hover .play-icon {
  opacity: 1;
}

.mv-info {
  margin-top: 10px;
}

.mv-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.mv-artist {
  font-size: 14px;
  color: #666;
}
</style>