<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Headset, List, Guide, VideoPlay } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const menuItems = [
  { index: '1', icon: Headset, text: '发现音乐', route: '/' },
  { index: '2', icon: List, text: '推荐歌单', route: '/playlists' },
  { index: '3', icon: Guide, text: '最新音乐', route: '/latest-music' },
  { index: '4', icon: VideoPlay, text: '最新MV', route: '/latest-mv' }
]

const activeIndex = ref('1')

const updateActiveIndex = () => {
  const currentItem = menuItems.find(item => item.route === route.path)
  activeIndex.value = currentItem ? currentItem.index : '1'
}

onMounted(() => {
  updateActiveIndex()
})

watch(() => route.path, updateActiveIndex)

const handleSelect = (index) => {
  const selectedItem = menuItems.find(item => item.index === index)
  if (selectedItem) {
    router.push(selectedItem.route)
  }
}
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-vertical-demo"
    @select="handleSelect"
    background-color="#E8E8E8"
      text-color="#333333"
      active-text-color="rgba(71, 139, 255, 0.963)"
  >
    <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index">
      <el-icon><component :is="item.icon" /></el-icon>
      <span>{{ item.text }}</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
.el-menu-vertical-demo {
  height: 100%;
  border-right: none;
}

.el-menu-item {
  display: flex;
  align-items: center;
}

.el-icon {
  margin-right: 5px;
}
</style>