<template>
  <a-config-provider>
    <div class="app-container">
      <a-layout style="min-height: 100vh">
        <a-layout-header class="header">
          <div class="logo">Lumosyve</div>
          <a-menu
            v-model:selectedKeys="selectedKeys"
            theme="dark"
            mode="horizontal"
            :style="{ lineHeight: '64px' }"
          >
            <a-menu-item key="home">
              <router-link to="/">首页</router-link>
            </a-menu-item>
            <a-menu-item key="about">
              <router-link to="/about">关于</router-link>
            </a-menu-item>
          </a-menu>
        </a-layout-header>
        <a-layout-content style="padding: 0 50px">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <a-breadcrumb-item>{{ currentRoute }}</a-breadcrumb-item>
          </a-breadcrumb>
          <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
            <router-view />
          </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          Lumosyve ©2025 Created by Lumosyve Team
        </a-layout-footer>
      </a-layout>
    </div>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const selectedKeys = ref<string[]>(['home'])

const currentRoute = computed(() => {
  const path = route.path
  if (path === '/') return '首页'
  if (path === '/about') return '关于'
  return ''
})
</script>

<style>
.header {
  display: flex;
  align-items: center;
}

.logo {
  color: white;
  font-size: 20px;
  font-weight: bold;
  margin-right: 30px;
}
</style>