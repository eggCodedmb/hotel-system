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
                meta: { title: '员工管理', icon: 'UserFilled' },
                children: [
                    // 新增员工
                    {
                        path: '/adduser',
                        name: 'AddUser',
                        component: () => import('@/views/components/UserForm.vue'),
                        meta: { title: '新增员工', icon: 'UserFilled', hidden: true }
                    },
                    // 编辑员工
                    {
                        path: '/edituser',
                        name: 'EditUser',
                        component: () => import('@/views/components/UserForm.vue'),
                        meta: { title: '新增员工', icon: 'UserFilled', hidden: true }
                    }
                ]
            },
            {
                path: '/room',
                name: 'Room',
                component: () => import('@/views/Room.vue'),
                meta: { title: '客房管理', icon: 'House' }
            },
            {
                path: '/finance',
                name: 'Finance',
                component: () => import('@/views/Finance.vue'),
                meta: { title: '财务管理', icon: 'Wallet' }
            },
            {
                path: '/checkin',
                name: 'Checkin',
                component: () => import('@/views/Checkin.vue'),
                meta: { title: '住宿管理', icon: 'Document' },
                children: [
                    {
                        path: '/reserve',
                        name: 'Reserve',
                        component: () => import('@/views/Reserve.vue'),
                        meta: { title: '客房预订', icon: 'Document' }
                    }
                ]
            },
            {
                path: '/dict',
                name: 'Dict',
                component: () => import('@/views/Dict.vue'),
                meta: { title: '字典', icon: 'List' }
            },
            {
                path: '/system',
                name: 'System',
                component: () => import('@/views/System.vue'),
                meta: { title: '系统管理', icon: 'Setting' },
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