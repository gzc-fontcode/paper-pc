<template>
    <h1>{{ props.type ? '当前流程' : '流程模板' }}</h1>
    <div class="flow-list">
        <el-card style="max-width: 200px" v-if="!props.type" v-for="template in templateList">
            <div class="content">
                <span>{{ template.processName }}</span>
                <div class="action">
                    <el-button size="mini" link @click="props.handleFlowClick(template)">
                        详情
                    </el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        link
                        @click="handleDeleteFlow(template.processId)"
                    >
                        删除
                    </el-button>
                </div>
            </div>
        </el-card>
        <el-card style="max-width: 300px" v-else v-for="process in processList">
            <div class="content">
                <span>{{ process.title }}</span>
                <div class="action">
                    <el-button size="mini" link @click="props.handleFlowClick(process)">
                        详情
                    </el-button>
                    <template v-if="process.createBy != userId">
                        <el-button type="success" @click="handleAgreeProcess(process.id)" link
                            >同意</el-button
                        >
                        <el-button type="danger" @click="handleRejectProcess(process.id)" link>驳回</el-button>
                    </template>
                    <el-button size="mini" type="danger" link @click="handleDeleteFlow(process)">
                        删除
                    </el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted } from 'vue'

const templateList = inject('templateList')
const processList = inject('processList')
const getTemplateListData = inject('getTemplateListData')
const getProcessListData = inject('getProcessListData')
const deleteFlow = inject('deleteFlow')
const deleteProcess = inject('deleteProcess')
const agreeProcess = inject('agreeProcess')
const rejectProcess = inject('rejectProcess')

const userId = localStorage.getItem('userId')

// 接收父组件传递的参数
const props = defineProps({
    type: {
        // 0: 流程模板 1: 当前流程
        type: Number,
        required: true,
    },
    handleFlowClick: {
        type: Function,
        required: false,
    },
})

// 处理删除流程模板的逻辑
const handleDeleteFlow = async (process) => {
    if (props.type === 0) {
        try {
            // 调用删除流程模板的接口
            await deleteFlow(process)
            // 刷新模板列表
            await getTemplateListData()
        } catch (error) {
            console.error('删除流程模板失败:', error)
        }
    } else if (props.type === 1) {
        console.log('删除')
        try {
            // 调用删除流程模板的接口
            await deleteProcess(process)
            await getProcessListData()
        } catch (error) {
            console.error('删除流程模板失败:', error)
        }
    }
}

// 同意流程
const handleAgreeProcess = async (processId) => {
    try {
        // 调用同意流程的接口
        await agreeProcess(processId)
        getProcessListData()
    } catch (error) {
        console.error('同意流程失败:', error)
    }
}

// 驳回流程
const handleRejectProcess = async (processId) => {
    try {
        // 调用驳回流程的接口
        await rejectProcess(processId)
        getProcessListData()
    } catch (error) {
        console.error('驳回流程失败:', error)
    }
}

onMounted(async () => {
    if (props.type === 0) {
        await getTemplateListData()
    }
})
</script>

<style lang="scss" scoped>
.flow-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    .el-card {
        width: 300px;
        .content {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
