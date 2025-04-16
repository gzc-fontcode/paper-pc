<template>
    <div class="root">
        <!-- 侧边栏 -->
        <Sidebar :treeData="treeData" :defaultProps="defaultProps" :addDocument="addDocument" :handleNodeClick="handleNodeClick"/>
        <!-- 路由视图 -->
        <router-view :treeData="treeData" :defaultProps="defaultProps" :handleNodeClick="handleNodeClick"/>
    </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus';
import { ref, provide, onMounted } from 'vue';
import useKnowledgeBaseInfo from '@/hooks/useKnowledgeBaseInfo';
import { getKnowledgeBaseList } from '@/api/storage';
import { getFolderList } from '@/api/folder';
import useDocumentTree from '@/hooks/useDocumentTree';

const route = useRoute();
const router = useRouter();
const knowledgeBaseId = ref(route.params.id);
const spaceType = ref(route.params.spaceType);

// 自定义 Hook 用于获取知识库信息
const { knowledgeBaseInfo } = useKnowledgeBaseInfo(
  spaceType.value, 
  knowledgeBaseId.value
);




// // 定义树结构数据
// const treeData = ref([
//     {
//         id: 1,
//         label: '会计学',
//         children: [
//             {
//                 id: 2,
//                 label: '例题',
//                 date: '2024-06-24 12:18',
//                 children: [
//                     {
//                         id: 4,
//                         label: '例题1',
//                         date: '2024-06-24 12:18'
//                     },
//                     {
//                         id: 5,
//                         label: '例题2',
//                         date: '2024-06-24 12:18'
//                     },
//                     {
//                         id: 6,
//                         label: '例题3',
//                         date: '2024-06-24 12:18'
//                     }
//                 ]
//             },
//             {
//                 id: 3,
//                 label: '大纲',
//                 date: '2024-06-24 15:50'
//             }
//         ],
//         date: '2024-06-23 17:07'
//     },
//     {
//         id: 4,
//         label: '计算机网络',
//         children: [
//             {
//                 id: 5,
//                 label: '物理层',
//                 date: '2023-12-20 21:17'
//             },
//             {
//                 id: 6,
//                 label: '概述',
//                 date: '2023-12-20 21:17'
//             }
//         ],
//         date: '2023-09-22 20:57'
//     },
//     {
//         id: 7,
//         label: '大数据',
//         date: '2023-06-20 07:46'
//     },
//     {
//         id: 8,
//         label: 'C++',
//         date: '2023-05-15 22:10'
//     },
//     {
//         id: 9,
//         label: 'JSP',
//         date: '2023-04-01 08:52'
//     },
//     {
//         id: 10,
//         label: '数据库',
//         date: '2023-02-24 07:42'
//     }
// ]);

// 生成唯一 ID 的函数
const generateUniqueId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
};

// 使用文档树Hook
const { 
  treeData, 
  defaultProps,
  loading,
  addDocument,
  loadFolders,
  addFolder,
} = useDocumentTree(knowledgeBaseId.value);

// 处理节点点击事件（保持组件内）
const handleNodeClick = (data) => {
  router.push({
    name: 'DocumentPage',
    params: {
      id: knowledgeBaseId.value,
      documentId: data.id,
    },
  });
}

// 初始化加载数据
onMounted(() => {
  loadFolders();
});

provide('knowledgeBaseInfo', knowledgeBaseInfo);
provide('spaceType', spaceType);
provide('knowledgeBaseId', knowledgeBaseId);
provide('addDocument', addDocument);
provide('treeData', treeData);
provide('loading', loading);
provide('defaultProps', defaultProps);
provide('loadFolders', loadFolders);
provide('addFolder', addFolder);

</script>

<style lang="scss" scoped>
.root {
    display: flex;
    height: 100vh;
    width: 100%;
}
</style>