import request from '../utils/know-request';

// 新建文件
export function createFile(data) {
  return request({
    url: '/file/newFile',
    method: 'post',
    data
  });
}

// 删除文件
export function deleteFile(data) {
  return request({
    url: '/file/delete',
    method: 'post',
    data
  });  
}