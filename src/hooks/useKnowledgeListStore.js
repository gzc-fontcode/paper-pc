import { ref } from 'vue';
import { getKnowledgeBaseList } from '@/api/storage';

export default function useKnowledgeStore(info = {spaceType: 'private'}) {
  const knowledgeBases = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // 加载知识库列表
  const loadKnowledgeBases = async () => {
    try {
      loading.value = true;
      const res = await getKnowledgeBaseList(info);
      knowledgeBases.value = res.data;
    } catch (err) {
      error.value = err.message || '获取知识库失败';
    } finally {
      loading.value = false;
    }
  };

  return {
    knowledgeBases,
    loading,
    error,
    loadKnowledgeBases
  };
}
