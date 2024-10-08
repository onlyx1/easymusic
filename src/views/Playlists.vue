<template>
  <div class="playlists">
    <!-- 精品歌单部分保持不变 -->
    <div class="featured-playlist" @click="goToFeaturedPlaylist">
      <div class="featured-playlist-content">
        <img :src="featuredPlaylist.coverUrl" alt="精品歌单封面" class="featured-playlist-cover">
        <div class="featured-playlist-info">
          <div class="featured-playlist-header">
            <span class="featured-playlist-tag">精品歌单</span>
          </div>
          <h2 class="featured-playlist-title">{{ featuredPlaylist.title }}</h2>
          <p class="featured-playlist-description">{{ featuredPlaylist.description }}</p>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- 歌曲分类 -->
      <div class="playlist-categories">
        <span v-for="category in categories" :key="category" 
              class="category" 
              :class="{ active: selectedCategory === category }"
              @click="selectCategory(category)">
          {{ category }}
        </span>
      </div>

      <!-- 歌单网格 -->
      <div class="playlist-grid">
        <div v-for="playlist in displayedPlaylists" :key="playlist.id" class="playlist-item" @click="goToPlaylist(playlist.id)">
          <img :src="playlist.coverUrl" :alt="playlist.name" class="playlist-cover">
          <p class="playlist-name">{{ playlist.name }}</p>
        </div>
      </div>

      <!-- 分页控件 -->
      <div class="pagination">
        <span class="page-nav" @click="goToPage(currentPage - 1)" :class="{ disabled: currentPage === 1 }">&lt;</span>
        <template v-if="totalPages <= 5">
          <span v-for="page in totalPages" :key="page" 
                class="page-number" 
                :class="{ active: currentPage === page }"
                @click="goToPage(page)">
            {{ page }}
          </span>
        </template>
        <template v-else>
          <span class="page-number" :class="{ active: currentPage === 1 }" @click="goToPage(1)">1</span>
          <span v-if="currentPage > 3">...</span>
          <span v-for="page in middlePages" :key="page" 
                class="page-number" 
                :class="{ active: currentPage === page }"
                @click="goToPage(page)">
            {{ page }}
          </span>
          <span v-if="currentPage < totalPages - 2">...</span>
          <span class="page-number" :class="{ active: currentPage === totalPages }" @click="goToPage(totalPages)">{{ totalPages }}</span>
        </template>
        <span class="page-nav" @click="goToPage(currentPage + 1)" :class="{ disabled: currentPage === totalPages }">&gt;</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 精品歌单数据保持不变
const featuredPlaylist = ref({
  id: 'featured',
  title: '古典清香！我的茶馆里住着巴赫与肖邦',
  description: '清香古韵，悠长深邃。本单选曲均为抒情、抗躁的古典音乐，睡前服用效果尤佳注：本歌单纯属兴趣使然，非专业探讨。茶馆与音乐艺术是两种不同文化形态，其中茶馆是中国传统茶文化的物质载体，音乐艺术乃是全世界最具有情感的艺术形式，两者的结合是社会文化发展过程中自然选择的结果。',
  coverUrl: new URL('../assets/img/1.jpg', import.meta.url).href
});

// 歌曲分类
const categories = ref(['全部', '华语', '流行', '摇滚', '民谣', '电子']);
const selectedCategory = ref('全部');

// 生成模拟歌单数据
const generatePlaylists = (count) => {
  const coverImages = [
    new URL('../assets/img/1.jpg', import.meta.url).href,
    new URL('../assets/img/2.jpg', import.meta.url).href,
    new URL('../assets/img/3.jpg', import.meta.url).href,
    new URL('../assets/img/4.jpg', import.meta.url).href
  ];
  const tags = ['华语', '流行', '摇滚', '民谣', '电子'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `歌单${i + 1}`,
    coverUrl: coverImages[Math.floor(Math.random() * coverImages.length)],
    tags: [tags[Math.floor(Math.random() * tags.length)], tags[Math.floor(Math.random() * tags.length)]].filter((v, i, a) => a.indexOf(v) === i)
  }));
};

// 模拟歌单数据
const playlists = ref(generatePlaylists(100)); // 生成100个模拟歌单

// 分页逻辑
const itemsPerPage = 20; // 每页显示的歌单数量
const currentPage = ref(1);

const filteredPlaylists = computed(() => {
  return selectedCategory.value === '全部'
    ? playlists.value
    : playlists.value.filter(playlist => playlist.tags.includes(selectedCategory.value));
});

const totalPages = computed(() => Math.ceil(filteredPlaylists.value.length / itemsPerPage));

const displayedPlaylists = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredPlaylists.value.slice(start, end);
});

const middlePages = computed(() => {
  if (totalPages.value <= 5) return [];
  let start = Math.max(2, currentPage.value - 1);
  let end = Math.min(totalPages.value - 1, start + 2);
  if (end === totalPages.value - 1) start = end - 2;
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const visiblePages = computed(() => {
  const delta = 2;
  const range = [];
  for (let i = Math.max(2, currentPage.value - delta); i <= Math.min(totalPages.value - 1, currentPage.value + delta); i++) {
    range.push(i);
  }
  if (currentPage.value - delta > 2) {
    range.unshift("...");
  }
  if (currentPage.value + delta < totalPages.value - 1) {
    range.push("...");
  }
  range.unshift(1);
  if (totalPages.value > 1) {
    range.push(totalPages.value);
  }
  return range;
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const selectCategory = (category) => {
  selectedCategory.value = category;
  currentPage.value = 1; // 重置页码
};

const goToPlaylist = (id) => {
  router.push({ name: 'playlist', params: { id } });
};

const goToFeaturedPlaylist = () => {
  router.push({ name: 'playlist', params: { id: featuredPlaylist.value.id } });
};
</script>

<style scoped>
/* 保留之前的精品歌单样式 */

.featured-playlist {
  background-color: #f0f0f0;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.featured-playlist:hover {
  background-color: #e0e0e0;
}

.featured-playlist-content {
  display: flex;
  align-items: flex-start;
}

.featured-playlist-cover {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 20px;
}

.featured-playlist-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 150px;
}

.featured-playlist-header {
  display: flex;
  align-items: center;
  margin-bottom: 3px;
}

.featured-playlist-tag {
  display: inline-block;
  background-color: rgba(71, 139, 255, 0.963);
  color: white;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 14px;
  white-space: nowrap;
}

.featured-playlist-title {
  font-size: 18px;
  margin: 2px 0;
  line-height: 1.2;
}

.featured-playlist-description {
  font-size: 13px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  max-height: 5.6em;
  margin-bottom: 8px;
}

.content-wrapper {
  position: relative;
  padding: 0 20px;
}

.playlist-categories {
  display: flex;
  justify-content: flex-end; /* 将分类移到右边 */
  margin: 20px 0;
  flex-wrap: wrap; /* 允许在需要时换行 */
}

.category {
  margin-left: 15px; /* 改为左边距，因为现在是右对齐 */
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

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.playlist-item {
  cursor: pointer;
  transition: transform 0.3s;
}

.playlist-item:hover {
  transform: translateY(-5px);
}

.playlist-cover {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 5px;
}

.playlist-name {
  margin-top: 5px;
  font-size: 14px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
}

.page-nav, .page-number {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
  user-select: none;
}

.page-nav.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number.active {
  font-weight: bold;
  color: rgba(71, 139, 255, 0.963);
}
</style>