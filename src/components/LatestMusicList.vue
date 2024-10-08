<template>
  <div class="latest-music">
    <h2 class="section-title">最新音乐</h2>
    <div class="music-list">
      <div v-for="(song, index) in songs" :key="song.id" class="music-item">
        <div class="song-index">{{ index + 1 }}</div>
        <img :src="song.coverUrl" :alt="song.name" class="song-cover" @click="playSong(song)">
        <div class="song-info" @click="playSong(song)">
          <div class="song-name">{{ song.name }}</div>
          <div class="song-artist">{{ song.artist }}</div>
        </div>
        <el-dropdown trigger="click" @command="handleCommand($event, song)">
          <el-button class="more-options" icon="More" circle></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="play">播放</el-dropdown-item>
              <el-dropdown-item command="insertNext">插入到下一首播放</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { mockSongs } from '../mock/mockSongs.js';  // 导入 mock 数据

// 使用 mock 数据，并只取最新的10首歌曲
const songs = computed(() => {
  return mockSongs
    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
    .slice(0, 10);
});

const playSong = inject('playSong');
const addToPlaylist = inject('addToPlaylist');
const insertToNextInPlaylist = inject('insertToNextInPlaylist');

const handleCommand = (command, song) => {
  switch (command) {
    case 'play':
      playSong(song);
      break;
    case 'insertNext':
      insertToNextInPlaylist(song);
      break;
  }
};
</script>

<style scoped>
.latest-music {
  margin-top: 40px;
}

.section-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.music-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.music-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

.music-item:hover {
  background-color: #e0e0e0;
}

.song-index {
  font-size: 18px;
  font-weight: bold;
  margin-right: 15px;
  color: #999;
}

.song-cover {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
}

.song-info {
  flex-grow: 1;
}

.song-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.song-artist {
  font-size: 14px;
  color: #666;
}

.el-button {
  margin-left: 10px;
}

.music-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

.more-options {
  margin-left: auto;
}
</style>