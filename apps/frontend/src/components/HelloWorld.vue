<template>
  <div class="hello-world">
    <h2>{{ msg }}</h2>
    <p>
      这是一个基于Vue 3 + TypeScript + Vite的前端项目组件示例。
    </p>
    <a-divider />
    <a-space>
      <a-button type="primary" @click="count++">
        计数: {{ count }}
      </a-button>
      <a-button @click="fetchData">获取后端数据</a-button>
    </a-space>
    <div v-if="loading" style="margin-top: 20px">
      <a-spin />
    </div>
    <div v-else-if="data" style="margin-top: 20px">
      <a-alert :message="data" type="success" />
    </div>
    <div v-else-if="error" style="margin-top: 20px">
      <a-alert :message="error" type="error" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineProps<{
  msg: string
}>()

const count = ref(0)
const loading = ref(false)
const data = ref('')
const error = ref('')

const fetchData = async () => {
  loading.value = true
  data.value = ''
  error.value = ''
  
  try {
    const response = await fetch('/api/hello')
    if (!response.ok) {
      throw new Error('网络请求失败')
    }
    const result = await response.json()
    data.value = result.message
  } catch (err) {
    error.value = err instanceof Error ? err.message : '未知错误'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.hello-world {
  margin: 20px 0;
}

h2 {
  margin-bottom: 16px;
}
</style>