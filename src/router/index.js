import { createWebHistory, createRouter } from 'vue-router'
import Layout from '@/layout/Layout.vue'

const routes = [
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: '/home',
                name: 'Home',
                component: () => import('@/views/Home.vue'),
                meta: { title: '首页', icon: 'HomeFilled' }
            },
            {
                path: '/user',
                name: 'User',
                component: () => import('@/views/User.vue'),
                meta: { title: '员工管理', icon: 'UserFilled' }
            },
            {
                path: '/room',
                name: 'Room',
                component: () => import('@/views/Room.vue'),
                meta: { title: '客房管理', icon: 'House' }
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        meta: { title: '登录', hidden: true }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router