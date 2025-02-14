<template>
    <div class="document-page">
        <h1>{{ document.label }}</h1>
        <p>文档 ID: {{ document.id }}</p>
        <p>日期: {{ document.date }}</p>
        <!-- 这里可以显示文档的具体内容 -->
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
// console.log(route, 'route');

const document = ref({
    id: route.params.documentId,
    label: '文档标题',
    date: '2024-01-01 00:00'
});
</script>

<style lang="scss" scoped>
.document-page {
    padding: 20px;
}
</style>