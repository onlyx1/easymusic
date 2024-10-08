<template>
    <div class="app-container">
      <div class="content-wrapper">
        <router-view></router-view>
      </div>
      <el-button
        class="back-to-top"
        :icon="ArrowUp"
        @click="scrollToTop"
        v-show="showBackToTop"
      ></el-button>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowUp } from '@element-plus/icons-vue'

const route = useRoute()
const showBackToTop = ref(false)

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.app-container {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  position: relative;
}

.content-wrapper {
  width: 100%;
  max-width: 1000px;
  padding: 0 40px;
  box-sizing: border-box;
}

.back-to-top {
  position: fixed;
  bottom: 100px;
  right: 40px;
  z-index: 99;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  color: #606266;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.back-to-top:hover {
  background-color: #ffffff;
  color: #409EFF;
}
</style>