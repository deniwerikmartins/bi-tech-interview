import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

// Silence expected Vue warnings during tests
// (v-mask directive not registered in test environment — this is intentional)
const originalWarn = console.error.bind(console)
console.error = (...args: any[]) => {
  const msg = args[0]
  if (
    typeof msg === 'string' &&
    (msg.includes('Failed to resolve directive: mask') ||
      msg.includes('could not overwrite property'))
  ) {
    return
  }
  originalWarn(...args)
}
