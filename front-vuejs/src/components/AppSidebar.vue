<template>
  <nav class="sidebar">
    <!-- Logo / brand area -->
    <div class="sidebar-brand">
      <span class="sidebar-brand-icon">✚</span>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppSidebar'
})
</script>

<style scoped>
.sidebar {
  width: 72px;
  min-height: 100vh;
  background-color: #1a2b4a;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 64px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-brand-icon {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
