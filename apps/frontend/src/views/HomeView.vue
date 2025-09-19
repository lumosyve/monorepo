<template>
  <div class="home">
    <h1>欢迎使用 Lumosyve 前端应用</h1>
    <a-row :gutter="16" style="margin-top: 20px">
      <a-col :span="8">
        <a-card title="功能模块一" :bordered="false">
          <p>这是功能模块一的描述内容</p>
          <a-button type="primary">查看详情</a-button>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="功能模块二" :bordered="false">
          <p>这是功能模块二的描述内容</p>
          <a-button type="primary">查看详情</a-button>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="功能模块三" :bordered="false">
          <p>这是功能模块三的描述内容</p>
          <a-button type="primary">查看详情</a-button>
        </a-card>
      </a-col>
    </a-row>
    <HelloWorld />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useCounterStore } from '../stores/counter'
import HelloWorld from '../components/HelloWorld.vue'

const counterStore = useCounterStore()

onMounted(() => {
  console.log('Home view mounted')
})
</script>

<style scoped>
.home {
  padding: 20px 0;
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 500;
}
</style>