<template>
    <div class="graduation-design-page">
        <div class="header">
            <!-- <el-icon :name="folder"></el-icon> -->
            <h1 class="title">
                <!-- 点击标题切换为输入框 -->
                <template v-if="!isEditingTitle">
                    <img src="@/assets/icon/book-solid.svg" alt="" />
                    <span @click="startEditingTitle">{{ knowledgeBaseName }}</span>
                </template>
                <template v-else>
                    <img src="@/assets/icon/book-solid.svg" alt="" />
                    <el-input
                        v-model="editedTitle"
                        :autofocus="true"
                        @blur="saveTitle"
                        @keyup.enter="saveTitle"
                    />
                </template>
            </h1>
        </div>
        <!-- 知识库简介 -->
        <div class="introduction">
            <!-- 点击简介切换为输入框 -->
            <template v-if="!isEditingRemark">
                <p @click="startEditingRemark">
                    {{ knowledgeBaseInfo?.remark || '暂无简介' }}
                </p>
            </template>
            <template v-else>
                <el-input
                    ref="remarkInputRef"
                    v-model="editedRemark"
                    type="textarea"
                    @blur="saveRemark"
                />
            </template>
        </div>
        <!-- 加载提示 -->
        <div v-if="loading" class="loading">正在加载知识库数据...</div>
        <div v-else class="content">
            <el-tree
                :data="treeData"
                :props="defaultProps"
                node-key="id"
                @node-click="props.handleNodeClick"
            >
                <template #default="{ node, data }">
                    <span class="custom-tree-node">
                        <!-- <el-icon :is="node.expanded? 'el-icon-minus' : 'el-icon-plus'"></el-icon> -->
                        <span class="node-label">{{ data.name }}</span>
                        <span v-if="data.date" class="date">{{ data.date }}</span>
                    </span>
                </template>
            </el-tree>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, inject, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElTree, ElInput } from 'element-plus'
import useDocumentTree from '@/hooks/useDocumentTree'

const props = defineProps({
    handleNodeClick: {
        type: Function,
        required: true,
    },
})

const route = useRoute()
// 使用 computed 确保响应式
const knowledgeBaseInfo = inject('knowledgeBaseInfo')
const updateKnowledgeBaseInfo = inject('updateKnowledgeBaseInfo')

// 创建计算属性避免直接解构 null
const knowledgeBaseId = computed(() => knowledgeBaseInfo.value?.id)
const knowledgeBaseName = computed(() => knowledgeBaseInfo.value?.name || '加载中...')
const spaceType = computed(() => knowledgeBaseInfo.value?.spaceType)

const treeData = inject('treeData')
const defaultProps = inject('defaultProps')
const loadFolders = inject('loadFolders')
const loading = inject('loading')

const remarkInputRef = ref(null)
// 控制编辑状态的响应式变量
const isEditingTitle = ref(false)
const isEditingRemark = ref(false)
const editedTitle = ref('')
const editedRemark = ref('')

// 开始编辑标题
const startEditingTitle = () => {
    isEditingTitle.value = true
    editedTitle.value = knowledgeBaseName.value
}

// 保存标题
const saveTitle = async () => {
    if (editedTitle.value === '') {
        ElMessage.error('知识库名称不能为空')
        return
    }
    if (editedTitle.value !== knowledgeBaseName.value) {
        updateKnowledgeBaseInfo({ name: editedTitle.value })
    }
    isEditingTitle.value = false
}

// 开始编辑简介
const startEditingRemark = () => {
    isEditingRemark.value = true
    editedRemark.value = knowledgeBaseInfo.value?.remark || ''
    // 确保输入框获取焦点
    nextTick(() => {
        remarkInputRef.value?.focus()
    })
}

// 保存简介
const saveRemark = async () => {
    if (editedRemark.value !== knowledgeBaseInfo.value?.remark) {
        updateKnowledgeBaseInfo({ remark: editedRemark.value })
    }
    isEditingRemark.value = false
}

// 封装加载数据的函数，可添加重试机制
const fetchKnowledgeBaseData = async (id) => {
    try {
        // 这里可以更新 treeData
        await loadFolders()
    } catch (error) {
        console.error('加载知识库数据失败:', error)
        // 可以添加重试逻辑
    }
}

// 在组件挂载时加载知识库数据
onMounted(async () => {
    await fetchKnowledgeBaseData(knowledgeBaseId.value)
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
    overflow-y: scroll;
    .header {
        margin-bottom: 20px;
        .title {
            font-size: 24px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 30px;
            span {
                padding: 3px;
                border-radius: 5px;
                cursor: pointer;
                &:hover {
                    color: #3c7280;
                    background-color: rgba(140, 193, 220, 0.5);
                    border: 1px solid #3c7280;
                }
            }
        }
    }
    .introduction {
        margin-bottom: 20px;
        p {
            padding: 3px;
            font-size: 16px;
            line-height: 1.6;
            color: #666;
            margin: 0;
            border-radius: 5px;
            cursor: pointer;
            &:hover {
                color: #3c7280;
                background-color: rgba(140, 193, 220, 0.5);
                border: 1px solid #3c7280;
            }
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
