import request from '../utils/know-request'

// 新建文件
export function createFile(data) {
    return request({
        url: '/file/newFile',
        method: 'post',
        data,
    })
}

// 删除文件
export function deleteFile(data) {
    return request({
        url: '/file/delete',
        method: 'post',
        data,
    })
}

// 上传文件
export function uploadFile(data) {
    return request({
        url: '/file/upload',
        method: 'post',
        data,
    })
}

// 更新文件
export function updateFile(data) {
    return request({
        url: '/file/update',
        method: 'post',
        data,
    }) 
}

// 获取单个文件信息
export function getFileInfo(data) {
    return request({
        url: '/file/list',
        method: 'post',
        data,
    })
}

// 下载文件
export function downloadFile(id) {
    return request({
        url: `/file/download/${id}`,
        method: 'get',
        // responseType: 'blob', // 告诉 axios 返回的是二进制数据
    }) 
}
