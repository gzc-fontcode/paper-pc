<template>
    <el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="reset-form">
        <!-- 用户名输入框 -->
        <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <!-- 邮箱输入框 -->
        <el-form-item label="邮箱" prop="email">
            <el-input
                v-model="form.email"
                placeholder="请输入注册时使用的邮箱"
                clearable
            ></el-input>
        </el-form-item>

        <!-- 验证码输入框 -->
        <el-form-item label="验证码" prop="captcha">
            <div class="code-container">
                <el-input
                    v-model="form.captcha"
                    placeholder="请输入验证码"
                    clearable
                    maxlength="6"
                ></el-input>
                <el-button
                    class="send-code-button"
                    :disabled="isSendingCode || countdown > 0"
                    :loading="isSendingCode"
                    @click="sendVerificationCode"
                >
                    {{ isSendingCode ? `${countdown}s后重试` : '发送验证码' }}
                </el-button>
            </div>
        </el-form-item>

        <!-- 新密码输入框 -->
        <el-form-item label="新密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入新密码" show-password></el-input>
        </el-form-item>

        <!-- 确认新密码输入框 -->
        <el-form-item label="确认新密码" prop="confirmNewPassword">
            <el-input
                v-model="form.confirmNewPassword"
                placeholder="请再次输入新密码"
                show-password
            ></el-input>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
            <el-button type="primary" @click="onSubmit" class="submit-button"> 重设密码 </el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { sendCaptcha, resetPassword } from '@/api/user.js'

const form = reactive({
    userName: '',
    email: '',
    captcha: '',
    password: '',
    confirmNewPassword: '',
})

const rules = {
    userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
    captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { min: 6, max: 6, message: '验证码必须是6位数字', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
    ],
    confirmNewPassword: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== form.password) {
                    callback(new Error('两次输入密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'blur',
        },
    ],
}

const formRef = ref(null)
const isSendingCode = ref(false)
const countdown = ref(0)
const isEmailValid = computed(() =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)
)

const sendVerificationCode = async () => {
    // 在发送验证码之前，先检查邮箱格式是否正确
    if (!isEmailValid.value) {
        ElMessage.warning('请输入有效的邮箱地址')
        return
    }

    // 模拟验证码发送请求
    isSendingCode.value = true

    // 模拟后端发送验证码的逻辑（这里你可以调用你的API）
    try {
        // 发送验证码
        await sendCaptcha(form.email)
        // 发送成功
        ElMessage.success('验证码已发送至邮箱！')
        startCountdown() // 启动倒计时
    } catch (error) {
        console.log('错误信息', error)
    }
}

// 启动倒计时
const startCountdown = () => {
    countdown.value = 60
    timer.value = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
            clearInterval(timer.value)
            isSending.value = false
        }
    }, 1000)
}

const onSubmit = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                await resetPassword({...form}) 
                ElMessage.success('密码重设成功！')
            } catch (error) {
                ElMessage.error('密码重设失败！')
                console.log('错误信息', error)
                return 
            }
        } else {
            ElMessage.error('请检查表单信息是否正确！')
        }
    })
}
</script>

<style lang="scss" scoped>
/* 定义主题色 */
$primary-color: #4caf50;
$primary-color-dark: #388e3c;

/* 表单样式 */
.reset-form {
    max-width: 100%;
    margin: 0 auto;

    .el-form-item {
        margin-bottom: 20px;

        .el-input {
            border-radius: 4px;

            &:focus-within,
            &:hover {
                border-color: $primary-color; /* 使用绿色主题色 */
            }
        }
    }

    .code-container {
        display: flex;
        align-items: center;

        .send-code-button {
            margin-left: 10px;
        }
    }

    .submit-button {
        width: 100%;
        background-color: $primary-color;
        color: #fff;
        border-radius: 4px;
        height: 40px;
        font-size: 16px;
        transition: background-color 0.3s;

        &:hover {
            background-color: $primary-color-dark;
        }
    }
}
</style>
