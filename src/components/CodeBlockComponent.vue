<template>
    <node-view-wrapper class="code-block">
        <el-select
            v-model="selectedLanguage"
            style="width: 120px"
            contenteditable="false"
            size="small"
            filterable
        >
            <el-option
                v-for="(language, index) in languages"
                :key="index"
                :label="language"
                :value="language"
            />
        </el-select>
        <pre><code><node-view-content /></code></pre>
        <!-- 删除按钮 -->
        <el-button
            size="mini"
            type="danger"
            @click="deleteCodeBlock(editor)"
        >
            <el-icon><Delete /></el-icon>
        </el-button>
    </node-view-wrapper>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';
import { deleteCodeBlock } from '@/utils/editorUtils';

// 注入编辑器实例
const editor = inject('editor');

// 定义 props
const props = defineProps(nodeViewProps);

// 获取语言列表
const languages = ref(props.extension.options.lowlight.listLanguages());
console.log('languages', languages.value, typeof languages.value[0]);

// 计算属性 selectedLanguage
const selectedLanguage = computed({
    get() {
        return props.node.attrs.language;
    },
    set(language) {
        props.updateAttributes({ language });
    },
});

</script>

<style lang="scss" scoped>
.code-block {
    position: relative;
    code {
        min-height: 50px;
    }
    .el-select {
        position: absolute;
        background-color: #ffffff;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="Black" d="M7 10l5 5 5-5z"/></svg>');
        right: 0.5rem;
        top: 0.5rem;
        border-radius: 0.5rem;
    }
    .el-button {
        position: absolute;
        right: 0.2rem;
        bottom: 0.2rem;
        background-color: transparent;
        border: none;
        color: red;
    }
}
</style>
