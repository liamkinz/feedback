import { ref } from 'vue'

// Module-scope singleton state — one shared confirm dialog for the whole app.
const isOpen = ref(false)
const title = ref('Please Confirm')
const message = ref('')
const confirmText = ref('Confirm')
const cancelText = ref('Cancel')
let resolver: ((value: boolean) => void) | null = null

export function useConfirmDialog() {
  function confirmDialog(
    msg: string,
    opts?: { title?: string; confirmText?: string; cancelText?: string },
  ): Promise<boolean> {
    // One dialog, one resolver. If a second confirmation is requested while
    // one is still open, settle the first as "cancelled" — replacing the
    // resolver outright would leave its caller awaiting a promise that can
    // never resolve.
    resolver?.(false)
    resolver = null

    message.value = msg
    title.value = opts?.title ?? 'Please Confirm'
    confirmText.value = opts?.confirmText ?? 'Confirm'
    cancelText.value = opts?.cancelText ?? 'Cancel'
    isOpen.value = true
    return new Promise((resolve) => {
      resolver = resolve
    })
  }

  function resolve(value: boolean) {
    isOpen.value = false
    resolver?.(value)
    resolver = null
  }

  return { isOpen, title, message, confirmText, cancelText, confirmDialog, resolve }
}
