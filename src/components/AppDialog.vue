<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="mask-layer">
    <div class="dialog-wrapper">
      <div class="dialog">
        <div class="dialog__header">
          <AppButton class="dialog-close-button" flat @click="emit('close')">X</AppButton>
        </div>
        <div class="dialog__body">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mask-layer {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: table;
  transition: opacity 0.3s ease;
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.dialog {
  width: 340px;
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;

  &__header,
  &__body {
    padding: 10px;
  }
}

.dialog-close-button {
  float: right;
  padding: 0;
}
</style>
