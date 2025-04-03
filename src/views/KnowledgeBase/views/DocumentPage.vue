<template>
    <div class="document-page">
        <DocumentHeader
            :document="document"
            :isEditable="editorInfo.isEditable"
            :toggleEditable="toggleEditable"
        />
        <!-- 这里可以显示文档的具体内容 -->
        <div class="doc-body">
            <DocumentEditor :document="document" :isEditable="editorInfo.isEditable" />
        </div>
    </div>
</template>

<script setup>
import { provide, ref, watch, onUnmounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { Editor, VueNodeViewRenderer } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Blockquote from '@tiptap/extension-blockquote'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import TextStyle from '@tiptap/extension-text-style'
import Bold from '@tiptap/extension-bold'
import { Color } from '@tiptap/extension-color'
import Document from '@tiptap/extension-document'
import { FontFamily } from '@tiptap/extension-font-family'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import Table from '@tiptap/extension-table'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import CodeBlock from '@tiptap/extension-code-block'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import DocumentHeader from '../../../components/DocumentHeader.vue'
import DocumentEditor from '@/components/DocumentEditor.vue'
import CodeBlockComponent from '@/components/CodeBlockComponent.vue'
import { debounce } from '@/utils/utils'
import { getNodeInfo } from '@/utils/editorUtils'

const lowlight = createLowlight(all)

// you can also register languages
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

const route = useRoute()

// 编辑器的一些信息
const editorInfo = reactive({
    // 是否可编辑
    isEditable: false,
    // 当前选中文本的样式信息
    nodeInfo: {
        // 节点类型，如 'paragraph', 'heading' 等
        nodeType: '',
    },
})
// 切换编辑器的可编辑状态
const toggleEditable = () => {
    editorInfo.isEditable = !editorInfo.isEditable
}
// 模拟文档数据
const document = ref({
    id: route.params.documentId,
    label: `文档 ${route.params.documentId}`,
    content: `
        <p><span>This has a &lt;span&gt; tag without a style attribute, so it’s thrown away.</span></p>
        <p><span style="">But this one is wrapped in a &lt;span&gt; tag with an inline style attribute, so it’s kept - even if it’s empty for now.</span></p>


        <p>--- merge nested span styles option enabled ---</p>

        <p>
          <span style="color: #FF0000;">
            <span style="font-family: serif;">
              red serif
            </span>
          </span>
        </p>

        <p>
          <span style="color: #FF0000;">
            <span style="font-family: serif;">
              <span style="color: #0000FF;">
                blue serif
              </span>
            </span>
          </span>
        </p>

        <p>
          <span style="color: #00FF00;">
            <span style="font-family: serif;">green serif </span>
            <span style="font-family: serif;color: #ff0000;">red serif</span>
          </span>
        </p>

        <p>
          <span>
            plain
            <span style="color: #0000FF;">blue</span>
            plain
            <span style="color: #00FF00;">
              green
              <span style="font-family: serif;">green serif</span>
            </span>
            plain
          </span>
        </p>

        <p>
            <span style="color: #0000FF;">
              blue
              <span style="color: #00FF00;">
                green
                <span style="font-family: serif;">
                  green serif
                  <span style="color: #0000FF;">blue serif</span>
                </span>
              </span>
            </span>
        </p>

        <p>
          <strong>
            strong
            <span style="color: #0000FF;">
              <strong>
                strong blue
                <span style="font-size: 24px;font-family: serif;">strong blue serif </span>
                <span style="color: #00FF00;">
                  strong green
                  <span style="font-family: serif;">strong green serif</span>
                </span>
              </strong>
            </span>
          </strong>
        </p>
        <table style="min-width: 75px"><colgroup><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"></colgroup><tbody><tr><td colspan="1" rowspan="1"><p>123</p></td><td colspan="1" rowspan="1"><p>789</p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td></tr><tr><td colspan="1" rowspan="1"><p>456</p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td></tr><tr><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td><td colspan="1" rowspan="1"><p><br class="ProseMirror-trailingBreak"></p></td></tr></tbody></table>
      `,
    date: '2024-01-01 00:00',
})

// 防抖函数加工，获取节点信息
const getNodeInfoDebounce = debounce(({ editor }) => {
    // 获取当前节点信息
    editorInfo.nodeInfo.nodeType = getNodeInfo(editor)
}, 300)

// 创建一个响应式的编辑器实例
const editor = new Editor({
    // 使用StarterKit扩展
    extensions: [
        StarterKit,
        Underline,
        Link,
        Blockquote,
        Superscript,
        Subscript,
        TextStyle.configure({ mergeNestedSpanStyles: true }),
        Bold,
        Color,
        Document,
        FontFamily,
        Paragraph,
        Text,
        Heading,
        Table,
        TableHeader,
        TableRow,
        TableCell,
        CodeBlockLowlight
          .extend({
            addNodeView() {
              return VueNodeViewRenderer(CodeBlockComponent)
            },
          })
          .configure({ lowlight }),
    ],
    // 初始内容
    content: document.value.content,
    // 初始设置为不可编辑
    editable: editorInfo.isEditable,
    onSelectionUpdate: getNodeInfoDebounce,
    onFocus: getNodeInfoDebounce,
})

// 监听isEditable属性的变化，动态更新编辑器的可编辑状态
watch(
    () => editorInfo.isEditable,
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
provide('editorInfo', editorInfo)
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
