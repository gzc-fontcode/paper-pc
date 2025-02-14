<template>
    <div class="root">
        <!-- 侧边栏 -->
        <Sidebar :knowledgeBaseId="knowledgeBaseId" :treeData="treeData" :defaultProps="defaultProps" :addDocument="addDocument" :handleNodeClick="handleNodeClick"/>
        <!-- 路由视图 -->
        <router-view :treeData="treeData" :defaultProps="defaultProps" :handleNodeClick="handleNodeClick"/>
    </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

const route = useRoute();
const router = useRouter();
const knowledgeBaseId = ref(route.params.id);

// 定义树结构数据
const treeData = ref([
    {
        id: 1,
        label: '会计学',
        children: [
            {
                id: 2,
                label: '例题',
                date: '2024-06-24 12:18',
                children: [
                    {
                        id: 4,
                        label: '例题1',
                        date: '2024-06-24 12:18'
                    },
                    {
                        id: 5,
                        label: '例题2',
                        date: '2024-06-24 12:18'
                    },
                    {
                        id: 6,
                        label: '例题3',
                        date: '2024-06-24 12:18'
                    }
                ]
            },
            {
                id: 3,
                label: '大纲',
                date: '2024-06-24 15:50'
            }
        ],
        date: '2024-06-23 17:07'
    },
    {
        id: 4,
        label: '计算机网络',
        children: [
            {
                id: 5,
                label: '物理层',
                date: '2023-12-20 21:17'
            },
            {
                id: 6,
                label: '概述',
                date: '2023-12-20 21:17'
            }
        ],
        date: '2023-09-22 20:57'
    },
    {
        id: 7,
        label: '大数据',
        date: '2023-06-20 07:46'
    },
    {
        id: 8,
        label: 'C++',
        date: '2023-05-15 22:10'
    },
    {
        id: 9,
        label: 'JSP',
        date: '2023-04-01 08:52'
    },
    {
        id: 10,
        label: '数据库',
        date: '2023-02-24 07:42'
    }
]);

// 定义树节点属性
const defaultProps = {
    children: 'children',
    label: 'label'
};

// 生成唯一 ID 的函数
const generateUniqueId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
};
// 新增文档的方法
const addDocument = () => {
    const newDocument = {
        id: generateUniqueId(),
        label: '新文档',
        date: new Date().toLocaleString()
    };
    treeData.value.push(newDocument);
    ElMessage.success('新增文档成功');
};

// 处理树节点点击事件
const handleNodeClick = (data) => {
    router.push({
        name: 'DocumentPage',
        params: {
            id: knowledgeBaseId.value,
            documentId: data.id,
        },
    })
}

</script>

<style lang="scss" scoped>
.root {
    display: flex;
    height: 100vh;
    width: 100%;
}
</style>