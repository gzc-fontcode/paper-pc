import { createRouter, createWebHistory } from 'vue-router'
// 导入页面组件
import Login from '@/views/Login.vue'
import Layout from '@/layout/Layout.vue'
import TeamLayout from '@/layout/TeamLayout.vue'
import KnowledgeBasePaper from '@/views/KnowledgeBasePaper.vue'
import TeamPaper from '@/views/TeamPaper.vue'
import NotFound from '@/views/NotFound.vue'
import KnowledgeBase from '@/views/KnowledgeBase/KnowledgeBase.vue'
import KnowledgeBaseContent from '@/views/KnowledgeBase/views/KnowledgeBaseContent.vue'
import DocumentPage from '@/views/KnowledgeBase/views/DocumentPage.vue'
// 导入团队页面组件
import TeamKnowledgeBase from '@/views/Team/KnowledgeBase.vue'
import TeamMemberManagement from '@/views/Team/MemberManagement.vue'
import TeamWorkflow from '@/views/Team/Workflow.vue'

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
        meta: { requiresAuth: true }, // 标记为需要认证
        children: [
            {
                path: '',
                name: 'Personal',
                component: KnowledgeBasePaper,
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
    // 知识库路由
    {
        path: '/knowledge-base/:spaceType/:id',
        name: 'KnowledgeBase',
        component: KnowledgeBase,
        children: [
            {
                path: '', // 默认子路由
                name: 'KnowledgeBaseContent',
                component: KnowledgeBaseContent,
            },
            // 新增文档页面路由
            {
                path: 'document/:documentId',
                name: 'DocumentPage',
                component: DocumentPage,
            },
            // 可以在这里添加更多子路由
        ],
    },
    // 团队路由
    {
        path: '/team/:teamId',
        name: 'TeamSpace',
        component: TeamLayout,
        children: [
            {
                path: '', // 默认子路由
                redirect: { name: 'TeamKnowledgeBase' },
            },
            {
                path: 'knowledge-base',
                name: 'TeamKnowledgeBase',
                component: KnowledgeBasePaper,
            },
            {
                path: 'member-management',
                name: 'TeamMemberManagement',
                component: TeamMemberManagement,
            },
            {
                path: 'workflow',
                name: 'TeamWorkflow',
                component: TeamWorkflow,
            },
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

// 添加全局前置守卫
router.beforeEach((to, from) => {
      const token = localStorage.getItem('token');
      // 新增：如果已登录且访问登录页，重定向到仪表盘
      if (to.path === '/login' && token) {
        return '/dashboard';
      }
      // 原有认证检查
      if (to.meta.requiresAuth && !token) {
        return {
          path: '/login',
          query: { redirect: to.fullPath },
        };
      }
})

export default router
