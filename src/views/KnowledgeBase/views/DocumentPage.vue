<template>
    <div class="document-page">
        <DocumentHeader
            :document="document"
            :isEditable="isEditable"
            :toggleEditable="toggleEditable"
        />
        <!-- 这里可以显示文档的具体内容 -->
        <div class="doc-body">
            <DocumentEditor :document="document" :isEditable="isEditable" />
        </div>
    </div>
</template>

<script setup>
import { provide, ref, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Blockquote from '@tiptap/extension-blockquote'
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import DocumentHeader from '../../../components/DocumentHeader.vue'
import DocumentEditor from '@/components/DocumentEditor.vue'
import { getSelectedTextAttributes } from '@/utils/editorUtils'
import { debounce } from '@/utils/utils'

const route = useRoute()

// 创建一个响应式的变量来跟踪编辑器的可编辑状态
const isEditable = ref(false)
// 切换编辑器的可编辑状态
const toggleEditable = () => {
    isEditable.value = !isEditable.value
}
// 模拟文档数据
const document = ref({
    id: route.params.documentId,
    label: `文档 ${route.params.documentId}`,
    content: '<p>Hello, Tiptap!</p>',
    date: '2024-01-01 00:00',
})

// 创建一个响应式的编辑器实例
const editor = new Editor({
    // 使用StarterKit扩展
    extensions: [StarterKit, Underline, Link, Blockquote, Superscript, Subscript],
    // 初始内容
    content: document.value.content,
    // 初始设置为不可编辑
    editable: isEditable.value,
    onSelectionUpdate: debounce(({ editor }) => {
        const attributes = getSelectedTextAttributes(editor)
        console.log('attributes', attributes) 
    }, 300)
})

// 监听isEditable属性的变化，动态更新编辑器的可编辑状态
watch(
    () => isEditable.value,
    (newValue) => {
        // 编辑状态转为false时，保存当前内容
        if (newValue === false) {
            // 保存当前内容
            document.value.content = editor.getHTML()
            console.log('保存成功', document.value.content)
        } else {
            editor.commands.focus()
        }
        // 更新编辑器的可编辑状态
        editor.setEditable(newValue)
    }
)

// 监听路由变化，手动触发组件重新渲染
watch(
    () => route.params.documentId,
    (newId) => {
        document.value.id = newId
        document.value.label = `文档 ${newId}`
    }
)

// 在组件卸载时销毁编辑器实例
onUnmounted(() => {
    editor.destroy()
})

provide('editor', editor)
</script>

<style lang="scss" scoped>
.document-page {
    width: calc(100% - 260px);
    background-color: #ffffff;
    border-left: 2px solid rgba(0, 0, 0, 0.04);
    .doc-body {
        padding: 52px 20px 0;
        min-height: 100vh;
    }
}
</style>
