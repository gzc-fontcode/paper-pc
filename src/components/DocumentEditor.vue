<template>
    <div class="doc-edit">
        <ToolbarContent v-if="editorInfo.isEditable" />
        <div class="editor-content">
            <editor-content :editor="editor" @contextmenu="handleTableContextMenu" />
            <!-- 表格编辑的弹出框 -->
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
const editorInfo = inject('editorInfo')

console.log(editorInfo,'editorInfo');
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
            pre {
                background: #272c35;
                border-radius: 0.5rem;
                color: #ffffff;
                font-family: 'JetBrainsMono', monospace;
                margin: 1.5rem 0;
                padding: 2.75rem 1rem;

                code {
                    background: none;
                    color: inherit;
                    font-size: 0.8rem;
                    padding: 0;
                }

                /* Code styling */
                .hljs-comment,
                .hljs-quote {
                    color: #616161;
                }

                .hljs-variable,
                .hljs-template-variable,
                .hljs-attribute,
                .hljs-tag,
                .hljs-name,
                .hljs-regexp,
                .hljs-link,
                .hljs-name,
                .hljs-selector-id,
                .hljs-selector-class {
                    color: #f98181;
                }

                .hljs-number,
                .hljs-meta,
                .hljs-built_in,
                .hljs-builtin-name,
                .hljs-literal,
                .hljs-type,
                .hljs-params {
                    color: #fbbc88;
                }

                .hljs-string,
                .hljs-symbol,
                .hljs-bullet {
                    color: #b9f18d;
                }

                .hljs-title,
                .hljs-section {
                    color: #faf594;
                }

                .hljs-keyword,
                .hljs-selector-tag {
                    color: #70cff8;
                }

                .hljs-emphasis {
                    font-style: italic;
                }

                .hljs-strong {
                    font-weight: 700;
                }
            }
            img {
                display: block;
                height: auto;
                margin: 1.5rem 0;
                max-width: 100%;

                &.ProseMirror-selectednode {
                    outline: 3px solid var(--el-link-hover-color);
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
