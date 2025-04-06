import request from '../utils/know-request';

// 获取知识库列表
export function getKnowledgeBaseList(data) {
  return request({
    url: '/storage/list',
    method: 'post',
    data
  });
}

// 新建知识库
export function createKnowledgeBase(data) {
  return request({
    url: '/storage/create',
    method: 'post',
    data
  }); 
}

// 删除知识库
export function deleteKnowledgeBase(id) {
  return request({
    url: '/storage/delete',
    method: 'post',
    data: { id }
  });
}