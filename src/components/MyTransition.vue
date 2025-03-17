<template>
  <Transition>
    <slot v-if="showAnimate"></slot>
  </Transition>
</template>

<script setup>
import { onMounted, onBeforeMount, onBeforeUnmount } from 'vue';
const showAnimate = ref(false);

//挂载后
onMounted(() => {
  showAnimate.value = true;
});
//卸载前
onBeforeUnmount(() => {
  showAnimate.value = false;
});
</script>

<style lang="scss" scoped></style>
