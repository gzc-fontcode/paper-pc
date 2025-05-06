import { ref } from 'vue'
import { getTeamList } from '@/api/team'

export default function useTeamStore(id) {
    const teamList = ref([]) // 团队列表

    // 加载团队列表
    const fetchTeamList = async (userId = id) => {
        try {
            const res = await getTeamList({ userId })
            if (res.code === '200') {
                teamList.value = res.data || [] 
            }
        } catch (err) {
            console.error('获取团队列表失败', err)
        }
    }

    return {
        teamList,
        fetchTeamList,
    }
}
