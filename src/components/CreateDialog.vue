<template>
    <el-dialog class="create-dialog" title="新建知识库" v-model="visible" width="30%" center>
        <el-form :model="form" label-width="0">
            <el-form-item class="name">
                <img src="@/assets/icon/book-solid.svg" alt="" />
                <el-input v-model="form.name" placeholder="知识库名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input
                    v-model="form.description"
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
import { ref, computed } from 'vue'

const visible = ref(false)
const form = ref({
    name: '',
    description: '',
})

const showDialog = () => {
    visible.value = true
}

const confirmCreate = () => {
    console.log('创建知识库:', form.value)
    visible.value = false
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
