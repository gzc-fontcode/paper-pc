<template>
    <el-dialog v-model="createFlowDialogVisible" title="新建流程">
        <el-form :model="createFlowForm" :rules="rules" ref="formRef">
            <el-form-item label="流程名" prop="processName">
                <el-input placeholder="请输入流程名" v-model="createFlowForm.processName" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input
                    type="textarea"
                    placeholder="请输入备注"
                    v-model="createFlowForm.remark"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="createFlowDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const teamId = route.params.teamId
const adminList = inject('adminList')

const props = defineProps({
    handleFlowClick: {
        type: Function,
        required: false,
    },
})

// 通过 inject 获取父组件提供的数据和方法
const createFlowForm = inject('createFlowForm')
const createFlow = inject('createFlow')
const loadFlow = inject('loadFlow')
const loadNodeList = inject('loadNodeList')
const nodeList = inject('nodeList')

const createFlowDialogVisible = ref(false)
const formRef = ref()

const rules = {
    processName: [{ required: true, message: '请输入流程名', trigger: 'blur' }],
    remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
}

const handleSubmit = async () => {
    if (!formRef.value) return
    try {
        await formRef.value.validate()
        createFlowDialogVisible.value = false
        await loadFlow()
        await loadNodeList()
        if (props.handleFlowClick) props.handleFlowClick()
    } catch (error) {
        console.error('表单校验失败:', error)
    }
}

const openCreateFlowDialog = () => {
    createFlowDialogVisible.value = true
}

// 暴露 openCreateFlowDialog 方法给父组件使用
defineExpose({
    openCreateFlowDialog,
})
</script>

<style lang="scss" scoped>
/* 可按需添加样式 */
</style>
