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
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { ElTree, ElMessage } from 'element-plus';
import TreeAction from '@/views/KnowledgeBase/components/TreeAction.vue';
const props = defineProps({
    treeData: {
        type: Object,
        required: true
    },
    defaultProps: {
        type: Object,
        required: true
    },
    addDocument: {
        type: Function,
        required: true 
    }
});
const route = useRoute();
const knowledgeBaseId = ref(route.params.id);

// 生成唯一 ID 的函数
const generateUniqueId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
};
// 新增子文档的方法
const addChildDocument = (parentNode) => {
    if (!parentNode.children) {
        parentNode.children = [];
    }
    const newChild = {
        id: generateUniqueId(),
        label: '新子文档',
        date: new Date().toLocaleString()
    };
    parentNode.children.push(newChild);
    ElMessage.success('新增子文档成功');
};
// 删除文档的方法
const deleteDocument = (node) => {
    const deleteNode = (data, targetId) => {
        
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === targetId) {
                data.splice(i, 1);
                return true;
            }
            if (data[i].children && data[i].children.length > 0) {
                if (deleteNode(data[i].children, targetId)) {
                    return true;
                }
            }
        }
        return false;
    };
    if (node) {
        if (deleteNode(props.treeData, node.id)) {
            ElMessage.success('删除文档成功');
        }
    } else {
        // 处理删除顶层目录的逻辑，这里可根据需求完善
        ElMessage.warning('暂不支持删除顶层目录');
    }
};
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
    padding: 0!important;
    min-width: 80px!important;
    width: auto!important;
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