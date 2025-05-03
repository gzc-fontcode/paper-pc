<template>
    <el-dialog class="create-dialog" :title="dialogType.title" v-model="visible" width="30%" center>
        <el-form :model="form" label-width="0">
            <el-form-item class="name">
                <!-- 无需处理 @ 符号 -->
                <img :src="dialogType.imgUrl" alt="" /> 
                <el-input v-model="form.name" :placeholder="dialogType.namePlaceholder"></el-input>
            </el-form-item>
            <el-form-item v-if="dialogType.remarkPlaceholder">
                <el-input
                    v-model="form.remark"
                    type="textarea"
                    :placeholder="dialogType.remarkPlaceholder"
                ></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button class="create-button" type="primary" :disabled="isCreateButtonDisabled" @click="confirmCreate"
                >新 建</el-button
            >
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, defineProps, inject } from 'vue'
import { createKnowledgeBase } from '@/api/storage'
import { ElMessage } from 'element-plus'
// 导入图片
import bookIcon from '@/assets/icon/book-solid.svg'
import teamIcon from '@/assets/icon/team-fill.svg'

// 定义组件的props
const props = defineProps({
    type: {
        type: String,
        default: 'private', // 默认值为'private'
    }
})

// 根据type设置是创建知识库还是团队
const dialogType = computed(() => {
    if (props.type === 'private') {
        return {
            title: '新建知识库',
            imgUrl: bookIcon, // 使用导入的图片
            namePlaceholder: '知识库名称',
            remarkPlaceholder: '知识库简介（选填）'
        }
    } else if (props.type === 'public') {
        return {
            title: '新建团队',
            imgUrl: teamIcon,
            namePlaceholder: '团队名称'
        }
    }
})

// 注入知识库数据
const loadKnowledgeBases = inject('loadKnowledgeBases')

const visible = ref(false)
const form = ref({
    name: '',
    remark: '', // 简介
    spaceType: 'private', // 知识库类型，默认为私有
})

const showDialog = () => {
    visible.value = true
}

const confirmCreate = async () => {
    console.log('创建知识库:', form.value)
    try {
        await createKnowledgeBase({...form.value})
        visible.value = false
        form.value = {
            name: '',
            remark: '',
            spaceType: 'private',
        }
        ElMessage.success('知识库创建成功')
        // 调用父组件的方法刷新知识库列表
        // props.fetchKnowledgeBaseList()
        loadKnowledgeBases()
    } catch (error) {
        ElMessage.error('创建知识库失败')
        console.error('创建知识库失败:', error)
    }
}

const isCreateButtonDisabled = computed(() => {
    return form.value.name === ''
})

// 确保 showDialog 方法被暴露出来
defineExpose({
    showDialog,
})
</script>

<style lang="scss" scoped>
.create-dialog {
    .el-form {
        .el-form-item.name {
            :deep(.el-form-item__content) {
                display: flex;
                flex-wrap: nowrap !important;
                img {
                    // width: 1.5em;
                    // height: 1.5em;
                    margin-right: 5px;
                }
            }
        }
        :deep(.el-textarea) {
            .el-textarea__inner {
                min-height: 100px !important;
            }
        }
    }
}
</style>
<style lang="scss">
.el-dialog__footer:has(.create-button) {
    padding-top: 10px;
    .el-button.el-button--primary {
        width: 100%;
    }
}
</style>
