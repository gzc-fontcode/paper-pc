import { ref, onMounted } from 'vue';
import { getKnowledgeBaseList } from '@/api/storage';

export default function useKnowledgeBaseInfo(spaceType, id) {
  const knowledgeBaseInfo = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchKnowledgeBase = async () => {
    try {
      loading.value = true;
      const res = await getKnowledgeBaseList({ spaceType, id });
      if (res.data[0]) {
        knowledgeBaseInfo.value = res.data[0];
      }
    } catch (err) {
      error.value = err;
      console.error('获取知识库信息失败:', err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchKnowledgeBase);

  return {
    knowledgeBaseInfo,
    loading,
    error,
    fetchKnowledgeBase
  };
}
