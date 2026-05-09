import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vuetify } from './plugins/vuetify'

import App from './App.vue'
import router from './router/router'
import { registerSW } from 'virtual:pwa-register' // auto-provided by vite-plugin-pwa

// Icons from Vuetify
// import '@mdi/font/css/materialdesignicons.css'

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

app.mount('#app')
