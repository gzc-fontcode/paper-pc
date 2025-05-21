<template>
    <el-dialog v-model="nodeDialogVisible" title="节点配置">
        <el-form :model="nodeForm" :rules="nodeRules" ref="nodeFormRef">
            <el-form-item label="节点名称" prop="title">
                <el-input placeholder="请输入节点名称" v-model="nodeForm.title" />
            </el-form-item>
            <el-form-item label="节点描述" prop="remark">
                <el-input type="textarea" placeholder="请输入节点描述" v-model="nodeForm.remark" />
            </el-form-item>
            <el-form-item label="审批人" prop="approver">
                <el-select v-model="nodeForm.approver" placeholder="请选择审批人">
                    <el-option
                        v-for="admin in adminList"
                        :key="admin.id"
                        :label="admin.userName"
                        :value="admin.id"
                    />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="nodeDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleNodeSubmit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkflow } from '@/hooks/useWorkflow'

const route = useRoute()
const teamId = route.params.teamId
// const { nodeForm, createNode, loadNodeList } = useWorkflow(teamId)
const adminList = inject('adminList')
const nodeForm = inject('nodeForm')
const createNode = inject('createNode')
const loadNodeList = inject('loadNodeList')

const nodeDialogVisible = ref(false)
const nodeFormRef = ref()

const nodeRules = {
    title: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
    remark: [{ required: true, message: '请输入节点描述', trigger: 'blur' }],
    approver: [{ required: true, message: '请选择审批人', trigger: 'blur' }],
}

const handleNodeSubmit = async () => {
    if (!nodeFormRef.value) return
    try {
        await nodeFormRef.value.validate()
        await createNode()
        await loadNodeList()
        nodeDialogVisible.value = false
    } catch (error) {
        console.error('表单校验失败:', error)
    }
}

const openNodeDialog = (parentProcess = '') => {
    nodeForm.value = {
        title: '',
        remark: '',
        approver: '',
        parentProcess: String(parentProcess),
    }
    nodeDialogVisible.value = true
}

const showNodeDetail = (node) => {
    nodeForm.value = { ...node }
    nodeDialogVisible.value = true
}

// Expose functions for external use
defineExpose({
    openNodeDialog,
    showNodeDetail
})
</script>

<style lang="scss" scoped>
/* Add styles as needed */
</style>
