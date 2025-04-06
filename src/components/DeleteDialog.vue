<template>
    <el-dialog title="确认删除" v-model="visible" width="30%" center>
        <span>您确定要删除这个知识库吗？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, inject } from 'vue'
import { ElMessage } from 'element-plus'
import { deleteKnowledgeBase } from '@/api/storage'

const loadKnowledgeBases = inject('loadKnowledgeBases')

const visible = ref(false)
const currentItemToDelete = ref(null)

const showDialog = (item) => {
    currentItemToDelete.value = item
    visible.value = true
}

const confirmDelete = async () => {
    console.log(`删除知识库${currentItemToDelete.value}`)
    try {
        await deleteKnowledgeBase(currentItemToDelete.value)
        ElMessage.success('知识库删除成功')
        if (loadKnowledgeBases) {
            loadKnowledgeBases()
        }
    } catch (error) {
        console.error('删除知识库失败', error)
        ElMessage.error('删除知识库失败')
    }
    visible.value = false
}

defineExpose({
    showDialog,
})
</script>

<style scoped>
.dialog-footer {
    display: flex;
    justify-content: center;
    button {
        width: 60px !important;
    }
}
</style>
