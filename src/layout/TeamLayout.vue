<template>
    <el-container class="default-layout">
        <!-- 左侧侧边栏 -->
        <TeamSideBar />
        <!-- 右侧内容区域 -->
        <el-container>
            <el-main class="main-content">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import TeamSideBar from './sidebar/TeamSideBar.vue';
import useKnowledgeStore from '@/hooks/useKnowledgeListStore'
import useTeamInfoStore from '@/hooks/useTeamInfoStore'

const route = useRoute()
const teamId = route.params.teamId

const { knowledgeBases, loadKnowledgeBases } = useKnowledgeStore({
    teamId,
    spaceType: 'public'
})

const { userInfo, teamUserList, fetchTeamUserList, inviteUserToTeam, assignAdminToUser, deleteUserFromTeam } = useTeamInfoStore(teamId)
console.log(teamUserList, 'teamUserList');
onMounted(async () => {
    await loadKnowledgeBases() // 加载知识库列表 
})

// 提供知识库数据给子组件
provide('knowledgeBases', knowledgeBases)
provide('loadKnowledgeBases', loadKnowledgeBases)

// 提供用户列表数据给子组件
provide('userInfo', userInfo)
provide('teamUserList', teamUserList)
provide('fetchTeamUserList', fetchTeamUserList)
provide('inviteUserToTeam', inviteUserToTeam)
provide('assignAdminToUser', assignAdminToUser)
provide('deleteUserFromTeam', deleteUserFromTeam)

</script>

<style lang="scss" scoped>
.default-layout {
    height: 100vh;
    .sidebar {
        background-color: #fafafa; // 左侧背景色
        // color: #fff;

        .logo {
            padding: 20px;
            font-size: 20px;
            text-align: center;
            color: #4caf50; // 主题色
        }

        .el-menu {
            border-right: none;

            .el-menu-item {
                &:hover {
                    background-color: #4caf50; // 主题色
                    color: #fff;
                }

                &.is-active {
                    background-color: #4caf50; // 激活项背景色
                    color: #fff;
                }
            }
        }
    }

    .el-container {
        width: calc(100% - 240px);
        position: absolute;
        right: 0px;
    }
    .main-content {
        padding: 0px;
        background-color: #ffffff;
        overflow-y: auto;
    }
}
</style>
