import { ref, onMounted, computed, watch } from 'vue'
import { getTeamUserList, inviteUser, assignAdmin, removeUser } from '@/api/team'

export default function useTeamInfoStore(teamId) {
    
    const teamUserList = ref([]) // 团队用户列表
    const userId = JSON.parse(localStorage.getItem('userId')) // 获取当前登录用户信息
    const userInfo = ref({}) // 当前登录用户信息
    // 拥有管理员权限的用户列表
    const adminList = computed(() => {
        return teamUserList.value.filter(user => user.role === 'manager') // 过滤出管理员用户 
    })

    watch(teamUserList, (newVal, oldVal) => {
        userInfo.value = newVal.find(user => user.id === userId) || {} // 根据当前登录用户ID查找用户信息
    })

    // 加载团队用户列表
    const fetchTeamUserList = async () => {
        try {
            const res = await getTeamUserList({ teamId }) 
            teamUserList.value = res.data || [] // 更新团队用户列表
        } catch (err) {
            console.error('获取团队用户列表失败', err) 
        }
    }

    // 邀请用户加入团队
    const inviteUserToTeam = async (id) => {
        try {
            await inviteUser({ teamId, userId: id }) // 调用邀请用户接口
            fetchTeamUserList() // 邀请成功后刷新团队用户列表 
        } catch (err) {
            console.error('邀请用户加入团队失败', err) 
        }
    }

    // 删除用户
    const deleteUserFromTeam = async (id) => {
        try {
            await removeUser({ teamId, userId: id }) // 调用删除用户接口
            fetchTeamUserList() // 删除成功后刷新团队用户列表 
        } catch (err) {
            console.error('删除用户失败', err) 
        }
    }

    // 分配管理员
    const assignAdminToUser = async (id) => {
        try {
            await assignAdmin({ teamId, userId: id }) // 调用分配管理员接口
            fetchTeamUserList() // 分配成功后刷新团队用户列表
        } catch (err) {
            console.error('分配管理员失败', err)
        }
    }

    onMounted(() => {
        fetchTeamUserList() // 组件挂载时加载团队用户列表 
    })

    return {
        userInfo,
        teamUserList,
        adminList,
        fetchTeamUserList,
        inviteUserToTeam,
        assignAdminToUser,
        deleteUserFromTeam,
    }
}
