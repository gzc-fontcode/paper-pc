<template>
    <el-dialog title="确认删除" v-model="visible" width="30%" center>
        <span>您确定要删除这个知识库吗？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const currentItemToDelete = ref(null)

const showDialog = (item) => {
    currentItemToDelete.value = item
    visible.value = true
}

const confirmDelete = () => {
    console.log(`删除知识库${currentItemToDelete.value}`)
    visible.value = false
}

defineExpose({
    showDialog,
})
</script>

<style scoped>
.dialog-footer {
    display: flex;
    justify-content: center;
    button {
        width: 60px !important;
    }
}
</style>
