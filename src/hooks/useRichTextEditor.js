import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
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
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import { all, createLowlight } from 'lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import CodeBlockComponent from '@/components/CodeBlockComponent.vue'
import { debounce } from '@/utils/utils'
import { getNodeInfo } from '@/utils/editorUtils'
import { getFileInfo, uploadFile, downloadFile, updateFile } from '@/api/file'

export function useRichTextEditor() {
    const lowlight = createLowlight(all)

    // 注册语言
    lowlight.register('html', html)
    lowlight.register('css', css)
    lowlight.register('js', js)
    lowlight.register('ts', ts)

    const route = useRoute()
    console.log(route.params, 'route')
    const isCooperativeWork = route.name === 'DocumentCooperativeWork'

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
        name: '',
        content: ``,
        createTime: null,
        updateTime: null,
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
            Image,
            Dropcursor,
            CodeBlockLowlight.extend({
                addNodeView() {
                    return VueNodeViewRenderer(CodeBlockComponent)
                },
            }).configure({ lowlight }),
        ],
        // 初始内容
        content: document.value.content,
        // 初始设置为不可编辑
        editable: editorInfo.isEditable,
        onSelectionUpdate: getNodeInfoDebounce,
        onFocus: getNodeInfoDebounce,
    })

    // 根据id向后端请求文档内容
    const getDocumentContent = async (id) => {
        // 获取文档信息
        const fileInfoRes = await getFileInfo({ id })
        Object.assign(document.value, fileInfoRes.data[0])
        const res = await downloadFile(id)
        if (typeof res === 'string') {
            // 更新编辑器内容
            document.value.content = res
            editor.commands.setContent(res)
            return
        }
    }

    // 获取编辑器内容并上传到后端
    const saveDocumentContent = async () => {
        // 获取编辑器内容
        const content = editor.getHTML()
        // 将content转formData
        const formData = new FormData()
        formData.append('json', JSON.stringify(content))
        formData.append('id', document.value.id)
        // 上传到后端
        const uploadRes = await updateFile(formData)
    }

    // 监听isEditable属性的变化，动态更新编辑器的可编辑状态
    watch(
        () => editorInfo.isEditable,
        (newValue) => {
            // 编辑状态转为false时，保存当前内容
            if (newValue === false) {
                // 保存当前内容
                document.value.content = editor.getHTML()
                // 保存文档内容到后端
                saveDocumentContent()
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
    if (!isCooperativeWork) {
        // 监听document.id的变化，获取文档内容
        watch(
            () => document.value.id,
            (newId) => {
                getDocumentContent(newId)
            }
        )

        // 在组件挂载时获取文档内容
        onMounted(() => {
            getDocumentContent(document.value.id)
        })
    }

    // 在组件卸载时销毁编辑器实例
    onUnmounted(() => {
        editor.destroy()
    })

    return {
        editorInfo,
        toggleEditable,
        document,
        editor,
    }
}
