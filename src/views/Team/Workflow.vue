<template>
    <div class="main-body">
        <el-container>
            <el-header>
                <!-- 绑定发起流程点击事件 -->
                <el-button plain @click="openLaunchFlowDialog">发起流程</el-button>
                <el-button plain @click="handleOpenCreateFlowDialog">创建流程</el-button>
            </el-header>
            <el-main>
                <FlowList :type="1" :handleFlowClick="handleFlowClick" />
                <FlowList :type="0" :handleFlowClick="handleFlowClick" />
            </el-main>
        </el-container>
        <CreateFlowDialog ref="createFlowDialogRef" :handleFlowClick="handleFlowClick" />
        <NodeDialog ref="nodeDialogRef" />
        <FlowDrawer ref="flowDrawerRef" :nodeDialogRef="nodeDialogRef" />
        <!-- 发起流程对话框 -->
        <el-dialog v-model="launchFlowDialogVisible" title="发起流程">
            <el-form :model="launchFlowForm" ref="launchFlowFormRef">
                <el-form-item label="选择流程模板" prop="templateId">
                    <el-select v-model="launchFlowForm.templateId" placeholder="请选择流程模板">
                        <el-option
                            v-for="template in templateList"
                            :key="template.processId"
                            :label="template.processName"
                            :value="template.processId"
                        />
                    </el-select>
                </el-form-item>
                <!-- title -->
                <el-form-item label="流程标题" prop="title">
                    <el-input v-model="launchFlowForm.title" placeholder="请输入流程标题" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="launchFlowDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleLaunchFlow">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, provide } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkflow } from '@/hooks/useWorkflow'
import { ElMessage } from 'element-plus'
import FlowList from '@/components/FlowList.vue'
import CreateFlowDialog from '@/components/CreateFlowDialog.vue'
import NodeDialog from '@/components/NodeDialog.vue'
import FlowDrawer from '@/components/FlowDrawer.vue'

const route = useRoute()
const teamId = route.params.teamId
// 在父组件中调用 useWorkflow
const {
    nodeList,
    nodeForm,
    createFlowForm,
    templateList,
    processList,
    deleteNode,
    createNode,
    createFlow,
    loadFlow,
    loadNodeList,
    getTemplateListData,
    deleteFlow,
    initiateProcess,
    getProcessListData,
    deleteProcess,
    getProcessNodeList,
    agreeProcess,
    rejectProcess,
} = useWorkflow(teamId)

// 提供数据和方法给子组件
provide('createFlowForm', createFlowForm)
provide('templateList', templateList)
provide('nodeList', nodeList)
provide('nodeForm', nodeForm)
provide('processList', processList)
provide('deleteNode', deleteNode)
provide('createNode', createNode)
provide('createFlow', createFlow)
provide('loadFlow', loadFlow)
provide('loadNodeList', loadNodeList)
provide('getTemplateListData', getTemplateListData)
provide('deleteFlow', deleteFlow)
provide('getProcessListData', getProcessListData)
provide('deleteProcess', deleteProcess)
provide('getProcessNodeList', getProcessNodeList)
provide('agreeProcess', agreeProcess)
provide('rejectProcess', rejectProcess)

const createFlowDialogRef = ref()
const nodeDialogRef = ref()
const flowDrawerRef = ref()

// 发起流程对话框相关变量
const launchFlowDialogVisible = ref(false)
const launchFlowForm = ref({
    templateId: '',
    title: '',
})
const launchFlowFormRef = ref()

const handleFlowClick = async (data) => {
    let nodeList = null
    if (data) {
        if (data.detailProcessDTOList) {
            nodeList = data.detailProcessDTOList
            flowDrawerRef.value.drawerType = 1
        } else {
            await getProcessNodeList(data.id)
            flowDrawerRef.value.drawerType = 2
        }
    }else {
        flowDrawerRef.value.drawerType = 0
    }
    if (flowDrawerRef.value) {
        flowDrawerRef.value.openFlowDrawer(nodeList)
    }
}

const handleOpenCreateFlowDialog = () => {
    if (createFlowDialogRef.value) {
        createFlowDialogRef.value.openCreateFlowDialog()
    }
}

// 打开发起流程对话框
const openLaunchFlowDialog = () => {
    launchFlowDialogVisible.value = true
    launchFlowForm.value.templateId = ''
}

// 处理发起流程确认操作
const handleLaunchFlow = async () => {
    if (!launchFlowFormRef.value) return
    try {
        await launchFlowFormRef.value.validate()
        const res = await initiateProcess(launchFlowForm.value)
        getProcessListData()
        ElMessage.success('流程发起成功')
        launchFlowDialogVisible.value = false
    } catch (error) {
        console.error('流程发起失败:', error)
        ElMessage.error('流程发起失败')
    }
}
</script>

<style lang="scss" scoped>
.main-body {
    padding: 20px;
    .el-header {
        > .el-button {
            margin-bottom: 20px;
            margin-right: 10px;
            float: right;
        }
    }
}
</style>
