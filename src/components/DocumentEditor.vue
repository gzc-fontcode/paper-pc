<template>
    <editor-content :editor="editor" />
</template>

<script setup>
import { ref, onUnmounted, watch, defineProps, effect } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const { document, isEditable } = defineProps({
    document: {
        type: Object,
        required: true,
    },
    isEditable: {
        type: Boolean,
        required: true,
    },
})

// 创建一个响应式的编辑器实例
const editor = ref(
    new Editor({
        // 使用StarterKit扩展
        extensions: [StarterKit],
        // 初始内容
        content: document.content,
        // 初始设置为不可编辑
        editable: isEditable,
    })
)
// 监听isEditable属性的变化，动态更新编辑器的可编辑状态
watch(
    () => isEditable,
    (newValue) => {
        // 编辑状态转为false时，保存当前内容
        if (newValue === false) {
            // 保存当前内容
            document.content = editor.value.getHTML()
            console.log('保存成功', document.content)
        } else {
            editor.value.commands.focus()
        }
        // 更新编辑器的可编辑状态
        editor.value.setEditable(newValue)
    }
)

// 在组件卸载时销毁编辑器实例
onUnmounted(() => {
    editor.value.destroy()
})
</script>
<style lang="scss" scoped>
/* 消除编辑器边框 */
:deep(div.ProseMirror-focused) {
    outline: none;
    border: none;
    box-shadow: none;
}
</style>
