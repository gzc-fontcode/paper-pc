import { ref, onMounted } from 'vue'
import { getKnowledgeBaseList, updateKnowledgeBase } from '@/api/storage'

export default function useKnowledgeBaseInfo(spaceType, id) {
    const knowledgeBaseInfo = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const fetchKnowledgeBase = async () => {
        try {
            loading.value = true
            const res = await getKnowledgeBaseList({ spaceType, id })
            if (res.data[0]) {
                knowledgeBaseInfo.value = res.data[0]
                knowledgeBaseInfo.value.spaceType =
                    knowledgeBaseInfo.value.spaceType === '0' ? 'private' : ''
            }
        } catch (err) {
            error.value = err
            console.error('获取知识库信息失败:', err)
        } finally {
            loading.value = false
        }
    }

    const updateKnowledgeBaseInfo = async (data) => {
        loading.value = true
        try {
            const obj = {...data, id: knowledgeBaseInfo.value.id }
            await updateKnowledgeBase(obj)
            // 更新成功后重新获取知识库信息
            fetchKnowledgeBase()
        } catch (err) {
            error.value = err
            console.error('更新知识库信息失败:', err)
        }
        loading.value = false
    }

    onMounted(fetchKnowledgeBase)

    return {
        knowledgeBaseInfo,
        loading,
        error,
        fetchKnowledgeBase,
        updateKnowledgeBaseInfo,
    }
}
