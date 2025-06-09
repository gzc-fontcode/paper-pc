<template>
    <div class="document-page">
        <DocumentHeader
            :document="document"
            :isEditable="editorInfo.isEditable"
            :toggleEditable="toggleEditable"
        />
        <!-- 这里可以显示文档的具体内容 -->
        <div class="doc-body">
            <DocumentEditor
                :document="document"
                :isEditable="editorInfo.isEditable"
                @paste="handlePaste(editor, $event)"
            />
        </div>
    </div>
</template>

<script setup>
import { provide } from 'vue'
import { handlePaste } from '@/utils/editorUtils'
import DocumentHeader from '../../../components/DocumentHeader.vue'
import DocumentEditor from '@/components/DocumentEditor.vue'
import { useRichTextEditor } from '@/hooks/useRichTextEditor'

// 使用自定义 hook
const { editorInfo, toggleEditable, document, editor } = useRichTextEditor()

provide('editor', editor)
provide('editorInfo', editorInfo)
provide('document', document)

</script>

<style lang="scss" scoped>
.document-page {
    width: calc(100% - 260px);
    background-color: #ffffff;
    border-left: 2px solid rgba(0, 0, 0, 0.04);
    .doc-body {
        padding: 52px 20px 0;
        height: 100vh;
        box-sizing: border-box;
    }
}
</style>
