<template>
  <el-form
    :model="form"
    :rules="rules"
    ref="formRef"
    label-position="top"
    class="form"
  >
    <el-form-item label="邮箱" prop="email">
      <el-input
        v-model="form.email"
        placeholder="请输入邮箱"
        clearable
      ></el-input>
    </el-form-item>

    <!-- 验证码输入框 -->
    <el-form-item label="验证码" prop="captcha">
      <div class="captcha-container">
        <el-input
          v-model="form.captcha"
          placeholder="请输入验证码"
          clearable
        ></el-input>
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
      <el-input
        v-model="form.password"
        placeholder="请输入密码"
        show-password
      ></el-input>
    </el-form-item>

    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="form.confirmPassword"
        placeholder="请再次输入密码"
        show-password
      ></el-input>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        @click="onSubmit"
        class="submit-button"
      >
        注  册
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref, computed  } from 'vue';
import { ElMessage } from 'element-plus';

const form = reactive({
  email: '',
  captcha: '',  // 新增字段，用于存储验证码
  password: '',
  confirmPassword: '',
});

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '邮箱格式不正确', trigger: 'blur' },
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入密码不一致！'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
};

const formRef = ref(null);
const isSending = ref(false);  // 用于控制验证码发送的状态
const countdown = ref(60);  // 倒计时
const timer = ref(null);  // 倒计时定时器
const isEmailValid = computed(() => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email));

const onSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('注册成功！');
    } else {
      ElMessage.error('请检查表单信息是否正确！');
    }
  });
};

// 模拟发送验证码的函数
const sendCaptcha = () => {
  // 在发送验证码之前，先检查邮箱格式是否正确
  if (!isEmailValid.value) {
    ElMessage.warning('请输入有效的邮箱地址');
    return;
  }

  // 开始发送验证码，设置发送状态为正在发送
  isSending.value = true;

  // 模拟后端发送验证码的逻辑（这里你可以调用你的API）
  setTimeout(() => {
    // 假设验证码发送成功
    ElMessage.success('验证码已发送至邮箱！');
    startCountdown();  // 启动倒计时
  }, 1000); // 模拟发送延时，1秒后恢复按钮状态
};

// 启动倒计时
const startCountdown = () => {
  countdown.value = 60;
  timer.value = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer.value);
      isSending.value = false;
    }
  }, 1000);
};
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
