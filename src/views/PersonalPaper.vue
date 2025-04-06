<template>
    <div class="common-layout">
        <el-container>
            <!--  -->
            <el-header>
                <span>知识库</span>
                <el-button :icon="Plus" plain @click="showCreateDialog">新建知识库</el-button>
            </el-header>
            <el-main>
                <!-- 常用 -->

                <!-- 我的知识库 -->
                <!-- 修改模板部分 -->
                <div class="paper-list">
                    <el-card
                        v-for="kb in knowledgeBases"
                        :key="kb.id"
                        @click="navigateToKnowledgeBase(kb.id)"
                    >
                        <template #header>
                            <div class="card-header">
                                <div class="paper-name">
                                    <img src="@/assets/icon/book-solid.svg" alt="" />
                                    <span>{{ kb.name }}</span>
                                </div>
                                <!-- 保持原有操作按钮 -->
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
                                                type="danger"
                                                text
                                                @click="showDeleteDialog(kb.id)"
                                                >删除</el-button
                                            >
                                        </div>
                                    </el-popover>
                                </div>
                            </div>
                        </template>
                        <ul class="modify-list">
                            <li class="text item" v-for="item in items" :key="item.id">
                                <span class="name" @click.stop>
                                    <el-icon><Document /></el-icon>
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
        <CreateDialog ref="createDialog" />
    </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import DeleteDialog from '@/components/DeleteDialog.vue'
import CreateDialog from '@/components/CreateDialog.vue'
import { Plus } from '@element-plus/icons-vue'
import { getKnowledgeBaseList } from '@/api/storage' // 新增接口引入

const router = useRouter()
const deleteDialog = ref(null)
const createDialog = ref(null)
// const knowledgeBases = ref([]) // 替换原有的静态数据
const knowledgeBases = inject('knowledgeBases') // 注入知识库数据

const items = ref([
    { id: 1, name: '文档1', modifyTime: '2023-01-01 12:00:00' },
    { id: 2, name: '文档2', modifyTime: '2023-02-01 12:00:00' },
    { id: 3, name: '文档3', modifyTime: '2023-03-01 12:00:00' },
    { id: 4, name: '文档4', modifyTime: '2023-04-01 12:00:00' },
])

// 新增数据获取逻辑
onMounted(() => {
    // 获取知识库列表
    // fetchKnowledgeBaseList()
})

// // 获取知识库列表
// const fetchKnowledgeBaseList = async () => {
//     try {
//         const res = await getKnowledgeBaseList({ spaceType: 'private' })
//         knowledgeBases.value = res.data || []
//     } catch (error) {
//         console.error('获取知识库列表失败', error)
//     }
// }

// 修改后的点击事件方法
const navigateToKnowledgeBase = (id) => {
    const route = router.resolve({ name: 'KnowledgeBase', params: { id, spaceType: 'private' } })
    window.open(route.href, '_blank')
}

const showDeleteDialog = (item) => {
    deleteDialog.value.showDialog(item)
}

const showCreateDialog = () => {
    createDialog.value.showDialog()
}
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
