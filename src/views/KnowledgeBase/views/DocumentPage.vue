<template>
    <div class="document-page">
        <DocumentHeader :document="document" :isEditable="isEditable" :toggleEditable="toggleEditable"/>
        <!-- 这里可以显示文档的具体内容 -->
        <div class="doc-body">
            <DocumentEditor :document="document" :isEditable="isEditable" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DocumentHeader from '../../../components/DocumentHeader.vue'
import DocumentEditor from '@/components/DocumentEditor.vue'

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

// 监听路由变化，手动触发组件重新渲染
watch(
    () => route.params.documentId,
    (newId) => {
        document.value.id = newId
        document.value.label = `文档 ${newId}`
    }
)
</script>

<style lang="scss" scoped>
.document-page {
    width: calc(100% - 260px);
    background-color: #ffffff;
    border-left: 2px solid rgba(0, 0, 0, 0.04);
    .doc-body {
        padding-top: 52px;
        min-height: 100vh;
    }
}
</style>
