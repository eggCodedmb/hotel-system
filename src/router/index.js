import { createWebHistory, createRouter } from 'vue-router';
import Layout from '@/layout/Layout.vue';

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
        meta: { title: '首页', icon: 'HomeFilled', public: false }
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('@/views/User.vue'),
        meta: { title: '员工管理', icon: 'UserFilled', isAdmin: true, public: false }
      },
      {
        path: '/leave',
        name: 'Leave',
        component: () => import('@/views/Leave.vue'),
        meta: { title: '请假审批', icon: 'Document', isAdmin: true, public: false }
      },
      {
        path: '/room',
        // meta: { title: '客房管理', icon: 'House' },
        name: 'Room',
        component: () => import('@/views/Room.vue'),
        meta: { title: '客房列表', icon: 'House', public: false }
        // children: [
        //   {
        //     path: '/roomList',
        //     name: 'RoomList',
        //     component: () => import('@/views/Room.vue'),
        //     meta: { title: '客房列表', icon: 'Document', public: false }
        //   },
        //   {
        //     path: '/roomType',
        //     name: 'RoomType',
        //     meta: { title: '房型管理', icon: 'Document', public: false },
        //     component: () => import('@/views/RoomType.vue')
        //   }
        // ]
      },
      {
        path: '/checkin',
        name: 'Checkin',
        component: () => import('@/views/Checkin.vue'),
        meta: { title: '预约管理', icon: 'Calendar', public: false }
      },
      {
        path: '/system',
        meta: { title: '系统管理', icon: 'Setting', hidden: true, public: false },
        children: [
          {
            path: '/department',
            name: 'Department',
            component: () => import('@/views/Department.vue'),
            meta: { title: '部门管理', icon: 'Document', hidden: true, public: false }
          }
        ]
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
        meta: { title: '个人中心', icon: 'User', hidden: true, public: false }
      },
      {
        path: '/notice',
        name: 'Notice',
        component: () => import('@/views/Notice.vue'),
        meta: { title: '公告管理', icon: 'Document', hidden: false, public: false }
      },
      {
        path: '/dict',
        name: 'Dict',
        component: () => import('@/views/Dict.vue'),
        meta: { title: '数据字典', icon: 'Key', hidden: false, isAdmin: true, public: false }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', hidden: true, public: true }
  },
  // 前台页面
  {
    path: '/front',
    name: 'FrontDesk',
    component: () => import('@/views/FrontDesk.vue'),
    meta: { title: '前台', icon: 'Home', hidden: false, public: true }
  },
  //   404页面
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404', hidden: true, public: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


// Token过期检查
router.beforeEach((to, from, next) => {
  const isPublicRoute = to.matched.some(record => record.meta.public)
  const token = localStorage.getItem('token')

  // 公开路由直接放行
  if (isPublicRoute) return next()

  // Token存在性检查
  if (!token) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  next()
})

export default router;
