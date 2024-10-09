<script setup>
import { ref, onMounted, defineExpose, watch, computed } from 'vue';
import { Howl, Howler } from 'howler';
import { ArrowLeft, ArrowRight, VideoPlay, VideoPause, List, Microphone, Mute, Delete, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus';

const currentSong = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(100);
const sliderValue = ref(0);

let sound = null;
let seekInterval = null;

const playlist = ref([]);
const playHistory = ref([]);
const currentIndex = ref(-1);

const loadSong = (song) => {
  console.log('Footer: Loading song:', song);
  if (sound) {
    sound.unload();
  }
  // 检查歌曲是否已在播放列表中
  const songIndex = playlist.value.findIndex(s => s.id === song.id);
  if (songIndex === -1) {
    // 如果歌曲不在播放列表中，将其添加到列表
    playlist.value.push(song);
    currentIndex.value = playlist.value.length - 1;
  } else {
    // 如果歌曲已在播放列表中，更新当前索引
    currentIndex.value = songIndex;
  }

  sound = new Howl({
    src: [song.url],
    html5: true,
    onplay: () => {
      isPlaying.value = true;
      startSeekInterval();
    },
    onpause: () => {
      isPlaying.value = false;
      stopSeekInterval();
    },
    onend: () => {
      isPlaying.value = false;
      stopSeekInterval();
      playNext();
    },
    onload: () => {
      duration.value = sound.duration();
    }
  });
  currentSong.value = song;
  addToHistory(song);
  sound.play();
};

const togglePlay = () => {
  if (sound) {
    if (sound.playing()) {
      sound.pause();
    } else {
      sound.play();
    }
  }
};

const startSeekInterval = () => {
  stopSeekInterval();
  seekInterval = setInterval(() => {
    if (sound && sound.playing()) {
      currentTime.value = sound.seek();
      sliderValue.value = (currentTime.value / duration.value) * 100;
    }
  }, 100);
};

const stopSeekInterval = () => {
  if (seekInterval) {
    clearInterval(seekInterval);
  }
};

const setProgress = (value) => {
  if (sound && duration.value) {
    const seekTime = (value / 100) * duration.value;
    sound.seek(seekTime);
    currentTime.value = seekTime;
  }
};

const setVolume = () => {
  Howler.volume(volume.value / 100);
};

const formatTime = (time) => {
  if (isNaN(time) || time === Infinity) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const formatTooltip = (value) => {
  if (!sound || !duration.value) return '0:00';
  const time = (value / 100) * duration.value;
  return formatTime(time);
};

const isMuted = ref(false);
const previousVolume = ref(100);

const toggleMute = () => {
  if (isMuted.value) {
    volume.value = previousVolume.value;
    isMuted.value = false;
  } else {
    previousVolume.value = volume.value;
    volume.value = 0;
    isMuted.value = true;
  }
  setVolume();
};

onMounted(() => {
  Howler.volume(volume.value / 100);
});

watch(currentTime, (newTime) => {
  if (sound && Math.abs(newTime - sound.seek()) > 0.5) {
    sound.seek(newTime);
  }
});

const showPlaylist = ref(false);
const isShowingHistory = ref(false);

const currentPlaylist = computed(() => {
  return isShowingHistory.value ? playHistory.value : playlist.value;
});

const addToPlaylist = (song) => {
  if (!playlist.value.some(item => item.id === song.id)) {
    playlist.value.push(song);
    if (currentIndex.value === -1) {
      currentIndex.value = playlist.value.length - 1;
      loadSong(song);
    }
  }
};

const removeFromPlaylist = (index) => {
  if (index < currentIndex.value) {
    currentIndex.value--;
  }
  playlist.value.splice(index, 1);
};

const clearPlaylist = () => {
  ElMessageBox.confirm('确定要清空播放列表吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    if (currentSong.value) {
      // 如果有正在播放的歌曲，保留它
      playlist.value = [currentSong.value];
      currentIndex.value = 0;
    } else {
      // 如果没有正在播放的歌曲，完全清空列表
      playlist.value = [];
      currentIndex.value = -1;
    }
  }).catch(() => {});
};

const playFromPlaylist = (song) => {
  loadSong(song);
};

const moveSongUp = (index) => {
  if (index > 0 && index > currentIndex.value + 1) {
    const temp = playlist.value[index];
    playlist.value[index] = playlist.value[index - 1];
    playlist.value[index - 1] = temp;
  }
};

const moveSongDown = (index) => {
  if (index < playlist.value.length - 1 && index > currentIndex.value) {
    const temp = playlist.value[index];
    playlist.value[index] = playlist.value[index + 1];
    playlist.value[index + 1] = temp;
  }
};

const togglePlaylist = () => {
  showPlaylist.value = !showPlaylist.value;
};

const toggleHistoryView = () => {
  isShowingHistory.value = !isShowingHistory.value;
};

const addToHistory = (song) => {
  const index = playHistory.value.findIndex(item => item.id === song.id);
  if (index !== -1) {
    playHistory.value.splice(index, 1);
  }
  playHistory.value.unshift({
    ...song,
    playedAt: new Date().toLocaleString() // 添加播放时间
  });
};

const formatPlayedAt = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const playNext = () => {
  if (currentIndex.value < playlist.value.length - 1) {
    currentIndex.value++;
    loadSong(playlist.value[currentIndex.value]);
  } else {
    // 如果是最后一首，显示提示信息
    ElMessage.info('这是最后一首歌曲');
  }
};

const playPrevious = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    loadSong(playlist.value[currentIndex.value], false);
  } else {
    // 如果是第一首，显示提示信息
    ElMessage.info('这是第一首歌曲');
  }
};

watch(currentSong, (newSong) => {
  if (newSong) {
    addToHistory(newSong);
  }
});

const displayPlaylist = computed(() => {
  return playlist.value;
});
const insertToNextInPlaylist = (song) => {
  console.log('Footer: Inserting song to next in playlist:', song);
  // 检查歌曲是否已经在播放列表中
  const existingIndex = playlist.value.findIndex(s => s.id === song.id);
  if (existingIndex !== -1) {
    // 如果歌曲已经在列表中，先将其移除
    playlist.value.splice(existingIndex, 1);
  }

  // 找到当前播放歌曲的索引
  const currentSongIndex = playlist.value.findIndex(s => s.id === currentSong.value?.id);

  if (currentSongIndex !== -1) {
    // 如果当前有歌曲在播放，将新歌插入到其后面
    playlist.value.splice(currentSongIndex + 1, 0, song);
  } else {
    // 如果当前没有歌曲在播放，将新歌插入到列表开头
    playlist.value.unshift(song);
  }

  console.log('Updated playlist:', playlist.value);
};

defineExpose({ loadSong, addToPlaylist, insertToNextInPlaylist });
</script>

<template>
  <div class="app-footer">
    <div class="song-info">
      <img :src="currentSong?.coverUrl || './src/static/default.jpg'" alt="Album Cover" class="album-cover">
      <div class="song-details">
        <span class="song-name">{{ currentSong?.name || '未选择歌曲' }}</span>
        <span class="artist-name">{{ currentSong?.artist || '未知艺术家' }}</span>
      </div>
    </div>
    <div class="player-controls">
      <div class="control-buttons">
        <el-tooltip :content="currentIndex <= 0 ? '这是第一首' : '上一首'" placement="top" :show-after="500">
          <el-button :icon="ArrowLeft" circle class="control-button" @click="playPrevious" :disabled="currentIndex <= 0"></el-button>
        </el-tooltip>
        <el-tooltip :content="isPlaying ? '暂停' : '播放'" placement="top" :show-after="500">
          <el-button :icon="isPlaying ? VideoPause : VideoPlay" circle @click="togglePlay" class="control-button play-button"></el-button>
        </el-tooltip>
        <el-tooltip :content="currentIndex >= playlist.length - 1 ? '这是最后一首' : '下一首'" placement="top" :show-after="500">
          <el-button :icon="ArrowRight" circle class="control-button" @click="playNext" :disabled="currentIndex >= playlist.length - 1"></el-button>
        </el-tooltip>
      </div>
      <div class="progress-container">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <el-slider v-model="sliderValue" :max="100" :step="0.1" class="progress-bar" @change="setProgress" :format-tooltip="formatTooltip" />
        <span class="time">{{ formatTime(duration) }}</span>
      </div>
    </div>
    <div class="additional-controls">
      <el-popover
        v-model:visible="showPlaylist"
        placement="top"
        :width="300"
        trigger="manual"
      >
        <template #reference>
          <el-button :icon="List" circle class="control-button" @click="togglePlaylist"></el-button>
        </template>
        <div class="playlist-popover">
          <div class="playlist-header">
            <h3>{{ isShowingHistory ? '播放历史' : '播放列表' }}</h3>
            <div>
              <el-button type="text" @click="toggleHistoryView">
                {{ isShowingHistory ? '查看播放列表' : '查看播放历史' }}
              </el-button>
              <el-button v-if="!isShowingHistory" type="danger" size="small" @click="clearPlaylist" :icon="Delete">清空</el-button>
            </div>
          </div>
          <div class="playlist-items">
            <div v-for="(song, index) in displayPlaylist" :key="song.id" 
                 class="playlist-item" 
                 :class="{ 'current-playing': index === currentIndex }">
              <span v-if="isShowingHistory" class="played-at">{{ formatPlayedAt(song.playedAt) }}</span>
              <span @click="playFromPlaylist(song)">{{ song.name }} - {{ song.artist }}</span>
              <div v-if="!isShowingHistory" class="playlist-item-controls">
                <el-button 
                  type="text" 
                  size="small" 
                  @click="moveSongUp(index)" 
                  :icon="ArrowUp"
                  :disabled="index === 0 || index === currentIndex"
                ></el-button>
                <el-button 
                  type="text" 
                  size="small" 
                  @click="moveSongDown(index)" 
                  :icon="ArrowDown"
                  :disabled="index === displayPlaylist.length - 1 || index === currentIndex"
                ></el-button>
                <el-button 
                  type="danger" 
                  size="small" 
                  @click="removeFromPlaylist(index)" 
                  :icon="Delete"
                  :disabled="index === currentIndex"
                ></el-button>
              </div>
            </div>
          </div>
        </div>
      </el-popover>
      <div class="volume-control">
        <el-tooltip :content="isMuted ? '取消静音' : '静音'" placement="top" :show-after="500">
          <el-button 
            :icon="isMuted ? Mute : Microphone" 
            circle 
            class="control-button volume-button" 
            @click="toggleMute"
          ></el-button>
        </el-tooltip>
        <el-slider v-model="volume" :max="100" :step="1" class="volume-slider" @change="setVolume" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-footer {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px; /* 保留左右内边距，但可以根据需要调整 */
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  width: 100%; /* 确保宽度为100% */
  box-sizing: border-box; /* 确保padding不会增加总宽度 */
}

.song-info {
  display: flex;
  align-items: center;
  width: 180px;
}

.album-cover {
  width: 45px;
  height: 45px;
  object-fit: cover;
  margin-right: 10px;
}

.song-details {
  display: flex;
  flex-direction: column;
}

.song-name {
  font-weight: bold;
  font-size: 0.9em;
}

.artist-name {
  font-size: 0.75em;
  color: #666;
}

.player-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  max-width: 550px;
  padding-top: 10px;
}

.control-button {
    color: rgba(71, 139, 255, 0.963);
  width: 36px;
  height: 36px;
  font-size: 20px;
}

.play-button {
    
  width: 45px;
  height: 45px;
  font-size: 25px;
}

.progress-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.progress-bar {
  flex-grow: 1;
  margin: 0 8px;
}

.time {
  font-size: 0.75em;
  color: #666;
  min-width: 35px;
  text-align: center;
}

.additional-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 220px; /* 增加宽度以容纳新按钮 */
  justify-content: flex-end;
}

.volume-control {
  display: flex;
  align-items: center;
  width: 120px; /* 增加宽度以容纳新按钮 */
}

.volume-button {
  margin-right: 8px;
}

.volume-slider {
  width: 100%;
}

.el-button.is-circle {
  padding: 6px;
}

:deep(.el-slider__runway) {
  margin: 8px 0;
}

.playlist-popover {
  max-height: 300px;
  overflow-y: auto;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.playlist-items {
  display: flex;
  flex-direction: column;
}

.playlist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #eee;
}

.playlist-item span {
  cursor: pointer;
}

.playlist-item-controls {
  display: flex;
  align-items: center;
}

.playlist-item:hover {
  background-color: #f5f7fa;
}

.current-song {
  padding: 10px;
  background-color: #f0f0f0;
  margin-bottom: 10px;
  border-radius: 4px;
}

.played-at {
  font-size: 0.8em;
  color: #999;
  margin-right: 10px;
}

.playlist-item.current-playing {
  background-color: rgba(71, 139, 255, 0.1);
  font-weight: bold;
}
</style>