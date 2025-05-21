import { ref, onMounted } from 'vue'
import {
    createTemplate,
    loadProcess,
    addNode,
    deleteNode as deleteNodeApi,
    traverseNode,
    getTemplateList,
    deleteTemplate,
    initiateProcess as initiateProcessApi,
    deleteProcess as deleteProcessApi,
    traverseProcess,
    traverseProcessNode,
    agreeProcess as agreeProcessApi,
    rejectProcess as rejectProcessApi,
} from '@/api/process' // 假设 api 存在
import { ElMessage } from 'element-plus' // 假设 Element Plus 存在

export function useWorkflow(teamId) {
    const createFlowForm = ref({
        processName: '',
        remark: '',
    })

    // 新建流程模板的id
    const createFlowId = ref(null)

    // 节点列表
    const nodeList = ref([])

    const nodeForm = ref({ title: '', remark: '', approver: '', parentProcess: '' })

    // 获取流程模板列表
    const templateList = ref([])

    // 流程列表
    const processList = ref([])

    // 获取流程列表
    const getProcessListData = async () => {
        const res = await traverseProcess()
        console.log(res, 'res.data')
        processList.value = res.data || [] 
    }
    // 获取流程模板列表
    const getTemplateListData = async () => {
        const res = await getTemplateList({ teamId })
        templateList.value = res.data || []
    }
    // 删除流程模板
    const deleteFlow = async (processId) => {
        try {
            const res = await deleteTemplate({ processId }) // 调用删除流程模板接口
            ElMessage.success('删除流程模板成功')
            console.log('删除流程模板成功', res.data)
        } catch (error) {
            ElMessage.error('删除流程模板失败')
            console.error('删除流程模板失败', error)
            throw error
        }
    }

    // 加载流程模板
    const loadFlow = async () => {
        try {
            const res = await loadProcess() // 调用加载流程模板接口
            createFlowId.value = res.data.processId // 假设接口返回的是一个对象，包含 id 属性
            nodeList.value = res.data.detailProcessDTOList // 假设接口返回的是一个对象，包含 nodes 属性
            console.log(nodeList.value, 'nodeList')
            console.log('加载流程模板成功', createFlowId.value)
        } catch (error) {
            ElMessage.error('加载流程模板失败')
            console.error('加载流程模板失败', error)
            throw error
        }
    }

    // 新增节点
    const createNode = async () => {
        try {
            const res = await addNode({ processId: createFlowId.value, ...nodeForm.value }) // 调用新增节点接口
            ElMessage.success('新增节点成功')
            console.log('新增节点成功', res.data)
        } catch (error) {
            ElMessage.error('新增节点失败')
            console.error('新增节点失败', error)
            throw error
        }
    }

    // 同意流程
    const agreeProcess = async (id) => {
        try {
            const res = await agreeProcessApi({ id }) // 调用同意流程接口
            ElMessage.success('同意流程成功')
            console.log('同意流程成功', res.data) 
        } catch (error) {
            ElMessage.error('同意流程失败')
            console.error('同意流程失败', error)
            throw error 
        }
    }

    // 驳回流程
    const rejectProcess = async (id) => {
        try {
            const res = await rejectProcessApi({ id }) // 调用驳回流程接口
            ElMessage.success('驳回流程成功')
            console.log('驳回流程成功', res.data) 
        } catch (error) {
            ElMessage.error('驳回流程失败') 
        }
    }

    // 删除节点
    const deleteNode = async (nodeId) => {
        try {
            const res = await deleteNodeApi({ id: nodeId }) // 调用删除节点接口
            ElMessage.success('删除节点成功')
            console.log('删除节点成功', res.data)
        } catch (error) {
            ElMessage.error('删除节点失败')
            console.error('删除节点失败', error)
            throw error
        }
    }

    // 获取模板节点列表
    const loadNodeList = async () => {
        try {
            const res = await traverseNode({ processId: createFlowId.value }) // 调用加载流程模板接口
            nodeList.value = res.data // 假设接口返回的是一个对象，包含 nodes 属性
            // console.log('加载节点列表成功', nodeList.value)
        } catch (error) {
            ElMessage.error('加载节点列表失败')
            console.error('加载节点列表失败', error)
            throw error
        }
    }

    // 新建流程模板
    const createFlow = async () => {
        try {
            await createTemplate({ ...createFlowForm.value, teamId: Number(teamId) }) // 调用创建流程模板接口
            // 成功后可以进行相应的操作，例如关闭弹窗等
            ElMessage.success('创建流程模板成功')
        } catch (error) {
            console.error('创建流程模板失败', error)
            ElMessage.error('创建流程模板失败')
            // 处理错误逻辑，例如显示错误信息等
        }
    }

    // 发起流程
    const initiateProcess = async (data) => {
        try {
            const res = await initiateProcessApi({ processId: data.templateId, title: data.title })
            console.log('流程发起成功', res.data)
            return res
        } catch (error) {
            console.error('流程发起失败', error)
            throw error
        }
    }

    // 删除流程
    const deleteProcess = async (process) => {
        try {
            const res = await deleteProcessApi({ ...process, approver: process.approver.id }) // 调用删除流程接口
            ElMessage.success('删除流程成功')
            console.log('删除流程成功', res.data) 
        } catch (error) {
            ElMessage.error('删除流程失败')
            console.error('删除流程失败', error)
            throw error 
        }
    }

    // 获取流程中的节点
    const getProcessNodeList = async (id) => {
        try {
            const res = await traverseProcessNode({ id }) // 调用获取流程节点列表接口
            console.log('获取流程节点列表成功', res)
            nodeList.value = res.data // 假设接口返回的是一个对象，包含 nodes 属性
            // return res.data // 假设接口返回的是一个对象，包含 nodes 属性
        } catch (error) {
            console.error('获取流程节点列表失败', error)
            throw error 
        }
    }

    onMounted(() => {
        getProcessListData() // 加载流程列表
    })

    return {
        templateList,
        nodeList,
        nodeForm,
        createFlowForm,
        processList,
        getTemplateListData,
        createFlow,
        createNode,
        deleteNode,
        loadNodeList,
        loadFlow,
        deleteFlow,
        initiateProcess,
        getProcessListData,
        deleteProcess,
        getProcessNodeList,
        agreeProcess,
        rejectProcess,
    }
}
