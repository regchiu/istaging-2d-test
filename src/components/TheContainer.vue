<script setup lang="ts"></script>

<template>
  <div class="the-container">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
@media (min-width: 1280px) {
  .the-container {
    max-width: 1280px;
    margin: 40px auto;
  }
}

@media (max-width: 1280px) {
  .the-container {
    max-width: 800px;
    margin: 10px auto;
  }
}
</style>
