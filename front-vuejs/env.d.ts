/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-the-mask' {
  import { PluginObject } from 'vue'
  const VueTheMask: PluginObject<any>
  export default VueTheMask
}
