<template>
    <el-dialog class="create-dialog" title="新建知识库" v-model="visible" width="30%" center>
        <el-form :model="form" label-width="0">
            <el-form-item class="name">
                <img src="@/assets/icon/book-solid.svg" alt="" />
                <el-input v-model="form.name" placeholder="知识库名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input
                    v-model="form.remark"
                    type="textarea"
                    placeholder="知识库简介（选填）"
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

// // 定义组件的props
// const props = defineProps({
//     fetchKnowledgeBaseList: {
//         type: Function,
//         required: true,
//     },
// })

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
