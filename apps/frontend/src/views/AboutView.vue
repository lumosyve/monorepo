<template>
  <div class="about">
    <h1>关于我们</h1>
    <a-typography>
      <a-typography-paragraph>
        这是Lumosyve项目的前端应用，基于Vue 3、TypeScript和Ant Design Vue构建。
      </a-typography-paragraph>
      <a-typography-paragraph>
        该项目是一个monorepo结构，使用pnpm和Turborepo管理，包含前端和后端服务。
      </a-typography-paragraph>
      <a-typography-title :level="2">技术栈</a-typography-title>
      <a-typography-paragraph>
        <ul>
          <li>Vue 3 - 渐进式JavaScript框架</li>
          <li>TypeScript - 类型安全的JavaScript超集</li>
          <li>Vite - 下一代前端构建工具</li>
          <li>Vue Router - Vue.js官方路由</li>
          <li>Pinia - Vue的状态管理库</li>
          <li>Ant Design Vue - 企业级UI组件库</li>
        </ul>
      </a-typography-paragraph>
      <a-typography-title :level="2">计数器示例</a-typography-title>
      <a-space>
        <a-button @click="counterStore.increment">
          计数: {{ counterStore.count }}
        </a-button>
        <a-button @click="counterStore.reset" type="primary" danger>
          重置
        </a-button>
      </a-space>
    </a-typography>
  </div>
</template>

<script lang="ts" setup>
import { useCounterStore } from '../stores/counter'

const counterStore = useCounterStore()
</script>

<style scoped>
.about {
  padding: 20px 0;
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 500;
}
</style>