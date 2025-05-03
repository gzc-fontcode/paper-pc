import { ref } from 'vue'
import { getTeamList } from '@/api/team'

export default function useTeamStore(userId) {
    const teamList = ref([]) // 团队列表

    // 加载知识库列表
    const fetchTeamList = async (userId = userId) => {
        try {
            const res = await getTeamList({ userId })
            if (res.code === 200) {
                teamList.value = res.data || [] 
            }
        } catch (err) {
            console.error('获取知识库列表失败', err)
        }
    }

    return {
        teamList,
        fetchTeamList,
    }
}
