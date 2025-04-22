<template>
    <div class="root">
        <!-- 侧边栏 -->
        <Sidebar
            :treeData="treeData"
            :defaultProps="defaultProps"
            :addDocument="addDocument"
            :handleNodeClick="handleNodeClick"
        />
        <!-- 路由视图 -->
        <router-view
            :treeData="treeData"
            :defaultProps="defaultProps"
            :handleNodeClick="handleNodeClick"
        />
    </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ref, provide, onMounted } from 'vue'
import useKnowledgeBaseInfo from '@/hooks/useKnowledgeBaseInfo'
import useDocumentTree from '@/hooks/useDocumentTree'

const route = useRoute()
const router = useRouter()
const knowledgeBaseId = ref(route.params.id)
const spaceType = ref(route.params.spaceType)

// 自定义 Hook 用于获取知识库信息
const { knowledgeBaseInfo } = useKnowledgeBaseInfo(spaceType.value, knowledgeBaseId.value)

// 使用文档树Hook
const {
    treeData,
    defaultProps,
    loading,
    addDocument,
    deleteDocument,
    loadFolders,
    addFolder,
    deleteFolder,
} = useDocumentTree(knowledgeBaseId.value)

// 处理节点点击事件（保持组件内）
const handleNodeClick = (data) => {
    // 只有当节点类型是文件时，才跳转到文档页面
    if (data.type === 'file') {
        router.push({
            name: 'DocumentPage',
            params: {
                id: knowledgeBaseId.value,
                documentId: data.id,
            },
        })
    }
}

// 初始化加载数据
onMounted(() => {
    loadFolders()
})

provide('knowledgeBaseInfo', knowledgeBaseInfo)
provide('spaceType', spaceType)
provide('knowledgeBaseId', knowledgeBaseId)
provide('addDocument', addDocument)
provide('deleteDocument', deleteDocument)
provide('treeData', treeData)
provide('loading', loading)
provide('defaultProps', defaultProps)
provide('loadFolders', loadFolders)
provide('addFolder', addFolder)
provide('deleteFolder', deleteFolder)
</script>

<style lang="scss" scoped>
.root {
    display: flex;
    height: 100vh;
    width: 100%;
}
</style>
