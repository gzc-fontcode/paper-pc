<template>
    <div class="doc-edit">
        <ToolbarContent />
        <div class="editor-content">
            <editor-content :editor="editor" @contextmenu="handleTableContextMenu" />
            <el-popover
                v-model:visible="popoverVisible"
                trigger="manual"
                placement="top"
                :show-arrow="false"
                popper-class="table-popover document-editor"
                :popper-options="{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 10],
                            },
                        },
                        {
                            name: 'preventOverflow',
                            options: {
                                padding: 10,
                            },
                        },
                        {
                            name: 'flip',
                            options: {
                                padding: 10,
                                behavior: ['top', 'bottom', 'left', 'right'],
                            },
                        },
                    ],
                }"
                :popper-style="{ top: popoverTop + 'px', left: popoverLeft + 'px' }"
            >
                <template #reference>
                    <span :style="{ position: 'absolute', top: 0, left: 0 }"></span>
                </template>
                <!-- 弹出框内容 -->
                <div ref="popoverRef">
                    <el-button @click="addRow(editor, countRow)"
                        >向下插
                        <el-input-number
                            v-model="countRow"
                            :min="1"
                            :max="10"
                            size="small"
                            :controls="false"
                            @click.stop
                        />
                        入行</el-button
                    >

                    <el-button @click="addColumn(editor, countColumn)"
                        >向右插
                        <el-input-number
                            v-model="countColumn"
                            :min="1"
                            :max="10"
                            size="small"
                            :controls="false"
                            @click.stop
                        />
                        入列</el-button
                    >
                    <el-button @click="deleteRow(editor)">删除所选行</el-button>
                    <el-button @click="deleteColumn(editor)">删除所选列</el-button>
                </div>
            </el-popover>
        </div>
    </div>
</template>

<script setup>
import { inject, ref, useTemplateRef } from 'vue'
import { EditorContent } from '@tiptap/vue-3'
import ToolbarContent from '@/components/ToolbarContent.vue'
import { addRow, deleteRow, addColumn, deleteColumn } from '@/utils/editorUtils'

const popoverVisible = ref(false)
const popoverRef = useTemplateRef('popoverRef')
const popoverLeft = ref(0)
const popoverTop = ref(0)
const countRow = ref(1)
const countColumn = ref(1)

const handleTableContextMenu = (event) => {
    const nodeName = event.target.parentNode.nodeName
    if (nodeName === 'TH' || nodeName === 'TD') {
        event.preventDefault()
        popoverLeft.value = event.clientX + 10
        // 获得弹出框的高度
        const popoverHeight = popoverRef.value.childNodes.length * 36
        popoverTop.value = event.clientY - popoverHeight

        popoverVisible.value = true
    }
}

const editor = inject('editor')
</script>

<style lang="scss" scoped>
.doc-edit {
    display: flex;
    flex-direction: column;
    .editor-content {
        padding: 0 10px;
        height: calc(100vh - 120px);
        overflow-y: scroll;
        /* 消除编辑器边框 */
        :deep(div.ProseMirror-focused) {
            outline: none;
            border: none;
            box-shadow: none;
        }
        :deep(.tiptap) {
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                th,
                td {
                    border: 1px solid #ccc;
                    padding: 10px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                }

                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }

                tr:hover {
                    background-color: #eaeaea;
                }
            }
        }
    }
}
</style>
<style lang="scss">
.table-popover.document-editor {
    // height: 100px;
    padding: 5px 0;
    width: 300px;
    button {
        width: 100%;
        margin: 0;
        border-radius: 0;
        border: none;
        .el-input-number {
            margin: 0 5px;
            width: 40px;
            height: 18px;
            .el-input__wrapper {
                padding: 0 !important;
            }
        }
    }
}
</style>
