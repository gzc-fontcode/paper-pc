<template>
    <div class="auth-container">
        <div class="login-page-title">
            <img src="@/assets/pic/logo.png" alt="">
            <h1>云端文档协作平台</h1>
        </div>
        <el-tabs v-model="activeTab" class="tabs-control" :stretch="true" v-if="activeTab != 'reset'">
            <el-tab-pane label="登录" name="login" />
            <el-tab-pane label="注册" name="register" />
        </el-tabs>
        <div class="form-container">
            <LoginForm v-if="activeTab === 'login'" />
            <RegisterForm v-else-if="activeTab === 'register'" />
            <ResetForm v-else-if="activeTab ==='reset'" />
        </div>
        <div class="forget-password">
            <el-button link v-if="activeTab === 'login'" @click="activeTab = 'reset'">
                忘记密码？
            </el-button>
            <el-button link v-else-if="activeTab === 'reset'" @click="activeTab = 'login'">
                返回
            </el-button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'
import ResetForm from '../components/ResetForm.vue';

const activeTab = ref('login') // 默认显示登录表单
</script>

<style lang="scss" scoped>
.auth-container {
    width: 400px;
    padding: 20px 5%;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.login-page-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
        width: 100px;
    }
}
.tabs-control {
    text-align: center;
}

.form-container {
    padding: 10px 0;
}
</style>
<style lang="scss">
/* 表单容器 */
.form {
    max-width: 100%;
    margin: 0 auto;

    .el-form-item {
        margin-bottom: 20px;

        .el-input {
            border-radius: 4px;
        }
    }

    /* 提交按钮 */
    .submit-button {
        width: 100%; // 按钮宽度自适应
        // background-color: $primary-color;
        color: #fff;
        border-radius: 4px;
        height: 40px;
        font-size: 16px;
        transition: background-color 0.3s;
    }
}
</style>
