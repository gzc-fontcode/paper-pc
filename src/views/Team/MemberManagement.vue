<template>
    <div class="main-body">
        <el-container>
            <!--  -->
            <el-header>
                <!-- 邀请成员按钮 -->
                <el-button type="primary" @click="openInviteDialog">邀请成员</el-button>
            </el-header>
            <el-main>
                <el-table :data="members" style="width: 100%">
                    <el-table-column prop="userName" label="用户名" />
                    <el-table-column prop="role" label="角色">
                        <template #default="scope">
                            <span v-if="scope.row.role === 'admin'">管理员</span>
                            <span v-else>普通成员</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button
                                v-if="scope.row.role !== 'admin'"
                                type="primary"
                                link
                                size="small"
                                @click="assignRole(scope.row)"
                                >升为管理员</el-button
                            >
                            <el-button
                                type="danger"
                                link
                                size="small"
                                @click="removeMember(scope.row)"
                                >移除</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
        </el-container>

        <!-- 邀请成员对话框 -->
        <el-dialog v-model="inviteDialogVisible" title="邀请成员">
            <el-form :model="inviteForm" label-width="80px">
                <el-form-item label="用户id">
                    <el-input v-model="inviteForm.userId" />
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="inviteForm.role">
                        <el-option label="管理员" value="admin" />
                        <el-option label="普通成员" value="member" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="inviteDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="inviteMember">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// 模拟成员数据
const members = ref([
    { id: 1, userName: '张三', role: 'admin' },
    { id: 2, userName: '李四', role: 'member' },
])

// 邀请对话框相关状态
const inviteDialogVisible = ref(false)
const inviteForm = ref({
    userId: '',
    role: 'member',
})

// 打开邀请对话框
const openInviteDialog = () => {
    inviteDialogVisible.value = true
}

// 邀请成员
const inviteMember = () => {
    // // 这里可以添加实际的邀请逻辑
    // members.value.push({
    //   id: members.value.length + 1,
    //   name: inviteForm.value.userId.split('@')[0],
    //   role: inviteForm.value.role,
    // });
    inviteDialogVisible.value = false
    inviteForm.value = { userId: '', role: 'member' }
}

// 修改成员角色
const assignRole = (member) => {
    // 这里可以添加实际的更新角色逻辑
    console.log(`更新 ${member.userName} 的角色为 管理员`)
}

// 移除成员
const removeMember = (member) => {
    const index = members.value.findIndex((item) => item.id === member.id)
    if (index !== -1) {
        members.value.splice(index, 1)
    }
}
</script>

<style lang="scss" scoped>
.main-body {
    padding: 20px;
    > .el-button {
        margin-bottom: 20px;
        float: right;
    }
}
</style>
