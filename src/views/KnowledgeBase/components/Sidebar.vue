<template>
    <div class="sidebar">
        <!-- 侧边栏内容 -->
        <h2 class="title">
            <img src="@/assets/icon/book-solid.svg" alt="" />
            <span>知识库{{ knowledgeBaseId }}</span>
        </h2>
        <div class="catalogue">
            <div class="label">
                <el-icon><Tickets /></el-icon>
                <span>目录</span>
            </div>
            <TreeAction @delete="deleteDocument(null)" @add="addDocument" />
        </div>
        <el-tree :data="treeData" :props="defaultProps" node-key="id" :default-expanded-keys="[1]">
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <div class="node-label">{{ data.label }}</div>
                    <TreeAction :data="data" @delete="deleteDocument" @add="addChildDocument" />
                </div>
            </template>
        </el-tree>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElTree, ElMessage } from 'element-plus'
import TreeAction from '@/views/KnowledgeBase/components/TreeAction.vue'

// 获取当前路由的参数
const route = useRoute()
const knowledgeBaseId = ref(route.params.id)

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
                        date: '2024-06-24 12:18',
                    },
                    {
                        id: 5,
                        label: '例题2',
                        date: '2024-06-24 12:18',
                    },
                    {
                        id: 6,
                        label: '例题3',
                        date: '2024-06-24 12:18',
                    },
                ],
            },
            {
                id: 3,
                label: '大纲',
                date: '2024-06-24 15:50',
            },
        ],
        date: '2024-06-23 17:07',
    },
    {
        id: 4,
        label: '计算机网络',
        children: [
            {
                id: 5,
                label: '物理层',
                date: '2023-12-20 21:17',
            },
            {
                id: 6,
                label: '概述',
                date: '2023-12-20 21:17',
            },
        ],
        date: '2023-09-22 20:57',
    },
    {
        id: 7,
        label: '大数据',
        date: '2023-06-20 07:46',
    },
    {
        id: 8,
        label: 'C++',
        date: '2023-05-15 22:10',
    },
    {
        id: 9,
        label: 'JSP',
        date: '2023-04-01 08:52',
    },
    {
        id: 10,
        label: '数据库',
        date: '2023-02-24 07:42',
    },
])

// 定义树节点属性
const defaultProps = {
    children: 'children',
    label: 'label',
}

// 生成唯一 ID 的函数
const generateUniqueId = () => {
    return Date.now() + Math.floor(Math.random() * 1000)
}

// 新增文档的方法
const addDocument = () => {
    const newDocument = {
        id: generateUniqueId(),
        label: '新文档',
        date: new Date().toLocaleString(),
    }
    treeData.value.push(newDocument)
    ElMessage.success('新增文档成功')
}

// 新增子文档的方法
const addChildDocument = (parentNode) => {
    if (!parentNode.children) {
        parentNode.children = []
    }
    const newChild = {
        id: generateUniqueId(),
        label: '新子文档',
        date: new Date().toLocaleString(),
    }
    parentNode.children.push(newChild)
    ElMessage.success('新增子文档成功')
}

// 删除文档的方法
const deleteDocument = (node) => {
    const deleteNode = (data, targetId) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === targetId) {
                data.splice(i, 1)
                return true
            }
            if (data[i].children && data[i].children.length > 0) {
                if (deleteNode(data[i].children, targetId)) {
                    return true
                }
            }
        }
        return false
    }

    if (node) {
        if (deleteNode(treeData.value, node.id)) {
            ElMessage.success('删除文档成功')
        }
    } else {
        // 处理删除顶层目录的逻辑，这里可根据需求完善
        ElMessage.warning('暂不支持删除顶层目录')
    }
}
</script>

<style lang="scss" scoped>
@mixin hoverable-item {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 10px;
    border-radius: 5px;
    color: #262626;
    font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC,
        Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    .action {
        display: none;
    }

    &:hover {
        background-color: #eff0f0;
        .action {
            display: block;
        }
    }
}

.sidebar {
    width: 240px;
    background-color: #ffffff;
    padding: 10px;
    margin-right: 20px;

    .title {
        display: flex;
        align-items: center;
        margin: 0 0 20px;

        img {
            width: 24px;
            height: 24px;
            margin-right: 10px;
        }

        span {
            font-size: 20px;
            font-weight: bold;
        }
    }

    :deep(.catalogue) {
        @include hoverable-item;
        justify-content: space-between;
        .action {
            display: none;
        }
    }

    :deep(.el-tree-node__content) {
        @include hoverable-item;
        .custom-tree-node {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
}
</style>
<style lang="scss">
.custom-popover {
    padding: 0 !important;
    min-width: 80px !important;
    width: auto !important;
    .popover-btn {
        display: block;
        width: 100%;
        padding: 5px 0;
        text-align: center;
        border: none;
        background: none;
        color: #262626;
        font-size: 14px;
        cursor: pointer;
        .el-icon {
            margin-right: 5px;
        }
        &:hover {
            background-color: #eff0f0;
        }
    }
}
</style>
