import request from '../utils/request'

// 获取流程模板列表
export function getTemplateList(data) {
    return request({
        url: '/process/listProcess',
        method: 'post',
        data,
    })
}

// 加载流程模板
export function loadProcess(data) {
    return request({
        url: '/process/loadProcess',
        method: 'get'
    })  
}

// 新建流程模板
export function createTemplate(data) {
    return request({
        url: '/process/addProcess',
        method: 'post',
        data,
    })  
}

// 删除流程模板
export function deleteTemplate(data) {
    return request({
        url: '/process/deleteProcess',
        method: 'post',
        data,
    })
}

// 编辑流程模板
export function editTemplate(data) {
    return request({
        url: '/process/updateProcess',
        method: 'post',
        data,
    })
}

// 新增节点
export function addNode(data) {
    return request({
        url: '/process/addNode',
        method: 'post',
        data,
    })
}

// 删除节点
export function deleteNode(data) {
    return request({
        url: '/process/deleteNode',
        method: 'post',
        data,
    })
}

// 编辑节点
export function editNode(data) {
    return request({
        url: '/process/updateNode',
        method: 'post',
        data,
    })
}

// 遍历节点
export function traverseNode(data) {
    return request({
        url: '/process/listNode',
        method: 'post',
        data,
    })  
}

// 发起流程
export function initiateProcess(data) {
    return request({
        url: '/process/initiateProcess',
        method: 'post',
        data,
    }) 
}

// 同意流程
export function agreeProcess(data) {
    return request({
        url: '/process/agreeProcess',
        method: 'post',
        data,
    })  
}

// 驳回流程
export function rejectProcess(data) {
    return request({
        url: '/process/rejectProcess',
        method: 'post',
        data,
    })
}

// 删除流程
export function deleteProcess(data) {
    return request({
        url: '/process/deleteOngoingProcess',
        method: 'post',
        data,
    })  
}

// 遍历流程
export function traverseProcess(data) {
    return request({
        url: '/process/listOngoingProcess',
        method: 'get'
    })  
}

// 遍历流程中的节点
export function traverseProcessNode(data) {
    return request({
        url: '/process/listDetailOngoingProcess',
        method: 'post',
        data,
    }) 
}