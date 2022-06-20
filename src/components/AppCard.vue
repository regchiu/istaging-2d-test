<script setup lang="ts">
const props = defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <div class="app-card">
    <div class="app-card__thumb">
      <img src="https://picsum.photos/800/600" />
    </div>
    <div class="app-card__body">
      <div class="title">
        {{ props.title }}
      </div>
      <div class="subtitle">
        {{ props.subtitle }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-card {
  display: flex;

  &__thumb {
    flex: 1;
    img {
      width: 100%;
      height: 100%;
    }
  }

  &__body {
    flex: 1;
    background-color: #dddddd;
  }
}

.title {
  font-size: 24px;
  height: 25px;
  line-height: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subtitle {
  font-size: 18px;
  color: #6b6b6b6b;
  height: 50px;
  line-height: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

@media (min-width: 1280px) {
  .app-card {
    flex-direction: row;

    &__thumb {
      height: 160px;
      max-height: 160px;
      width: 160px;
      max-width: 160px;
    }

    &__body {
      max-width: 200px;
      max-height: 160px;
      padding: 40px 10px;
    }
  }
}

@media (max-width: 1280px) {
  .app-card {
    flex-direction: column;

    &__body {
      padding: 10px;
    }
  }
}
</style>
