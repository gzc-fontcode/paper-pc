import { ref, provide, watch, useTemplateRef } from 'vue'
import { getFolderList, createFolder, deleteFolder as deleteFolderApi } from '@/api/folder'
import { createFile, deleteFile, uploadFile } from '@/api/file'
import { ElMessage } from 'element-plus'

export default function useDocumentTree(knowledgeBaseId) {
    const treeRef = ref(null)
    // 记录展开节点的键值
    const expandedKeys = ref([])

    const treeData = ref([])
    const loading = ref(false)

    const defaultProps = {
        children: 'folderChildren',
        label: 'name',
        class: (data) => `${data?.type}-node`,
    }

    // 加载文件夹数据
    const loadFolders = async () => {
        try {
            loading.value = true
            const storageIdValue =
                typeof knowledgeBaseId === 'object' && knowledgeBaseId.value
                    ? knowledgeBaseId.value
                    : knowledgeBaseId
            const res = await getFolderList({ storageId: storageIdValue })
            treeData.value = res.data
        } catch (error) {
            console.error('获取文档结构失败', error)
            ElMessage.error('获取文档结构失败')
        } finally {
            loading.value = false
        }
    }

    // 新增文件夹
    const addFolder = async (parentNode) => {
        try {
            const { id: parentId, storageId } = parentNode || {
                storageId: knowledgeBaseId,
                id: null,
            }
            await createFolder({
                storageId,
                name: '新文件夹',
                parentId,
            })

            // 刷新树结构
            loadFolders()

            ElMessage.success('新增文件夹成功')
        } catch (error) {
            ElMessage.error('新增文件夹失败')
        }
    }

    // 删除文件夹
    const deleteFolder = async (node) => {
        try {
            const { id, storageId } = node || {}
            await deleteFolderApi({
                storageId,
                id,
            })
            // 刷新树结构
            loadFolders()
            ElMessage.success('删除文件夹成功')
        } catch (error) {
            ElMessage.error('删除文件夹失败')
        }
    }

    // 新增文档
    const addDocument = async (parentNode) => {
        try {
            const { id: folderId, storageId } = parentNode || {
                storageId: knowledgeBaseId,
                id: null,
            }
            const formData = new FormData()
            formData.append('json', JSON.stringify(''))
            formData.append('folderId', folderId)
            formData.append('storageId', storageId)
            formData.append('objectName', '新文档')
            await uploadFile(formData)

            // 刷新树结构
            loadFolders()

            ElMessage.success('新增文档成功')
        } catch (error) {
            ElMessage.error('新增文档失败')
        }
    }

    // 删除文档
    const deleteDocument = async (node) => {
        try {
            const { id } = node || {}
            await deleteFile({ id })
            // 刷新树结构
            loadFolders()
            ElMessage.success('删除文档成功')
        } catch (error) {
            ElMessage.error('删除文档失败')
        }
    }

    // 监听树型组件的展开状态变化
    watch(
        () => treeRef.value?.store.expandedKeys,
        (newKeys) => {
            if (newKeys) {
                console.log('newKeys', newKeys);
                // expandedKeys.value = newKeys
            }
        },
        { deep: true }
    )
    watch(
       () => expandedKeys.value,
       (newKeys) => {
        if (newKeys) {
            console.log('newKeys', newKeys);
            
        }
       } 
    )
    
    provide('treeRef', treeRef)
    provide('expandedKeys', expandedKeys)

    return {
        treeData,
        defaultProps,
        loading,
        loadFolders,
        addFolder,
        deleteFolder,
        addDocument,
        deleteDocument,
    }
}
