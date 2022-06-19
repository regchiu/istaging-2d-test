<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import AppButton from '@/components/AppButton.vue'
import TheContainer from '@/components/TheContainer.vue'
import AppDialog from '@/components/AppDialog.vue'
import BookForm from '@/components/BookForm.vue'
import { inject, onMounted, ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { httpKey } from '@/keys'
import axios from 'axios'

type Form = {
  title: string
  author: string
  publicationDate: Date | string | null
  isbn: string
  description: string
}

type FormError = {
  title: string | null
  author: string | null
  publicationDate: string | null
  isbn: string | null
  description: string | null
}

const initialForm: Form = {
  title: '',
  author: '',
  publicationDate: null,
  isbn: '',
  description: '',
}

const initialFormError: FormError = {
  title: null,
  author: null,
  publicationDate: null,
  isbn: null,
  description: null,
}

const route = useRoute()
const router = useRouter()

const http = inject(httpKey)

const book: Ref<Record<string, never>> = ref({})
const showDialog: Ref<boolean> = ref(false)
const submitLoading: Ref<boolean> = ref(false)
const form: Ref<Form> = ref(buildForm())
const formError: Ref<FormError> = ref(buildFormError())

const publicationDate = computed(() => {
  const d = new Date(book.value.publicationDate)
  const years = d.getFullYear()
  const months = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
  const dates = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
  const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
  const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()

  return `${years}/${months}/${dates} ${hours}:${minutes}`
})

async function retrieveBook() {
  try {
    const response = await http?.get(`/books/${route.params.id}`)
    book.value = response?.data
    form.value = buildForm({
      title: book.value.title,
      author: book.value.author,
      publicationDate: book.value.publicationDate,
      isbn: book.value.isbn,
      description: book.value.description,
    })
  } catch (error) {
    router.push({ name: 'home' })
  }
}

async function editBook() {
  try {
    formError.value = buildFormError()
    submitLoading.value = true
    await http?.patch(
      `/books/${route.params.id}`,
      {
        ...form.value,
        publicationDate: new Date(form.value.publicationDate as string).toISOString(),
      },
      {
        headers: {
          'content-type': 'application/merge-patch+json',
        },
      }
    )
    showDialog.value = false
    await retrieveBook()
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400 || error.response?.status === 422) {
        const violations: any[] = (error.response.data as any).violations
        formError.value = buildFormError({
          title: violations.find((violation) => violation.propertyPath === 'title')?.message,
          author: violations.find((violation) => violation.propertyPath === 'author')?.message,
          publicationDate: violations.find((violation) => violation.propertyPath === 'publicationDate')?.message,
          isbn: violations.find((violation) => violation.propertyPath === 'isbn')?.message,
          description: violations.find((violation) => violation.propertyPath === 'description')?.message,
        })
      } else if (error.response?.status === 404) {
        alert('404 not found')
      }
    }
  } finally {
    submitLoading.value = false
  }
}

function buildForm(payload?: Form) {
  return Object.assign({}, initialForm, payload)
}

function buildFormError(payload?: FormError) {
  return Object.assign({}, initialFormError, payload)
}

watch(showDialog, (showDialog, prevShowDialog) => {
  if (!prevShowDialog && showDialog) {
    form.value = buildForm({
      title: book.value.title,
      author: book.value.author,
      publicationDate: book.value.publicationDate,
      isbn: book.value.isbn,
      description: book.value.description,
    })
    formError.value = buildFormError()
  }
})

onMounted(() => {
  retrieveBook()
})
</script>

<template>
  <TheHeader :title="book.title">
    <template #left>
      <AppButton class="header-button" label="Back" @click="router.push({ name: 'home' })">
        <div class="header-button__label">Back</div>
      </AppButton>
    </template>
    <template #right>
      <AppButton class="header-button" @click="showDialog = true">
        <div class="header-button__label">Edit</div>
      </AppButton>
    </template>
  </TheHeader>
  <TheContainer>
    <div class="book-details">
      <div class="book-details__thumb">
        <img src="https://picsum.photos/800/600" />
      </div>
      <div class="book-details__body">
        <div class="book-name">{{ book.title }}</div>
        <div class="book-author">{{ book.author }}</div>
        <div class="book-published">
          <span>Published on {{ publicationDate }}</span>
        </div>
        <div class="book-description">{{ book.description }}</div>
        <div class="book-isbn">
          <span>ISBN: {{ book.isbn }}</span>
        </div>
      </div>
    </div>
  </TheContainer>
  <Teleport to="body">
    <AppDialog v-if="showDialog" @close="showDialog = false">
      <BookForm
        v-model:title="form.title"
        v-model:author="form.author"
        v-model:publicationDate="form.publicationDate"
        v-model:isbn="form.isbn"
        v-model:description="form.description"
        :title-error="formError.title"
        :author-error="formError.author"
        :publication-date-error="formError.publicationDate"
        :isbn-error="formError.isbn"
        :description-error="formError.description"
        :submit-loading="submitLoading"
        @submit="editBook"
      ></BookForm>
    </AppDialog>
  </Teleport>
</template>

<style lang="scss" scoped>
.header-button {
  padding: 15px;

  &__label {
    font-size: 24px;
  }
}

.book-details {
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
  }
}

.book-name {
  font-size: 24px;
  line-height: 28px;
}

.book-author {
  font-size: 18px;
  line-height: 36px;
  color: #6b6b6b;
}

.book-published {
  font-size: 18px;
  line-height: 36px;
}

.book-description {
  font-size: 16px;
  line-height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  max-width: 280px;
}

.book-isbn {
  font-size: 16px;
  line-height: 32px;
  color: #6b6b6b;
}

.dialog-form {
  display: flex;
  flex-direction: column;
  &__field {
    margin-top: 10px;
    display: flex;

    label {
      flex: 1;
    }

    input,
    textarea {
      flex: 2;
    }
  }

  &__submit-button {
    margin-top: 10px;
    padding: 10px 15px;
  }
}

@media (min-width: 1280px) {
  .book-details {
    flex-direction: row;

    &__thumb {
      height: 160px;
      max-height: 160px;
      width: 160px;
      max-width: 160px;
    }

    &__body {
      padding: 0 20px;
    }
  }
}

@media (max-width: 1280px) {
  .book-details {
    flex-direction: column;
  }
}
</style>
