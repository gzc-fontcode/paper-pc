<template>
    <el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="form">
        <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit" class="submit-button"> 登 录 </el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router' // 导入路由
import { userLogin } from '@/api/user.js'

const router = useRouter()

const form = reactive({
    userName: '',
    password: '',
})

const rules = {
    userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
    ],
}

const formRef = ref(null)

const onSubmit = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                const res = await userLogin({ ...form }) // 调用登录接口
                if (res.code === '200') {
                    // 存储token到localStorage
                    localStorage.setItem('userId', res.data.userId)
                    localStorage.setItem('userName', res.data.userName)
                    localStorage.setItem('token', res.data.token)
                    ElMessage.success('登录成功！')
                    router.push('/dashboard') // 跳转到系统首页
                }
            } catch (error) {
                ElMessage.error('登录失败！')
                console.log('错误信息', error)
                return // 登录失败，直接返回
            }
        } else {
            ElMessage.error('请检查表单信息是否正确！')
        }
    })
}
</script>

<style lang="scss" scoped></style>
