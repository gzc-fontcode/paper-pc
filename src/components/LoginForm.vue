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
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          placeholder="请输入密码"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
          class="submit-button"
        >
          登  录
        </el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue';
  import { ElMessage } from 'element-plus';
  import { useRouter } from "vue-router"; // 导入路由

  const router = useRouter();
  
  const form = reactive({
    email: '',
    password: '',
  });
  
  const rules = {
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '邮箱格式不正确', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
    ],
  };
  
  const formRef = ref(null);
  
  const onSubmit = () => {
    formRef.value.validate((valid) => {
      if (valid) {
        ElMessage.success('登录成功！');
        console.log(router);
        
        router.push("/dashboard"); // 跳转到系统首页
      } else {
        ElMessage.error('请检查表单信息是否正确！');
      }
    });
  };
  </script>
  
  <style lang="scss" scoped>
  </style>
  