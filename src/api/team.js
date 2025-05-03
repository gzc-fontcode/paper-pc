import request from '../utils/request';

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