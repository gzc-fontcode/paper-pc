import request from '../utils/request';

// 用户登录接口
export function userLogin(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  });
}

// 用户注册接口
export function userRegister(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data,
  });
}

// 用户登出接口
export function userLogout() {
  return request({
    url: '/user/logout',
    method: 'post',
  });
}

// 发送验证码
export function sendCaptcha(email) {
  return request({
    url: '/user/sendCaptcha',
    method: 'post',
    data: { email },
  }); 
}

// 修改密码
export function resetPassword(data) {
  return request({
    url: '/user/retrieve',
    method: 'post',
    data,
  }); 
}

// 退出登录
export function logout() {
  return request({
    url: '/user/logout',
    method: 'get', 
  })
}