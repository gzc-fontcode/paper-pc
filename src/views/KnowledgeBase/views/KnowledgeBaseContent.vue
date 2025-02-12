<template>
    <div class="graduation-design-page">
        <div class="header">
            <!-- <el-icon :name="folder"></el-icon> -->
            <h1 class="title">
                <img src="@/assets/icon/book-solid.svg" alt="" />
                <span>知识库{{ knowledgeBaseId }}</span>
            </h1>
            <div class="meta">
                <span><b>1</b> 文档</span>
                <span><b>0</b> 字</span>
            </div>
        </div>
        <!-- 加载提示 -->
        <div v-if="loading" class="loading">正在加载知识库数据...</div>
        <div v-else class="content">
            <el-tree
                :data="treeData"
                :props="defaultProps"
                node-key="id"
                :default-expanded-keys="[1]"
            >
                <template #default="{ node, data }">
                    <span class="custom-tree-node">
                        <!-- <el-icon :is="node.expanded ? 'el-icon-minus' : 'el-icon-plus'"></el-icon> -->
                        <span class="node-label">{{ data.label }}</span>
                        <span v-if="data.date" class="date">{{ data.date }}</span>
                    </span>
                </template>
            </el-tree>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElTree } from 'element-plus'

// 获取当前路由
const route = useRoute()

// 定义一个 ref 来存储知识库 ID
const knowledgeBaseId = ref(route.params.id)

// 定义加载状态
const loading = ref(false)

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

// 封装加载数据的函数，可添加重试机制
const fetchKnowledgeBaseData = async (id) => {
    try {
        // 模拟异步请求
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log(`加载知识库 ID: ${id}`)
        // 这里可以更新 treeData
    } catch (error) {
        console.error('加载知识库数据失败:', error)
        // 可以添加重试逻辑
    }
}

// 在组件挂载时加载知识库数据
onMounted(async () => {
    loading.value = true
    await fetchKnowledgeBaseData(knowledgeBaseId.value)
    loading.value = false
})
</script>

<style lang="scss" scoped>
.graduation-design-page {
    flex: 1;
    margin: 60px 80px 0;
    box-sizing: border-box;
    min-height: calc(100vh - 60px);
    background-color: hsla(0, 0%, 100%, 0.9);
    padding: 20px;
    border-radius: 10px;
}

.header {
    margin-bottom: 20px;
    .title {
        font-size: 24px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 30px;
    }
    .meta {
        display: flex;
        align-items: center;
        gap: 20px;
        font-size: 14px;
        color: #888;
        b {
            font-weight: bold;
            font-size: 20px;
            color: #333;
        }
    }
}

.content {
    .el-tree {
        :deep(.el-tree-node__content) {
            height: 36px;
        }
        .custom-tree-node {
            display: flex;
            width: 100%;
            align-items: center;
            gap: 8px;
            position: relative;
            .el-icon {
                color: #999;
            }
            .node-label {
                flex: 1;
            }
            .date {
                width: 115px;
                color: #999;
                margin-left: 8px;
            }
            &::after {
                content: '';
                position: absolute;
                top: 50%;
                left: calc(10px + 8px + 1em); /* 根据图标和间隔调整起始位置 */
                right: 120px; /* 根据日期宽度调整结束位置 */
                border-top: 1px dashed #ccc;
            }
        }
    }
}

.loading {
    text-align: center;
    padding: 20px;
    color: #888;
}
</style>
