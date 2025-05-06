import request from '../utils/request'

// 获取团队列表
export function getTeamList(data) {
    return request({
        url: '/team/listTeamByUserId',
        method: 'post',
        data,
    })
}

// 新建团队
export function createTeam(data) {
    return request({
        url: '/team/insert',
        method: 'post',
        data,
    })
}

// 邀请用户到团队
export function inviteUser(data) {
  return request({
      url: '/team/addUserToTeam',
      method: 'post',
      data,
  })
}

// 从团队中删除用户
export function removeUser(data) {
    return request({
        url: '/team/deleteUserFromTeam',
        method: 'post',
        data,
    })
}


// 遍历团队用户
export function getTeamUserList(data) {
    return request({
        url: '/role/getUserRole',
        method: 'post',
        data,
    })
}

// 分配管理员权限
export function assignAdmin(data) {
    return request({
        url: '/role/assignManagerRole',
        method: 'post',
        data,
    })
}
