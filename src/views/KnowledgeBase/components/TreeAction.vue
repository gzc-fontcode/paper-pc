<template>
    <div class="action">
        <!-- 更多按钮 -->
        <el-popover
            placement="bottom"
            trigger="click"
            popper-class="custom-popover"
            :show-arrow="false"
        >
            <el-button
                type="danger"
                @click.stop="showDeleteDialog(props.data)"
                class="popover-btn delete"
            >
                <el-icon><Delete /></el-icon>删除
            </el-button>
            <template #reference>
                <el-button type="" class="action-btn more" @click.stop="">
                    <el-icon><MoreFilled /></el-icon>
                </el-button>
            </template>
        </el-popover>
        <!-- 新增按钮 -->
        <el-popover
            placement="bottom"
            trigger="click"
            popper-class="custom-popover"
            :show-arrow="false"
            v-if="props.type === 'folder'"
        >
            <el-button
                type="primary"
                @click.stop="handleAddNode(props.data, 'folder')"
                class="popover-btn"
            >
                新建文件夹
            </el-button>
            <el-button
                type="danger"
                @click.stop="handleAddNode(props.data, 'document')"
                class="popover-btn"
            >
                新建文档
            </el-button>
            <template #reference>
                <el-button type="" class="action-btn add" @click.stop="">
                    <el-icon><Plus /></el-icon>
                </el-button>
            </template>
        </el-popover>
    </div>
    <!-- 删除确认对话框 -->
    <teleport to="body">
        <el-dialog
            class="confirm-delete"
            v-model="dialogVisible"
            title="确认删除？"
            :before-close="handleClose"
        >
            <span v-if="currentNode">您确定要删除<b>{{ currentNode.name }}</b>吗？</span>
            <span v-else>您确定要删除当前知识库吗？</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="confirmDelete">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </teleport>
</template>

<script setup>
import { ref, inject } from 'vue'
import { ElButton, ElPopover, ElMessage, ElDialog } from 'element-plus'

const props = defineProps({
    data: {
        type: Object,
        required: false,
    },
    type: {
        type: String,
        required: true,
    },
})

const addFolder = inject('addFolder')
const deleteFolder = inject('deleteFolder')
const addDocument = inject('addDocument')
const deleteDocument = inject('deleteDocument')

const dialogVisible = ref(false)
const currentNode = ref(null)

const confirmDelete = () => {
    if (!currentNode.value) {
        // 删除知识库
        console.log('删除知识库')
    } else if (currentNode.value.type === 'folder') {
        // 删除文件夹
        deleteFolder(currentNode.value)
    } else if (currentNode.value.type === 'file') {
        // 删除文档
        deleteDocument(currentNode.value)
    }
    dialogVisible.value = false
}

const handleClose = (done) => {
    dialogVisible.value = false
    done()
}

const showDeleteDialog = (data) => {
    currentNode.value = data
    dialogVisible.value = true
}

const handleAddNode = (parentNode, nodeType) => {
    const { type } = parentNode ? parentNode : { type: 'folder' }
    // 父节点是文件夹才可添加子节点
    if (type === 'folder') {
        if (nodeType === 'folder') {
            // 添加文件夹
            addFolder(parentNode)
        } else if (nodeType === 'document') {
            // 添加文档
            addDocument(parentNode)
        }
    }
}
</script>

<style scoped>
.action {
    width: 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.action-btn {
    border: none;
    padding: 0;
    background: none;
    font-size: 15px;
    &:hover {
        color: #15c447;
    }
}

.action-btn.more {
    transform: rotate(90deg);
}

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
<style lang="scss">
.confirm-delete {
    max-width: 360px !important;
    .el-dialog__footer {
        button {
            width: 50px;
            height: 28px;
        }
        button + button {
            margin-left: 10px;
        }
    }
}
</style>
