<script setup>
import { ref, provide, onMounted } from 'vue'
import AppHeader from './components/header.vue'
import AppFooter from './components/footer.vue'
import AppAside from './components/aside.vue'
import AppContainer from './components/container.vue'
import LoginRegister from './components/LoginRegister.vue'

const showLoginRegister = ref(false)
const loginRegisterTab = ref('login')

provide('showLoginRegister', showLoginRegister)
provide('loginRegisterTab', loginRegisterTab)

onMounted(() => {
  showLoginRegister.value = true
  loginRegisterTab.value = 'login'
})

const footerRef = ref(null);

provide('playSong', (song) => {
  console.log('App: Attempting to play song:', song);
  if (footerRef.value && footerRef.value.loadSong) {
    footerRef.value.loadSong(song);
  } else {
    console.error('Footer component or loadSong method not found');
  }
});

provide('insertToNextInPlaylist', (song) => {
  console.log('App: Attempting to insert song to next in playlist:', song);
  if (footerRef.value && footerRef.value.insertToNextInPlaylist) {
    footerRef.value.insertToNextInPlaylist(song);
  } else {
    console.error('Footer component or insertToNextInPlaylist method not found');
  }
});

provide('addToPlaylist', (song) => {
  console.log('App: Attempting to add song to playlist:', song);
  if (footerRef.value && footerRef.value.addToPlaylist) {
    footerRef.value.addToPlaylist(song);
  } else {
    console.error('Footer component or addToPlaylist method not found');
  }
});
</script>

<template>
  <div class="app-wrapper">
    <el-container class="main-container">
      <el-header height="60px" class="fixed-header">
        <AppHeader />
      </el-header>
      <el-container class="content-container">
        <el-aside width="260px" class="fixed-aside">
          <AppAside />
        </el-aside>
        <el-main>
          <AppContainer />
        </el-main>
      </el-container>
    </el-container>
    <el-footer height="80px" class="fixed-footer">
      <AppFooter ref="footerRef" />
    </el-footer>
  </div>
  <LoginRegister />
</template>

<style>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-container {
  flex: 1;
  display: flex;
  margin-top: 60px; /* header 高度 */
  margin-bottom: 80px; /* footer 高度 */
}

.fixed-header, .fixed-footer {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1001;
  width: 100%; /* 确保宽度为100% */
  padding: 0; /* 移除可能的内边距 */
}

.fixed-aside {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 80px;
  overflow-y: auto;
}

.fixed-footer {
  bottom: 0;
  height: 80px; /* 确保footer高度 */
  background-color: #fff; /* 添加背景色 */
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1); /* 添加阴影效果 */
}

.el-main {
  flex: 1;
  overflow-y: auto; /* 允许内容区域滚动 */
  margin-left: 260px; /* aside 宽度 */
  padding: 20px;
}

.el-header, .el-footer {
  padding: 0; /* 移除 Element Plus 默认的内边距 */
}
</style>