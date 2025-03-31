<template>
    <div class="doc-edit">
        <ToolbarContent />
        <editor-content :editor="editor" />
    </div>
</template>

<script setup>
import { inject } from 'vue';
import { EditorContent } from '@tiptap/vue-3';
import ToolbarContent from '@/components/ToolbarContent.vue';

const editor = inject('editor');
</script>

<style lang="scss" scoped>
.doc-edit {
    display: flex;
    flex-direction: column;
    /* 消除编辑器边框 */
    :deep(div.ProseMirror-focused) {
        outline: none;
        border: none;
        box-shadow: none;
    }
}
</style>
