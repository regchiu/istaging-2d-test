<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'

const props = defineProps<{
  title: string
  author: string
  publicationDate: Date | string | null
  isbn: string
  description: string
  titleError?: string | null
  authorError?: string | null
  publicationDateError?: string | null
  isbnError?: string | null
  descriptionError?: string | null
  submitLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:title', title: string): void
  (e: 'update:author', author: string): void
  (e: 'update:publicationDate', publicationDate: string): void
  (e: 'update:isbn', isbn: string): void
  (e: 'update:description', description: string): void
  (e: 'submit'): void
}>()

const formRef: Ref<HTMLFormElement | null> = ref(null)

const computedPublicationDate = computed(() => {
  if (props.publicationDate) {
    const d = new Date(props.publicationDate)
    const years = d.getFullYear()
    const months = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
    const dates = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()

    return `${years}-${months}-${dates}`
  } else {
    return props.publicationDate
  }
})

function onSubmit(e: Event) {
  if (formRef.value?.reportValidity()) {
    emit('submit')
  }
  e.preventDefault()
}
</script>

<template>
  <form ref="formRef" class="book-form" @submit="onSubmit">
    <div class="book-form__field">
      <label for="title">Name *</label>
      <div class="input-wrapper">
        <input
          name="title"
          type="text"
          :value="props.title"
          @input="emit('update:title', ($event.target as HTMLInputElement).value)"
        />
        <span class="error">
          {{ props.titleError }}
        </span>
      </div>
    </div>
    <div class="book-form__field">
      <label for="author">Author *</label>
      <div class="input-wrapper">
        <input
          name="author"
          type="text"
          :value="props.author"
          @input="emit('update:author', ($event.target as HTMLInputElement).value)"
        />
        <span class="error">
          {{ props.authorError }}
        </span>
      </div>
    </div>
    <div class="book-form__field">
      <label for="publicationDate">Pub date *</label>
      <div class="input-wrapper">
        <input
          name="publicationDate"
          type="date"
          required
          :value="computedPublicationDate"
          @input="emit('update:publicationDate', ($event.target as HTMLInputElement).value)"
        />
        <span class="error">
          {{ props.publicationDateError }}
        </span>
      </div>
    </div>
    <div class="book-form__field">
      <label for="isbn">ISBN</label>
      <div class="input-wrapper">
        <input
          name="isbn"
          type="text"
          :value="props.isbn"
          @input="emit('update:isbn', ($event.target as HTMLInputElement).value)"
        />
        <span class="error">
          {{ props.isbnError }}
        </span>
      </div>
    </div>
    <div class="book-form__field">
      <label for="description">Description *</label>
      <div class="input-wrapper">
        <textarea
          name="description"
          rows="8"
          :value="props.description"
          @input="emit('update:description', ($event.target as HTMLTextAreaElement).value)"
        />
        <span class="error">
          {{ props.descriptionError }}
        </span>
      </div>
    </div>
    <AppButton
      class="book-form__submit-button"
      type="submit"
      label="Save"
      :disabled="props.submitLoading"
      :loading="props.submitLoading"
    >
    </AppButton>
  </form>
</template>

<style lang="scss" scoped>
.book-form {
  display: flex;
  flex-direction: column;

  &__field {
    margin-top: 10px;
    display: flex;

    label {
      flex: 1;
    }

    .input-wrapper {
      flex: 2;
      * {
        width: 100%;
      }
    }
  }

  &__submit-button {
    margin-top: 10px;
    padding: 10px 15px;
  }
}

.error {
  font-size: 12px;
  color: red;
}

@media (min-width: 1280px) {
  .book-form__field {
    flex-direction: row;
  }
}

@media (max-width: 1280px) {
  .book-form__field {
    flex-direction: column;
  }
}
</style>
