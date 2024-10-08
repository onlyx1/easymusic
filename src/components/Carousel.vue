<template>
    <div class="carousel-container">
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="item in carouselItems" :key="item.id" @click="openItem(item)">
          <div class="carousel-item">
            <img :src="item.imageUrl" :alt="item.title" class="carousel-image">
            <div class="carousel-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const carouselItems = ref([
    { id: 1, title: 'HELLO.WORLD', description: '边伯贤 BAEKHYUN', imageUrl: '/src/assets/img/banner1.jpg' },
    { id: 2, title: '街上的明星', description: '新裤子', imageUrl: '/src/assets/img/banner2.jpg' },
    { id: 3, title: '世帝尊', description: '肉身成圣弹指遮天', imageUrl: '/src/assets/img/banner3.jpg' },
  ])
  const openItem = (item) => {
  // 这里实现跳转到MV播放页面的逻辑
  console.log('点击了轮播图:', item.title);
  // 例如：router.push({ name: 'mvPlayer', params: { id: mv.id } })
}
  </script>
  
  <style scoped>
  .carousel-container {
    width: 100%;
    margin-bottom: 20px;
  }
  
  .carousel-item {
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .carousel-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0));
    color: white;
  }
  
  .carousel-content h3 {
    font-size: 24px;
    margin-bottom: 5px;
  }
  
  .carousel-content p {
    font-size: 16px;
  }
  
  :deep(.el-carousel__item) {
    border-radius: 6px;
  }
  </style>