<template>
  <div class="app-container">
    <MagicMouse effect-type="fluid" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import MagicMouse from './components/MagicMouse.vue';

onMounted(() => {
  document.body.style.background = 'transparent';
  document.documentElement.style.background = 'transparent';
});
</script>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: transparent;
}
</style>