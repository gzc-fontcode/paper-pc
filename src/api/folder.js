import request from '../utils/know-request';

// 遍历文件树
export function getFolderList(data) {
  return request({
    url: '/folder/tree',
    method: 'post',
    data
  });
}

// 新增文件夹
export function createFolder(data) {
  return request({
    url: '/folder/create',
    method: 'post',
    data
  });
}

// 重命名文件夹
export function renameFolder(data) {
  return request({
    url: '/folder/rename',
    method: 'post',
    data
  });
}