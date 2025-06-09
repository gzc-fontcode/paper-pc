<template>
    <div class="cooperativework-page">
        <div class="header">
            <div class="person">
                <span>当前编辑人：</span>
                <span class="list" v-for="p in editingUsersList">{{ p }}</span>
            </div>
            <div class="action">
                <el-button type="primary" class="" @click="saveAndExit">保存并退出</el-button>
            </div>
        </div>
        <div class="edit">
            <DocumentEditor
                :document="document"
                :isEditable="editorInfo.isEditable"
                @paste="handlePaste(editor, $event)"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, provide, effect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { handlePaste } from '@/utils/editorUtils'
import DocumentEditor from '@/components/DocumentEditor.vue'
import { useRichTextEditor } from '@/hooks/useRichTextEditor'

// 使用自定义 hook
const { editorInfo, toggleEditable, document, editor } = useRichTextEditor()
// 获取路由参数
const route = useRoute()
const { documentId } = route.params
const router = useRouter()
// 获取当前用户名
const currentUsername = localStorage.getItem('userId')

const currentFileId = documentId

let editingUsersList = ref([])

let socket = null

toggleEditable()

// 连接WebSocket
function connectWebSocket() {
    // 如果已经有连接，先关闭
    if (socket) {
        socket.close()
    }

    // 创建新连接，添加fileId参数
    socket = new WebSocket(`ws://47.109.72.203:20000/doc?fileId=${currentFileId}`)

    socket.onopen = function () {
        //用户创建登陆了
        socket.send(
            JSON.stringify({
                type: 'connect',
                username: currentUsername,
                fileId: currentFileId,
            })
        )

        //获取当前文本同时编辑的用户
        socket.send(
            JSON.stringify({
                type: 'getUser',
                fileId: currentFileId,
            })
        )
    }

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data)

        if (data === null || typeof data.type === 'undefined') {
            console.log('data:' + data)
            return
        }

        // 只处理当前文件的消息
        if (data.fileId && data.fileId !== currentFileId) {
            return
        }

        switch (data.type) {
            case 'update':
                if (data.content !== editor.getHTML()) {
                    document.value.content = data.content
                    editor.commands.setContent(data.content)
                }
                break
            case 'editing':
                editingUsersList.value = data.editingUsers
                break
        }
    }

    socket.onclose = function () {
        console.log('WebSocket连接已关闭')
    }

    socket.onerror = function (error) {
        console.error('WebSocket错误:', error)
    }
}
connectWebSocket()

// 保存并退出处理函数
const saveAndExit = async () => {
    try {
        socket?.send(
            JSON.stringify({
                type: 'stop-editing',
                fileId: currentFileId,
            })
        )
        // 关闭WebSocket连接
        socket?.close()
        // 返回上一页
        router.go(-1)
    } catch (error) {
        console.error('保存并退出出错:', error)
    }
}

setTimeout(() => {
    socket.send(
        JSON.stringify({
            type: 'start-editing',
            fileId: currentFileId,
        })
    )
}, 1000)

// 自定义防抖函数
const debounce = (fn: Function, delay: number) => {
    let timer: NodeJS.Timeout | null = null;
    return (...args: any[]) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

// 监听document.value的变化，发送更新消息，使用防抖函数
const debouncedTransactionHandler = debounce(({ transaction }) => {
    if (transaction.docChanged) {
        const content = editor.getHTML()
        socket.send(
            JSON.stringify({
                type: 'update',
                content,
                fileId: currentFileId,
            })
        )
    }
}, 300); // 可根据实际情况调整防抖延迟时间
// 监听document.value的变化，发送更新消息
editor.on('transaction', debouncedTransactionHandler)

provide('editor', editor)
provide('editorInfo', editorInfo)
provide('document', document)
</script>

<style lang="scss" scoped>
.cooperativework-page {
    width: 100%;
    height: 100vh;
    background-color: #ffffff;
    border-left: 2px solid rgba(0, 0, 0, 0.04);
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        height: 52px;
        border-bottom: 2px solid rgba(0, 0, 0, 0.04);
        .person {
            display: flex;
            align-items: center;
            flex: 1;
            span.list {
                margin-right: 10px;
                font-size: 14px;
                color: #666;
                background-color: #f0f0f0;
                padding: 5px 10px;
                border-radius: 5px;
            }
        }
    }
    .edit {
        padding: 0 20px 0;
        box-sizing: border-box;
    }
}
</style>
