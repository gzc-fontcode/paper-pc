import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
import Login from '@/views/Login.vue'
import Layout from '@/layout/Layout.vue'
import PersonalPaper from '@/views/PersonalPaper.vue'
import TeamPaper from '@/views/TeamPaper.vue'
import NotFound from '@/views/NotFound.vue'
import KnowledgeBase from '@/views/KnowledgeBase/KnowledgeBase.vue'
import KnowledgeBaseContent from '@/views/KnowledgeBase/views/KnowledgeBaseContent.vue'

const routes = [
    {
        path: '/',
        redirect: '/login', // 默认重定向到登录页面
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        // meta: { guest: true }, // 标记为访客页面
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Layout,
        // meta: { requiresAuth: true }, // 标记为需要认证
        children: [
            {
                path: '',
                name: 'Personal',
                component: PersonalPaper,
            },
            {
                path: '/team',
                name: 'Team',
                component: TeamPaper,
            },
            {
                path: '/favorites',
                name: 'Favorites',
                component: TeamPaper,
            },
        ],
    },
    // 添加动态路由
    {
        path: '/knowledge-base/:id',
        name: 'KnowledgeBase',
        component: KnowledgeBase,
        children: [
            {
                path: '', // 默认子路由
                name: 'KnowledgeBaseContent',
                component: KnowledgeBaseContent,
            },
            // 可以在这里添加更多子路由
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound, // 404 页面
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// 路由守卫：检查是否需要登录
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token') // 假设通过 `token` 判断登录状态

    //   if (to.meta.requiresAuth && !isAuthenticated) {
    //     // 如果未登录，跳转到登录页面
    //     next({ name: "Login" });
    //   } else if (to.meta.guest && isAuthenticated) {
    //     // 如果已登录但访问访客页面，跳转到系统页面
    //     next({ name: "Dashboard" });
    //   } else {
    //     next(); // 正常跳转
    //   }
    next()
})

export default router
