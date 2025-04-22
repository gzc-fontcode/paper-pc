import { ref } from 'vue'
import { getFolderList, createFolder, deleteFolder as deleteFolderApi } from '@/api/folder'
import { createFile, deleteFile } from '@/api/file'
import { ElMessage } from 'element-plus'

export default function useDocumentTree(knowledgeBaseId) {
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
            ElMessage.error('获取文档结构失败')
        } finally {
            loading.value = false
        }
    }

    // 新增文件夹
    const addFolder = async (parentNode) => {
        try {
            const { id: parentId, storageId } = parentNode || {storageId: knowledgeBaseId, id: null}
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
            const { id: folderId, storageId } = parentNode || {storageId: knowledgeBaseId, id: null}
            await createFile({
                storageId,
                name: '新文档',
                folderId,
            })

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
        }  catch (error) {
            ElMessage.error('删除文档失败')
        }
    }

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
