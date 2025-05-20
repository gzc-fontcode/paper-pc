import { ref } from 'vue'
import {
    createTemplate,
    loadProcess,
    addNode,
    deleteNode as deleteNodeApi,
    traverseNode,
    getTemplateList,
    deleteTemplate,
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

    return {
        templateList,
        nodeList,
        nodeForm,
        createFlowForm,
        getTemplateListData,
        createFlow,
        createNode,
        deleteNode,
        loadNodeList,
        loadFlow,
        deleteFlow,
    }
}
