<template>
    <div class="action">
        <!-- 更多按钮 -->
        <el-popover
            placement="bottom"
            trigger="click"
            popper-class="custom-popover"
            :show-arrow="false"
        >
            <el-button type="danger" @click.stop="showDeleteDialog(null)" class="popover-btn delete"
                ><el-icon><Delete /></el-icon>删除</el-button
            >
            <template #reference>
                <el-button type="" class="action-btn more" @click.stop="">
                    <el-icon><MoreFilled /></el-icon>
                </el-button>
            </template>
        </el-popover>
        <!-- 新增按钮 -->
        <el-button type="" class="action-btn add" @click="addChildDocument(data)">
            <el-icon><Plus /></el-icon>
        </el-button>
    </div>
    <!-- 删除确认对话框 -->
    <el-dialog class="confirm-delete" v-model="dialogVisible" title="确认删除" :before-close="handleClose">
        <span v-if="currentNode">确定要删除 {{ currentNode.label }} 吗？</span>
        <span v-else>确定要删除当前知识库吗？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmDelete">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElButton, ElPopover, ElMessage, ElDialog } from 'element-plus'

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['delete', 'add'])

const dialogVisible = ref(false)
const currentNode = ref(null)

const confirmDelete = () => {
    emit('delete', currentNode.value)
    dialogVisible.value = false
}

const handleClose = (done) => {
    dialogVisible.value = false
    done()
}

const showDeleteDialog = (node) => {
    currentNode.value = node
    dialogVisible.value = true
}

const addChildDocument = (parentNode) => {
    emit('add', parentNode)
}
</script>

<style scoped>
.action {
    display: flex;
    align-items: center;
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
}
</style>
