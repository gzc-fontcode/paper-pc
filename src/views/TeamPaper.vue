<template>
    <div class="common-layout">
        <el-container>
            <!--  -->
            <el-header>
                <span>我的团队</span>
                <el-button :icon="Plus" plain @click="showCreateDialog">成立团队</el-button>
            </el-header>
            <el-main>
                <!-- 常用 -->

                <!-- 我的团队 -->
                <div class="paper-list">
                    <el-card
                        v-for="team in teamList"
                        :key="team.id"
                        @click="navigateToTeamSpace(team.id)"
                    >
                        <template #header>
                            <div class="card-header">
                                <div class="paper-name">
                                    <img src="@/assets/icon/team-fill.svg" alt="" />
                                    <span>{{ team.name }}</span>
                                </div>
                                <div class="paper-operation">
                                    <el-popover placement="bottom" trigger="click">
                                        <template #reference>
                                            <el-button class="m-2" @click.stop
                                                ><el-icon><MoreFilled /></el-icon
                                            ></el-button>
                                        </template>
                                        <!-- 弹出框部分 -->
                                        <div class="card-popover">
                                            <el-button
                                                v-if="userId === team.createBy"
                                                type="danger"
                                                text
                                                @click="showDeleteDialog(team)"
                                                >解散团队</el-button
                                            >
                                            <el-button
                                                v-else
                                                type="danger"
                                                text
                                                @click="showDeleteDialog(team)"
                                                >退出团队</el-button
                                            >
                                        </div>
                                    </el-popover>
                                </div>
                            </div>
                        </template>
                        <ul class="modify-list">
                            <li class="text item" v-for="item in items" :key="item.id">
                                <span class="name">
                                    <el-icon><Notebook /></el-icon>
                                    {{ item.name }}
                                </span>
                                <span class="modify-time">{{ item.modifyTime }}</span>
                            </li>
                        </ul>
                    </el-card>
                </div>
            </el-main>
        </el-container>
        <DeleteDialog ref="deleteDialog" />
        <CreateDialog ref="createDialog" type="team" />
    </div>
</template>

<script setup>
import { ref, inject, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DeleteDialog from '@/components/DeleteDialog.vue'
import CreateDialog from '@/components/CreateDialog.vue'
import { Plus } from '@element-plus/icons-vue'
import { getKnowledgeBaseList } from '@/api/storage'

const router = useRouter()
const deleteDialog = ref(null)
const createDialog = ref(null)

const userId = Number(localStorage.getItem('userId'))

const teamList = inject('teamList')

// 加载知识库列表
const loadKnowledgeBases = async () => {
    if (teamList.value) {
        for (const team of teamList.value) {
            const res = await getKnowledgeBaseList({
                teamId: team.id,
                spaceType: 'public',
            })
            team.knowledgeBases = res.data
        }
    }
}

const items = ref([
    { id: 1, name: '知识库1', modifyTime: '2023-01-01 12:00:00' },
    { id: 2, name: '知识库2', modifyTime: '2023-02-01 12:00:00' },
    { id: 3, name: '知识库3', modifyTime: '2023-03-01 12:00:00' },
    { id: 4, name: '知识库4', modifyTime: '2023-04-01 12:00:00' },
])

// 路由跳转到团队详情页
const navigateToTeamSpace = (teamId) => {
    // 新标签页打开
    const route = { name: 'TeamSpace', params: { teamId } }
    window.open(router.resolve(route).href, '_blank')
}

const showDeleteDialog = (item) => {
    deleteDialog.value.showDialog(item)
}
const showCreateDialog = () => {
    createDialog.value.showDialog()
}

watch(
    () => teamList.value.length,
    () => {
        loadKnowledgeBases()
    },
    { deep: true }
)
</script>

<style lang="scss" scoped>
.common-layout {
    .el-header {
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px;
        box-shadow: 0 2px 4px #00000014;
        position: fixed;
        top: 0;
        width: calc(100% - 240px);
    }
    .el-main {
        margin-top: 60px;
        .paper-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            .el-card {
                flex-basis: calc(33.33% - 10px);
                box-shadow: none;
                .el-card__header {
                    .card-header {
                        display: flex;
                        justify-content: space-between;
                    }
                    .paper-name {
                        display: flex;
                        align-items: center;
                        img {
                            width: 1.5em;
                            height: 1.5em;
                            margin-right: 5px;
                        }
                    }
                    .paper-operation {
                        > button {
                            border: none;
                        }
                    }
                }
                .el-card__body {
                    ul.modify-list {
                        padding: 0;
                        margin: 0;
                        .item {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin: 10px 0;
                            .name {
                                display: flex;
                                align-items: center;
                                color: #8a8f8d;
                                i {
                                    margin-right: 5px;
                                }
                                &:hover {
                                    cursor: pointer;
                                    color: #585a5a;
                                }
                            }
                            .modify-time {
                                // float: right;
                                font-size: 0.8em;
                                color: #888;
                            }
                        }
                    }
                }
                &:hover {
                    box-shadow: 0 4px 6px #00000014;
                    cursor: pointer;
                }
            }
            /* 当屏幕宽度小于 1200px，每行显示 2 个元素 */
            @media (max-width: 1200px) {
                .el-card {
                    flex-basis: calc(50% - 10px); /* 每个元素占 45% 宽度，最多 2 个元素 */
                }
            }

            /* 当屏幕宽度小于 800px，每行显示 1 个元素 */
            @media (max-width: 800px) {
                .el-card {
                    flex-basis: calc(100% - 10px); /* 每个元素占 100% 宽度，最多 1 个元素 */
                }
            }
        }
    }
}
</style>
<style lang="scss">
// 知识库卡片弹出框样式
.el-popover:has(.card-popover) {
    padding: 0 !important;
    width: 100px !important;
    min-width: 100px !important;
    button {
        width: 100%;
        margin: 0px;
    }
}
</style>
