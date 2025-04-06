import { ref } from 'vue';
import { getFolderList, createFolder } from '@/api/folder';
import { ElMessage } from 'element-plus';

export default function useDocumentTree(knowledgeBaseId) {
  const treeData = ref([]);
  const loading = ref(false);

  const defaultProps = {
    children: 'folderChildren',
    label: 'name'
  };

  // 生成唯一 ID
  const generateUniqueId = () => Date.now() + Math.floor(Math.random() * 1000);

  // 加载文件夹数据
  const loadFolders = async () => {
    try {
      loading.value = true;
      const storageIdValue = typeof knowledgeBaseId === 'object' && knowledgeBaseId.value ? knowledgeBaseId.value : knowledgeBaseId;
      const res = await getFolderList({ storageId: storageIdValue });
      treeData.value = res.data;
      console.log(treeData.value, 'loadFolders');
    } catch (error) {
      ElMessage.error('获取文档结构失败');
    } finally {
      loading.value = false;
    }
  };

  // 新增文件夹
  const addFolder = async (parentNode) => {
    try {
      const newFolder = {
        id: generateUniqueId(),
        label: '文档',
        date: new Date().toLocaleString(),
        parentId: parentNode ? parentNode.id : null
      };
      console.log(knowledgeBaseId, 'newFolder');
      
      // 确保 knowledgeBaseId 是普通值
      const storageIdValue = typeof knowledgeBaseId === 'object' && knowledgeBaseId.value ? knowledgeBaseId.value : knowledgeBaseId;

      const response = await createFolder({
        storageId: storageIdValue,
        name: newFolder.label,
        folderId: String(newFolder.parentId)
      });

      loadFolders();

      // if (parentNode) {
      //   if (!parentNode.children) {
      //     parentNode.children = [];
      //   }
      //   parentNode.children.push(newFolder);
      // } else {
      //   treeData.value.push(newFolder);
      // }
      ElMessage.success('新增文件夹成功');
    } catch (error) {
      ElMessage.error('新增文件夹失败');
    }
  };

  // 新增文档
  const addDocument = () => {
    const newDocument = {
      id: generateUniqueId(),
      label: '新文档',
      date: new Date().toLocaleString()
    };
    treeData.value.push(newDocument);
    ElMessage.success('新增文档成功');
  };

  return {
    treeData,
    defaultProps,
    loading,
    loadFolders,
    addFolder,
    addDocument
  };
}
