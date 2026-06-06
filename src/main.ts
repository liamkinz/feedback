import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vuetify } from './plugins/vuetify'
import { useAuthStore } from '@/stores/authStore'

import App from './App.vue'
import router from './router/router'
import { registerSW } from 'virtual:pwa-register' // auto-provided by vite-plugin-pwa
import { registerPlugins } from '@/plugins'

import 'vue-toastification/dist/index.css'
// Register service worker
const updateSW = registerSW({
  onNeedRefresh() {
    // New version available — optionally prompt user to update
    if (confirm('New version available. Update now?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('✅ App is ready to work offline!')
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
registerPlugins(app)
const authStore = useAuthStore()
await authStore.restoreSession()

app.mount('#app')
