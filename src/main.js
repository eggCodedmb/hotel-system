import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import router from './router'
import '@/assets/base.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 全局pinia状态管理
import setupStore from '@/store'

const app = createApp(App)

app.use(setupStore)
app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')

