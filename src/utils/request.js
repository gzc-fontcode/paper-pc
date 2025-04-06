import axios from 'axios';

// 用户相关axios实例
const service = axios.create({
  baseURL: '/user-api', // 与 Vite 配置的代理路径一致
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加token到请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 处理响应错误
    console.log(error);
    // 处理401未授权
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // 跳转登录页
    }
    return Promise.reject(error);
  }
);

export default service;
