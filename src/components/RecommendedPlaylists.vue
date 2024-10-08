<template>
    <div class="recommended-playlists">
      <h2 class="section-title">推荐歌单</h2>
      <div class="playlists-grid">
        <div v-for="playlist in playlists" :key="playlist.id" class="playlist-item" @click="openPlaylist(playlist)">
          <img :src="playlist.coverUrl" :alt="playlist.name" class="playlist-cover">
          <p class="playlist-name">{{ playlist.name }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // 这里我们模拟一些歌单数据，实际应用中这可能来自API
  const playlists = ref([
    { id: 1, name: '轻音乐', coverUrl: '/src/assets/img/1.jpg' },
    { id: 2, name: '流行热歌', coverUrl: '/src/assets/img/2.jpg' },
    { id: 3, name: '经典老歌', coverUrl: '/src/assets/img/3.jpg' },
    { id: 4, name: '摇滚精选', coverUrl: '/src/assets/img/4.jpg' },
    { id: 5, name: '爵士音乐', coverUrl: '/src/assets/img/1.jpg' },
    { id: 6, name: '电子音乐', coverUrl: '/src/assets/img/2.jpg' },
    { id: 7, name: '古典音乐', coverUrl: '/src/assets/img/3.jpg' },
    { id: 8, name: 'R&B/Soul', coverUrl: '/src/assets/img/4.jpg' },
    { id: 9, name: '民谣歌曲', coverUrl: '/src/assets/img/1.jpg' },
    { id: 10, name: '嘻哈说唱', coverUrl: '/src/assets/img/2.jpg' },
  ]);
  const openPlaylist = (playlist) => {
  // 这里实现跳转到MV播放页面的逻辑
  console.log('打开歌单:', playlist.name);
  // 例如：router.push({ name: 'mvPlayer', params: { id: mv.id } })
}
  </script>
  
  <style scoped>
  .recommended-playlists {
    margin-top: 30px;
  }
  
  .section-title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .playlists-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    row-gap: 30px;
  }
  
  .playlist-item {
    text-align: center;
  }
  
  .playlist-cover {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  
  .playlist-cover:hover {
    transform: scale(1.05);
  }
  
  .playlist-name {
    margin-top: 10px;
    font-size: 14px;
  }
  </style>