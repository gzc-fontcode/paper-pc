<template>
    <div class="sidebar">
        <!-- 侧边栏内容 -->
        <h2 class="title">
            <img src="@/assets/icon/book-solid.svg" alt="" />
            <span>{{ knowledgeBaseName }}</span>
        </h2>
        <!-- 分割线 -->
        <div class="split"></div>
        <!-- 目录 -->
        <div
            class="catalogue"
            @click="
                () => {
                    router.push({
                        path: `/knowledge-base/${knowledgeBaseInfo?.spaceType}/${knowledgeBaseId}`,
                    })
                }
            "
        >
            <div class="label">
                <el-icon><Tickets /></el-icon>
                <span>目录</span>
            </div>
            <TreeAction type="folder" />
        </div>
        <el-tree
            ref="treeRef"
            :data="treeData"
            :props="defaultProps"
            node-key="id"
            :default-expanded-keys="expandedKeys"
            :auto-expand-parent="false"
            :highlight-current="true"
            @node-click="handleNodeClick"
            @node-expand="handleExpand"
            @node-collapse="handleCollapse"
        >
            <template #default="{ node, data }">
                <div :class="`custom-tree-node`" @dblclick="startEditing(data)">
                    <div v-if="!isEditing[data.id]" class="node-label">
                        <i class="iconfont icon-folder-open-fill" v-if="data.type === 'folder'"></i>
                        <i class="iconfont icon-file-list-3-fill" style="color: #1296db" v-else></i>
                        {{ data.name }}
                    </div>
                    <el-input
                        v-else
                        v-model="tempName"
                        @keyup.enter="saveRename(data)"
                        @blur="saveRename(data)"
                        ref="inputRef"
                        autofocus
                    />
                    <TreeAction :data="data" :type="data.type" />
                </div>
            </template>
        </el-tree>
    </div>
</template>

<script setup>
import { ref, watch, inject, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElTree, ElMessage, ElInput } from 'element-plus'
import TreeAction from '@/views/KnowledgeBase/components/TreeAction.vue'
import { renameFolder } from '@/api/folder'

// 使用 computed 确保响应式
const knowledgeBaseInfo = inject('knowledgeBaseInfo')

// 创建计算属性避免直接解构 null
const knowledgeBaseId = computed(() => knowledgeBaseInfo.value?.id)
const knowledgeBaseName = computed(() => knowledgeBaseInfo.value?.name || '加载中...')
// const spaceType = computed(() => knowledgeBaseInfo.value?.spaceType)

const treeData = inject('treeData')
const defaultProps = inject('defaultProps')
const expandedKeys = inject('expandedKeys')
const treeRef = inject('treeRef')

defineProps({
    handleNodeClick: {
        type: Function,
        required: true,
    },
})

const router = useRouter()

// 重命名相关状态
const isEditing = ref({})
const tempName = ref('')
const inputRef = ref(null)

const handleExpand = (node) => {
    if (!expandedKeys.value.includes(node.id)) {
        expandedKeys.value.push(node.id)
        sessionStorage.setItem('expandedKeys', JSON.stringify(expandedKeys.value))
    }
}

const handleCollapse = (node) => {
    expandedKeys.value = expandedKeys.value.filter((key) => key !== node.id)
    sessionStorage.setItem('expandedKeys', JSON.stringify(expandedKeys.value))
}

// 开始编辑
const startEditing = (data) => {
    isEditing.value[data.id] = true
    tempName.value = data.name
    nextTick(() => {
        inputRef.value.focus()
    })
}

// 保存重命名
const saveRename = async (data) => {
    if (tempName.value.trim() === '') {
        ElMessage.warning('文件夹名称不能为空')
        return
    }
    try {
        const response = await renameFolder({
            id: data.id,
            name: tempName.value,
        })
        data.name = tempName.value
        isEditing.value[data.id] = false
        ElMessage.success('重命名成功')
    } catch (error) {
        ElMessage.error('重命名失败')
        isEditing.value[data.id] = false
    }
}

// 在组件挂载时加载数据
onMounted(() => {
    // loadFolders();
    // 恢复展开状态
    if(sessionStorage.getItem('expandedKeys')) {
        expandedKeys.value = JSON.parse(sessionStorage.getItem('expandedKeys'))
    }
})
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
            display: flex;
        }
    }
}
.sidebar {
    width: 240px;
    background-color: #ffffff;
    padding: 10px;
    // margin-right: 20px;
    .title {
        display: flex;
        align-items: center;
        margin: 0 0 17px;
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
    .split {
        width: calc(100% + 20px);
        height: 1px;
        background-color: #d9d9d9;
        margin: 10px 0;
        transform: translateX(-10px);
    }
    :deep(.catalogue) {
        @include hoverable-item;
        justify-content: space-between;
        .action {
            display: none;
        }
    }
    :deep(.el-tree) {
        .el-tree-node__content {
            @include hoverable-item;
            .custom-tree-node {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .el-input {
                    height: 24px;
                }
            }
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
