<template>
  <div class="latest-music">
    <div class="content-wrapper">
      <div class="top-controls">
        <div class="left-controls">
          <el-button @click="toggleMultiSelect">
            {{ isMultiSelectMode ? '取消多选' : '批量加入播放列表' }}
          </el-button>
          <transition name="fade">
            <el-button v-if="isMultiSelectMode" @click="addSelectedToPlaylist">
              添加到播放列表
            </el-button>
          </transition>
        </div>
        <div class="music-categories">
          <span v-for="category in categories" :key="category" 
                class="category" 
                :class="{ active: selectedCategory === category }"
                @click="selectCategory(category)">
            {{ category }}
          </span>
        </div>
      </div>
      <!-- 歌曲列表 -->
      <div class="song-list">
        <div v-for="(song, index) in displayedSongs" :key="song.id" class="song-item">
          <div class="checkbox-container" :class="{ 'show-checkbox': isMultiSelectMode }">
            <el-checkbox v-model="song.selected" class="song-checkbox"></el-checkbox>
          </div>
          <span class="song-index">{{ (index + 1).toString().padStart(2, '0') }}</span>
          <div class="song-cover-container" @click="handleSongClick(song)">
            <img :src="song.coverUrl" :alt="song.name" class="song-cover">
            <div class="play-icon">▶</div>
          </div>
          <div class="song-name" @click="handleSongClick(song)">{{ song.name }}</div>
          <div class="song-artist" @click="handleSongClick(song)">{{ song.artist }}</div>
          <div class="song-album" @click="handleSongClick(song)">{{ song.album }}</div>
          <div class="song-duration">{{ formatDuration(song.duration) }}</div>
          <el-dropdown trigger="click" @command="(command) => handleCommand(command, song)">
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
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue';
import { mockSongs } from '../mock/mockSongs.js';
import { ElMessage } from 'element-plus';

const categories = ref(['全部', '华语', '欧美', '韩国', '日本']);
const selectedCategory = ref('全部');
const isMultiSelectMode = ref(false);

const songs = ref([]);

onMounted(() => {
  songs.value = mockSongs.slice(0, 100).map(song => ({...song, selected: false}));
});

const displayedSongs = computed(() => {
  if (selectedCategory.value === '全部') {
    return songs.value;
  } else {
    return songs.value.filter(song => song.tags.includes(selectedCategory.value));
  }
});

const selectCategory = (category) => {
  selectedCategory.value = category;
};

const playSong = inject('playSong');
const insertToNextInPlaylist = inject('insertToNextInPlaylist');
const addToPlaylist = inject('addToPlaylist');

const handleSongClick = (song) => {
  if (isMultiSelectMode.value) {
    song.selected = !song.selected;
  } else {
    handlePlaySong(song);
  }
};

const handlePlaySong = (song) => {
  console.log('Playing song:', song);
  playSong(song);
};

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

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const toggleMultiSelect = () => {
  isMultiSelectMode.value = !isMultiSelectMode.value;
  if (!isMultiSelectMode.value) {
    songs.value.forEach(song => song.selected = false);
  }
};

const addSelectedToPlaylist = () => {
  const selectedSongs = songs.value.filter(song => song.selected);
  if (selectedSongs.length === 0) {
    ElMessage.warning('请先选择歌曲');
    return;
  }
  selectedSongs.forEach(song => addToPlaylist(song));
  ElMessage.success(`已添加 ${selectedSongs.length} 首歌曲到播放列表`);
  isMultiSelectMode.value = false;
  songs.value.forEach(song => song.selected = false);
};
</script>

<style scoped>
.content-wrapper {
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.top-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.left-controls {
  display: flex;
  gap: 10px;
}

.music-categories {
  display: flex;
  flex-wrap: wrap;
}

.category {
  margin-left: 15px;
  padding: 3px 8px;
  cursor: pointer;
  border-radius: 15px;
  transition: background-color 0.3s;
  font-size: 14px;
}

.category:hover, .category.active {
  background-color: rgba(71, 139, 255, 0.963);
  color: white;
}

.category.active {
  font-weight: bold;
}

.song-list {
  margin-top: 20px;
}

.song-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s;
  cursor: pointer; /* 添加这一行 */
}

.song-item:hover {
  background-color: #f5f5f5; /* 可选：添加悬停效果 */
}

.checkbox-container {
  width: 0;
  overflow: hidden;
  transition: width 0.3s ease;
}

.checkbox-container.show-checkbox {
  width: 30px;
}

.song-checkbox {
  margin-right: 10px;
}

.song-index {
  width: 40px;
  text-align: center;
  color: #999;
  font-size: 16px;
}

.song-cover-container {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 15px;
  flex-shrink: 0;
  cursor: pointer;
}

.song-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 20px;
  opacity: 0;
  transition: opacity 0.3s;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.song-name, .song-artist, .song-album {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 15px;
}

.song-name {
  font-weight: bold;
}

.song-artist, .song-album {
  color: #666;
}

.song-duration {
  width: 60px;
  text-align: right;
  color: #999;
  font-size: 14px;
  margin-right: 15px;
}

.more-options {
  flex-shrink: 0;
}

/* 添加新的过渡动画样式 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 其他样式保持不变 */

.left-controls .el-button {
  background-color: white;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.left-controls .el-button:hover {
  color: #409EFF;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

/* 其他样式保持不变 */
</style>