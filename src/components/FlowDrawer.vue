<template>
    <el-drawer v-model="flowDrawer" direction="rtl" class="flow-drawer">
        <template #header>
            <h4>{{ drawerTypeData.title }}</h4>
        </template>
        <template #default>
            <el-timeline style="max-width: 600px" v-if="nodeList.length">
                <el-timeline-item
                    center
                    placement="top"
                    v-for="(node, i) in nodeList"
                    :key="node.id"
                    :color="getTimelineColor(node)"
                >
                    <el-card>
                        <div class="content">
                            <div>
                                <h4>{{ node.title }}</h4>
                                <span>审批： {{ node.approver.userName }}</span>
                            </div>
                            <el-button type="info" link @click="handleShowNodeDetail(node)"
                                >详情</el-button
                            >
                            <el-button
                                v-if="drawerType !== 2"
                                type="danger"
                                @click="handleDeleteNode(node.id)"
                                link
                                >删除</el-button
                            >
                        </div>
                    </el-card>
                    <div class="add-node">
                        <div>
                            <el-button
                                class="add-btn"
                                @click="handleOpenNodeDialog(node.id)"
                                circle
                            >
                                <i class="iconfont icon-add-plus"></i>
                            </el-button>
                        </div>
                    </div>
                </el-timeline-item>
            </el-timeline>
            <div class="empty" v-else>
                <span>暂无流程节点，点击</span>
                <el-button type="primary" @click="handleOpenNodeDialog('')" link>新增</el-button>
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
import { ref, inject, computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
    nodeDialogRef: {
        type: Object,
        required: true,
    },
})

// 获取个人用户id
const userId = localStorage.getItem('userId')

const route = useRoute()
const teamId = route.params.teamId
// const { nodeList, deleteNode, createFlow, getTemplateListData } = useWorkflow(teamId)
const nodeList = inject('nodeList')
const deleteNode = inject('deleteNode')
const createFlow = inject('createFlow')
const getTemplateListData = inject('getTemplateListData')
const agreeProcess = inject('agreeProcess')

const flowDrawer = ref(false)
const drawerType = ref(0) // 0: 新增流程模板 1: 流程模板 2: 流程
const drawerTypeData = computed(() => {
    if (drawerType.value === 0) {
        return {
            title: '新增流程模板',
        }
    } else if (drawerType.value === 1) {
        return {
            title: '流程模板',
        }
    } else if (drawerType.value === 2) {
        return {
            title: '流程',
        }
    } else {
        return ''
    }
})

// 根据节点状态配置时间线颜色
const getTimelineColor = (node) => {
    if (node.statue === 'agree') {
        return '#37bf6a'
    } else if (node.statue === 'reject') {
        return '#f94a61' 
    } else if(node.statue ==='ongoing'){
        return '#1296db'
    }
}

// 判断是否审核
const isAudit = (node, i) => {
    if (i && nodeList.value[i - 1].statue !== 'finished') return false
    return drawerType.value === 2 && node.approver.id == userId && node.statue === 'ongoing'
}

const handleDeleteNode = async (nodeId) => {
    await deleteNode(nodeId)
    await getTemplateListData()
}

const confirmClick = async () => {
    await createFlow()
    await getTemplateListData()
    flowDrawer.value = false
}

const openFlowDrawer = (data = null) => {
    if (data) {
        nodeList.value = data
    }
    flowDrawer.value = true
}

const handleOpenNodeDialog = (parentProcess = '') => {
    if (props.nodeDialogRef) {
        props.nodeDialogRef.openNodeDialog(parentProcess)
    }
}

const handleShowNodeDetail = (node) => {
    if (props.nodeDialogRef) {
        props.nodeDialogRef.showNodeDetail(node)
    }
}

defineExpose({
    drawerType,
    openFlowDrawer,
    handleOpenNodeDialog,
    handleShowNodeDetail,
})
</script>

<style lang="scss" scoped>
.el-drawer.flow-drawer {
    width: 360px !important;
    .el-timeline {
        .el-timeline-item__content {
            width: 240px;
            .el-card {
                .el-card__body {
                    .content {
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
                    &:hover .add-btn {
                        display: flex;
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
