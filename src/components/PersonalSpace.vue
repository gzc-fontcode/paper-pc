<template>
    <div class="personal-space">
        <div class="user-details">
            <div>
                <img src="@/assets/pic/logo-app.png" alt="用户头像" class="" />
                <div>
                    <h2>{{ user.username }}</h2>
                    <span>知识库：</span>
                    <span>文章：</span>
                </div>
            </div>
            <p v-if="!isEditing.signature" @click="editUserInfo('signature')" class="signature">
                {{ user.signature }}
            </p>
            <el-input
                v-else
                ref="signatureInput"
                @blur="saveUserInfo('signature')"
                class="signature"
                v-model="editedUser.signature"
                style="width: 240px"
                :rows="2"
                type="textarea"
                autosize
                :input-style="{
                    width: '100%',
                }"
                placeholder="Please input"
            />
        </div>
        <img class="anime-bg" src="@\assets\pic\anime-morgan-bg.png" alt="" />
    </div>
    <div class="personal-space user-info">
        <el-form label-position="left" label-width="auto" :model="editedUser" ref="form">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="editedUser.username" :disabled="!isEditing.username" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editedUser.email" :disabled="!isEditing.info" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input
                    v-model="editedUser.password"
                    :disabled="!isEditing.info"
                    type="password"
                />
            </el-form-item>
        </el-form>
        <img class="anime-bg" src="@\assets\pic\anime-caster-bg.png" alt="" />
    </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import {
    ElAvatar,
    ElButton,
    ElCard,
    ElCol,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElRow,
} from 'element-plus'

// 假设用户信息从某个地方获取，这里使用一个简单的对象来模拟
const user = ref({
    username: '张三',
    avatar: '@/assets/pic/logo-app.png',
    signature:
        '我是一个热爱编程的开发者我是一个热爱编程的开发者我是一个热爱编程的开发者我是一个热爱编程的开发者我是一个热爱编程的开发者我是一个热爱编程的开发者我是一个热爱编程的开发者',
    email: 'zhangsan@example.com',
    password: '123456',
})

// 用于编辑的用户信息副本
const editedUser = ref({ ...user.value })

// 是否正在编辑的状态
const isEditing = ref({
    username: false,
    signature: false,
    info: false,
})
const signatureInput = ref(null)

// 切换编辑状态
const editUserInfo = (name) => {
    isEditing.value[name] = true

    // 如果是签名，自动聚焦输入框
    if (name === 'signature') {
        // 延迟执行，确保输入框已经渲染完成
        nextTick(() => {
            signatureInput.value.focus()
        })
    }
}

// 保存编辑后的信息
const saveUserInfo = (name) => {
    // 这里可以添加逻辑来保存编辑后的信息到后端
    user.value = { ...editedUser.value }
    isEditing.value[name] = false
}

// 取消编辑
const cancelEdit = (name) => {
    editedUser.value = { ...user.value }
    isEditing.value[name] = false
}
</script>

<style lang="scss" scoped>
.personal-space {
    position: relative;
    border: 10px double #3c7280;
    padding: 20px 30px;
    border-radius: 10px; /* 添加圆角边框 */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
    margin-bottom: 80px;
    img.anime-bg {
        position: absolute;
        height: 150px;
        right: 0px;
        bottom: 0px;
        transform: translate(60%, 50%);
    }
    .user-details {
        :first-child {
            display: flex;
            align-items: center;
            img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                margin-right: 20px;
            }
            div:nth-child(2) {
                h2 {
                    font-size: 24px;
                    margin: 0;
                    color: #333;
                    font-family: 'Courier New', Courier, monospace;
                }
                span {
                    font-size: 16px;
                    color: #888;
                    margin-right: 10px;
                }
            }
        }
        p.signature {
            font-size: 16px;
            color: #666;
            margin-top: 10px;
            padding: 5px;
            border-radius: 5px;
            &:hover {
                color: #3c7280;
                background-color: rgba(140, 193, 220, 0.5);
                border: 1px solid #3c7280;
            }
        }
        .el-textarea.signature {
            width: 100% !important;
            border: 1px solid #ccc !important;
            border-radius: 5px !important;
            font-size: 16px;
            color: #333 !important;
            resize: none;
            margin: 10px 0;
            &:focus {
                border-color: #3c7280;
                outline: none;
            }
            // 添加以下样式以匹配 p.signature 的样式
            &:not(:focus) {
                border: none;
                background-color: transparent;
                color: #666;
                padding: 0;
            }
        }
    }
    .el-form {
        .el-form-item:last-child {
           margin-bottom: 0px;
       }
    }
    // 添加以下样式以将表单输入框背景变为无色
    :deep(.el-input__wrapper) {
        background-color: transparent !important;
    }
}
</style>
