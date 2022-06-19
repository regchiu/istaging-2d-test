import type { AxiosInstance } from 'axios'
import type { InjectionKey } from 'vue'

const httpKey = Symbol() as InjectionKey<AxiosInstance>

export { httpKey }
