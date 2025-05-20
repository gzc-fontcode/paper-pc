<template>
    <h1>{{ props.type ? '当前流程' : '流程模板' }}</h1>
    <div class="flow-list">
        <el-card style="max-width: 200px" v-for="template in templateList">
            <div class="content">
                <span>{{ template.processName }}</span>
                <div class="action">
                    <el-button size="mini" link @click="props.handleFlowClick(template)">
                        详情
                    </el-button>
                    <el-button size="mini" type="danger" link @click="handleDeleteFlow(template.processId)">
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
const getTemplateListData = inject('getTemplateListData')
const deleteFlow = inject('deleteFlow')


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
    }
})

// 处理删除流程模板的逻辑
const handleDeleteFlow = async (id: number) => {
    try {
        // 调用删除流程模板的接口
        await deleteFlow(id)
        // 刷新模板列表
        await getTemplateListData()
    } catch (error) {
        console.error('删除流程模板失败:', error)
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
        width: 200px; 
        .content {
            display: flex;
            justify-content: space-between; 
        }
    }
}
</style>
