<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import TheContainer from '@/components/TheContainer.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppDialog from '@/components/AppDialog.vue'
import BookForm from '@/components/BookForm.vue'
import { inject, onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Ref } from 'vue'
import { httpKey } from '@/keys'
import axios from 'axios'
import { vScroll } from '@/directives/vScroll'

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

const router = useRouter()

const http = inject(httpKey)

const books: Ref<any[]> = ref([])
const showDialog: Ref<boolean> = ref(false)
const retrieveBooksLoading: Ref<boolean> = ref(false)
const loadMoreLoading: Ref<boolean> = ref(false)
const submitLoading: Ref<boolean> = ref(false)
const form: Ref<Form> = ref(buildForm())
const formError: Ref<FormError> = ref(buildFormError())
const currentPage: Ref<number> = ref(1)
const itemsPerPage: Ref<number> = ref(30)
const totalItems: Ref<number> = ref(0)

const hasMore = computed(() => books.value.length < totalItems.value)

async function retrieveBooks() {
  try {
    if (currentPage.value === 1) {
      retrieveBooksLoading.value = true
    } else {
      loadMoreLoading.value = true
    }
    const response = await http?.get('/books', {
      params: {
        page: currentPage.value,
        itemsPerPage: itemsPerPage.value,
        'order[publicationDate]': 'desc',
      },
    })
    totalItems.value = response?.data['hydra:totalItems']
    books.value = books.value.concat(response?.data['hydra:member'])
  } catch (error) {
    console.error(error)
  } finally {
    if (currentPage.value === 1) {
      retrieveBooksLoading.value = false
    } else {
      loadMoreLoading.value = false
    }
  }
}

async function createBook() {
  try {
    formError.value = buildFormError()
    submitLoading.value = true
    await http?.post('/books', {
      ...form.value,
      publicationDate: new Date(form.value.publicationDate as string).toISOString(),
    })
    showDialog.value = false
    await retrieveBooks()
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
      }
    }
  } finally {
    submitLoading.value = false
  }
}

async function loadMore() {
  currentPage.value += 1
  await retrieveBooks()
}

function buildForm(payload?: Form) {
  return Object.assign({}, initialForm, payload)
}

function buildFormError(payload?: FormError) {
  return Object.assign({}, initialFormError, payload)
}

function onScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement

  if (!loadMoreLoading.value && scrollTop + clientHeight >= scrollHeight - 50 && hasMore.value) {
    loadMore()
  }
}

watch(showDialog, (showDialog, prevShowDialog) => {
  if (!prevShowDialog && showDialog) {
    form.value = buildForm()
    formError.value = buildFormError()
  }
})

watch(
  () => form.value.title,
  (title, prevTitle) => {
    if (title !== prevTitle) {
      formError.value.title = null
    }
  }
)

watch(
  () => form.value.author,
  (author, prevAuthor) => {
    if (author !== prevAuthor) {
      formError.value.author = null
    }
  }
)

watch(
  () => form.value.publicationDate,
  (publicationDate, prevPublicationDate) => {
    if (publicationDate !== prevPublicationDate) {
      formError.value.publicationDate = null
    }
  }
)

watch(
  () => form.value.isbn,
  (isbn, prevIsbn) => {
    if (isbn !== prevIsbn) {
      formError.value.isbn = null
    }
  }
)

watch(
  () => form.value.description,
  (description, prevDescription) => {
    if (description !== prevDescription) {
      formError.value.description = null
    }
  }
)

onMounted(() => {
  retrieveBooks()
})
</script>

<template>
  <TheHeader title="The book shelf">
    <template #right>
      <AppButton class="header-button" @click="showDialog = true">
        <div class="header-button__label">Create</div>
      </AppButton>
    </template>
  </TheHeader>
  <TheContainer v-scroll="onScroll">
    <div v-if="retrieveBooksLoading" class="loading-mask">
      <h2>Loading...</h2>
    </div>
    <div v-else class="books-wrapper">
      <AppCard
        v-for="item in books"
        class="books-wrapper__items"
        :key="item.id"
        :title="item.title"
        :subtitle="item.author"
        @click="
          router.push({
            name: 'book-details',
            params: {
              id: item.id,
            },
          })
        "
      ></AppCard>
      <div v-if="loadMoreLoading" class="loading-mask">
        <h2>Load More Loading...</h2>
      </div>
      <div v-if="hasMore" class="load-more-wrapper">
        <AppButton class="load-more-button" @click="loadMore">
          <div class="load-more-button__label">Load More</div>
        </AppButton>
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
        @submit="createBook"
      ></BookForm>
    </AppDialog>
  </Teleport>
</template>

<style lang="scss" scoped>
.loading-mask,
.load-more-wrapper {
  height: 50px;
  width: 100%;
  text-align: center;
}

.books-wrapper {
  display: flex;
  flex-wrap: wrap;
  &__items {
    cursor: pointer;
    margin: 20px;
  }
}

.header-button {
  padding: 15px;

  &__label {
    font-size: 24px;
  }
}

.load-more-button {
  padding: 15px;
  margin: 0 auto;

  &__label {
    font-size: 18px;
  }
}

@media (min-width: 1280px) {
  .books-wrapper__items {
    flex: 1 0 calc(33.3% - 40px);
    max-width: calc(33.3% - 40px);
  }
}

@media (max-width: 1280px) {
  .books-wrapper__items {
    flex: 1 0 calc(50% - 40px);
    max-width: calc(50% - 40px);
  }
}
</style>
