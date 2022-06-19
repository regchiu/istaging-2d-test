import axios from 'axios'
import { httpKey } from '@/keys'
import type { App } from 'vue'

export default {
  install: (app: App) => {
    app.provide(
      httpKey,
      axios.create({
        baseURL: 'https://cors-anywhere-dot-vr-cam-161603.uc.r.appspot.com/https://demo.api-platform.com',
      })
    )
  },
}
