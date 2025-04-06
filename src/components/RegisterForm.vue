<template>
    <el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="form">
        <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <!-- 邮箱输入框 -->
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" clearable></el-input>
        </el-form-item>

        <!-- 验证码输入框 -->
        <el-form-item label="验证码" prop="captcha">
            <div class="captcha-container">
                <el-input v-model="form.captcha" placeholder="请输入验证码" clearable></el-input>
                <el-button
                    :disabled="isSending"
                    :loading="isSending"
                    @click="sendCaptcha"
                    class="send-captcha-button"
                >
                    {{ isSending ? countdown + '秒后重试' : '发送验证码' }}
                </el-button>
            </div>
        </el-form-item>

        <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
                v-model="form.confirmPassword"
                placeholder="请再次输入密码"
                show-password
            ></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="onSubmit" class="submit-button"> 注 册 </el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { userRegister, sendCaptcha as sendCode } from '@/api/user.js'

const form = reactive({
    userName: '',
    email: '',
    captcha: '', // 新增字段，用于存储验证码
    password: '',
    confirmPassword: '',
})

const rules = {
    userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: '邮箱格式不正确',
            trigger: 'blur',
        },
    ],
    captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== form.password) {
                    callback(new Error('两次输入密码不一致！'))
                } else {
                    callback()
                }
            },
            trigger: 'blur',
        },
    ],
}

const formRef = ref(null)
const isSending = ref(false) // 用于控制验证码发送的状态
const countdown = ref(60) // 倒计时
const timer = ref(null) // 倒计时定时器
const isEmailValid = computed(() =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)
)

const onSubmit = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                await userRegister({...form})
                ElMessage.success('注册成功！')
            } catch (error) {
                ElMessage.error('注册失败！')
                console.log('错误信息', error)
            }
        } else {
            ElMessage.error('请检查表单信息是否正确！')
        }
    })
}

// 模拟发送验证码的函数
const sendCaptcha = async () => {
    // 在发送验证码之前，先检查邮箱格式是否正确
    if (!isEmailValid.value) {
        ElMessage.warning('请输入有效的邮箱地址')
        return
    }

    // 开始发送验证码，设置发送状态为正在发送
    isSending.value = true

    // 模拟后端发送验证码的逻辑（这里你可以调用你的API）
    try {
        // 发送验证码
        await sendCode(form.email)
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
</script>

<style lang="scss" scoped>
.captcha-container {
    display: flex;
    align-items: center;
}

.send-captcha-button {
    margin-left: 10px;
}
</style>
