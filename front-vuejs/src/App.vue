<template>
  <div id="app">
    <AppSidebar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'

export default Vue.extend({
  name: 'App',
  components: { AppSidebar }
})
</script>
