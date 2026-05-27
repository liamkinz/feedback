// src/composables/useToast.ts
import { ref } from 'vue'

export type ToastColor = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  show: boolean
  message: string
  color: ToastColor
  timeout: number
}

export function useToast() {
  return { toast, showToast, success, error, warning, info }
}

const toast = ref<Toast>({
  show: false,
  message: '',
  color: 'info',
  timeout: 4000,
})

function showToast(message: string, color: ToastColor = 'info', timeout: number = 4000) {
  toast.value = { show: true, message, color, timeout }
}

const success = (msg: string) => showToast(msg, 'success')
const error = (msg: string) => showToast(msg, 'error', 4000)
const warning = (msg: string) => showToast(msg, 'warning', 4000)
const info = (msg: string) => showToast(msg, 'info', 4000)
