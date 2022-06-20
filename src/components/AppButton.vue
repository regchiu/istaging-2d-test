<script setup lang="ts">
const props = defineProps<{
  label?: string
  flat?: boolean
  type?: 'submit' | 'reset' | 'button'
  loading?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <button class="app-button" :class="{ 'app-button--flat': props.flat }" :type="props.type" :disabled="props.disabled">
    <slot>
      <slot v-if="loading" name="loading">
        <span class="app-button__loading">Loading...</span>
      </slot>
      <slot v-else name="label">
        <span class="app-button__label">{{ props.label }}</span>
      </slot>
    </slot>
  </button>
</template>

<style lang="scss" scoped>
.app-button {
  display: inline-block;
  cursor: pointer;
  background-color: #dddddd;
  color: #000000;

  &__label {
    font-size: 16px;
  }

  &--flat {
    border: none;
  }
}
</style>
