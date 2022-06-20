import type { DirectiveBinding } from 'vue'

export const vScroll = {
  mounted: (el: HTMLElement, binding: DirectiveBinding) => {
    const handler =
      typeof binding.value === 'function' || 'handleEvent' in binding.value ? binding.value : binding.value.handler
    window.addEventListener('scroll', handler)
  },
  unmounted(el: HTMLElement, binding: DirectiveBinding) {
    const handler =
      typeof binding.value === 'function' || 'handleEvent' in binding.value ? binding.value : binding.value.handler
    window.removeEventListener('scroll', handler)
  },
}
