<script setup lang="ts">
const props = defineProps<{
  title?: string
}>()
</script>

<template>
  <header class="the-header">
    <div><slot name="left"></slot></div>
    <div class="the-header__title">{{ props.title }}</div>
    <div><slot name="right"></slot></div>
  </header>
</template>

<style lang="scss" scoped>
.the-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background-color: #dddddd;

  &__title {
    font-size: 24px;
    height: 25px;
    line-height: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
