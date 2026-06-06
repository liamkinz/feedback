/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import toast from './toast'
import pinia from '../stores'

// Types
import type { App } from 'vue'

export function registerPlugins(app: App) {
  app.use(vuetify).use(pinia)

  toast(app)
}
