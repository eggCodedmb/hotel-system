import { getDict } from '@/hooks/useDict'


export default {
    install(app) {
        // 挂载多个 Hooks到全局
        app.config.globalProperties.$getDict = getDict
    }
}