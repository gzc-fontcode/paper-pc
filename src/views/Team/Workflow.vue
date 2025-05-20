<template>
    <div class="main-body">
        <el-container>
            <!--  -->
            <el-header>
                <el-button plain>发起流程</el-button>
                <el-button plain @click="openCreateFlowDialog">创建流程</el-button>
            </el-header>
            <el-main>
                <!-- 当前流程 -->
                <FlowList :type="1" />
                <!-- 流程模板 -->
                <FlowList :type="0" :handleFlowClick="handleFlowClick"/>
            </el-main>
        </el-container>
    </div>
    <!-- 对话框收集新建的流程名和备注 -->
    <el-dialog v-model="createFlowDialogVisible" title="新建流程">
        <!-- 应用校验规则 -->
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
    <!-- 节点对话框 -->
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
                    <!-- <el-option label="John Doe" value="1" /> -->
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
    <el-drawer v-model="flowDrawer" direction="rtl" class="flow-drawer">
        <template #header>
            <h4>{{drawerType ? '流程模板' : '新增流程模板'}}</h4>
        </template>
        <template #default>
            <!-- 表单收集流程名和备注 -->
            <el-timeline style="max-width: 600px" v-if="nodeList.length">
                <el-timeline-item center placement="top" v-for="node in nodeList">
                    <el-card>
                        <div>
                            <h4>{{ node.title }}</h4>
                            <span>审批： {{ node.approver.userName }}</span>
                        </div>
                        <el-button type="info" link @click="handleNodeClick(node)">详情</el-button>
                        <el-button type="danger" @click="handleDeleteNode(node.id)" link
                            >删除</el-button
                        >
                    </el-card>
                    <div class="add-node">
                        <div>
                            <el-button class="add-btn" @click="handleAddNodeClick(node.id)" circle>
                                <i class="iconfont icon-add-plus"></i>
                            </el-button>
                        </div>
                    </div>
                </el-timeline-item>
            </el-timeline>
            <div class="empty" v-else>
                <span>暂无流程节点，点击</span>
                <el-button type="primary" @click="handleAddNodeClick('')" link>新增</el-button>
            </div>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button type="primary" @click="confirmClick">确认</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script lang="ts" setup>
import { ref, inject, provide } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import FlowList from '@/components/FlowList.vue'
import { useWorkflow } from '@/hooks/useWorkflow'
const route = useRoute()
const teamId = route.params.teamId

const adminList = inject('adminList')

const {
    templateList,
    nodeList,
    nodeForm,
    createFlowForm,
    getTemplateListData,
    createFlow,
    createNode,
    deleteNode,
    loadNodeList,
    loadFlow,
    deleteFlow,
} = useWorkflow(teamId)

provide('templateList', templateList)
provide('getTemplateListData', getTemplateListData)
provide('deleteFlow', deleteFlow)

const createFlowDialogVisible = ref(false)
const nodeDialogVisible = ref(false)

const nodeRules = {
    title: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
    remark: [{ required: true, message: '请输入节点描述', trigger: 'blur' }],
    approver: [{ required: true, message: '请选择审批人', trigger: 'blur' }],
}

const handleAddNodeClick = (parentProcess) => {
    nodeForm.value = {
        title: '',
        remark: '',
        approver: '',
        parentProcess: String(parentProcess),
    }
    nodeDialogVisible.value = true
}
const handleNodeSubmit = async () => {
    if (!formRef.value) return
    try {
        // 执行表单校验
        await formRef.value.validate()
        await createNode()
        await loadNodeList()
        nodeDialogVisible.value = false
    } catch (error) {
        console.error('表单校验失败:', error)
    }
}

// 删除节点
const handleDeleteNode = async (nodeId) => {
    await deleteNode(nodeId)
    await loadNodeList()
}
// 定义表单引用
const formRef = ref()
// 定义校验规则
const rules = {
    processName: [{ required: true, message: '请输入流程名', trigger: 'blur' }],
    remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
}

const handleSubmit = async () => {
    if (!formRef.value) return
    try {
        // 执行表单校验
        await formRef.value.validate()
        createFlowDialogVisible.value = false
        await loadFlow()
        await loadNodeList()
        // 打开抽屉
        flowDrawer.value = true
    } catch (error) {
        console.error('表单校验失败:', error)
    }
}

const flowDrawer = ref(false)
const drawerType = ref(0) // 0: 创建流程 1: 查看流程
const confirmClick = async () => {
    await createFlow()
    await getTemplateListData()
    // 关闭抽屉
    flowDrawer.value = false
}
const openCreateFlowDialog = () => {
    createFlowDialogVisible.value = true
}

// 查看流程模板详情
const handleFlowClick = (data) => {
    nodeList.value = data.detailProcessDTOList
    drawerType.value = 1
    flowDrawer.value = true
}

// 查看节点详情
const handleNodeClick = (node) => {
    nodeForm.value = {
        ...node
    }
    nodeDialogVisible.value = true
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

<style lang="scss">
.el-drawer.flow-drawer {
    width: 360px !important;
    .el-timeline {
        .el-timeline-item__content {
            width: 240px;
            .el-card {
                .el-card__body {
                    display: flex;
                    padding: 0 10px;
                    > div {
                        flex-grow: 1;
                        > h4 {
                            margin: 10px 0 0;
                            font-size: 18px;
                        }
                        > span {
                            font-size: 10px;
                            color: rgb(107, 107, 106);
                        }
                    }
                }
            }
            .add-node {
                width: 100%;
                height: 0;
                > div {
                    width: 100%;
                    height: 32px;
                    .add-btn {
                        display: none;
                        transform: translate(calc(120px - 50%), calc(16px - 50%));
                        width: 20px;
                        height: 20px;
                    }
                    // 父元素hover时显示
                    &:hover {
                        .add-btn {
                            display: flex;
                        }
                    }
                }
            }
        }
    }
    .empty {
        font-size: 14px;
        color: rgb(107, 107, 106);
    }
}
</style>
