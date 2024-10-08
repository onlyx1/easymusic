<script setup>
import { ref, inject } from 'vue'
import { Search } from '@element-plus/icons-vue'

const isLoggedIn = ref(false) // 假设用户未登录
const searchQuery = ref('')
const showLoginRegister = inject('showLoginRegister')
const loginRegisterTab = inject('loginRegisterTab')  // 注入 loginRegisterTab

const handleSearch = () => {
  // 这里实现搜索逻辑
  console.log('搜索:', searchQuery.value)
  // 可以在这里调用搜索API或者跳转到搜索结果页面
}

const openLoginRegister = (tab) => {
  showLoginRegister.value = true
  loginRegisterTab.value = tab  // 设置要显示的标签页
}
</script>

<template>
  <div class="app-header">
    <div class="logo">
      <img src="../assets/logo.png" alt="Logo" />
      <span class="logo-text">音乐播放器</span>
    </div>
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索音乐、歌手、歌词、用户"
        :prefix-icon="Search"
        @keyup.enter="handleSearch"
        class="custom-search-input"
      >
      </el-input>
      <el-button @click="handleSearch" class="search-button" :icon="Search">搜索</el-button>
    </div>
    <div class="user-actions">
      <template v-if="isLoggedIn">
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
      </template>
      <template v-else>
        <el-button type="primary" size="small" @click="openLoginRegister('login')">登录</el-button>
        <el-button size="small" @click="openLoginRegister('register')">注册</el-button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.app-header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px; /* 保留左右内边距，但可以根据需要调整 */
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%; /* 确保宽度为100% */
  box-sizing: border-box; /* 确保padding不会增加总宽度 */
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 40px;
  width: 40px;
  margin-right: 10px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.search-bar {
  flex-grow: 1;
  max-width: 500px;
  margin: 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.custom-search-input {
  flex-grow: 1;
}

:deep(.el-input__wrapper) {
  border-radius: 20px !important;
  box-shadow: none !important;
  background-color: #f5f5f5;
}

:deep(.el-input__inner) {
  background-color: #f5f5f5;
}

.search-button {
  border-radius: 20px;
  background-color: rgba(71, 139, 255, 0.963);
  border: none;
  padding: 12px 20px;
  color: white;
}

.search-button:hover {
  background-color: rgba(56, 111, 204, 0.963);
}

:deep(.search-button .el-icon) {
  color: white;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>