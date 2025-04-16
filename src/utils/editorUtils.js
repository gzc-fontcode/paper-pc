import { nextTick } from 'vue';


// 撤销操作
export const undo = (editor) => {
    if (editor) editor.chain().undo().focus().run()
}

// 重做操作
export const redo = (editor) => {
    if (editor) editor.chain().redo().focus().run()
}

// 设置编辑器内容
export const setContent = (editor, content) => {
    if (editor) editor.commands.setContent(content)
}

// 获取编辑器内容
export const getContent = (editor) => {
    if (editor) {
        return editor.getHTML()
    }
    return ''
}

// 清除编辑器内容
export const clearContent = (editor) => {
    if (editor) editor.commands.clearContent()
}

// 加粗文本
export const toggleBold = (editor) => {
    if (editor) editor.chain().focus().toggleBold().run()
}

// 斜体文本
export const toggleItalic = (editor) => {
    if (editor) editor.chain().focus().toggleItalic().run()
}

// 下划线文本
export const toggleUnderline = (editor) => {
    if (editor) editor.chain().focus().toggleUnderline().run()
}

// 删除线文本
export const toggleStrike = (editor) => {
    if (editor) editor.chain().focus().toggleStrike().run()
}

// 插入引用
export const toggleBlockquote = (editor) => {
    if (editor) {
        editor.chain().focus().toggleBlockquote().run()
    }
}

// 插入链接
export const insertLink = (editor, href = '', target = '_blank') => {
    if (editor) {
        // 判断当前是否有选中文本
        const { from, to } = editor.state.selection
        const isTextSelected = from !== to
        if (!isTextSelected) {
            // 若未选中文本，插入默认文本为“链接”的链接，并将光标定位到“链接”后面
            editor.chain().focus().setLink({ href, target }).insertContent('链接').run()
        } else editor.chain().focus().setLink({ href, target }).run()
    }
}

// 无序列表
export const toggleBulletList = (editor) => {
    if (editor) editor.chain().focus().toggleBulletList().run()
}

// 有序列表
export const toggleOrderedList = (editor) => {
    if (editor) editor.chain().focus().toggleOrderedList().run()
}

// 插入分割线
export const insertHorizontalRule = (editor) => {
    if (editor) {
        editor.chain().focus().setHorizontalRule().run()
    }
}

// 切换上标
export const toggleSuperscript = (editor) => {
    if (editor) {
        editor.chain().focus().toggleSuperscript().run()
    }
}

// 切换下标
export const toggleSubscript = (editor) => {
    if (editor) {
        editor.chain().focus().toggleSubscript().run()
    }
}

// 设置标题
export const setHeading = (editor, level) => {
    if (editor) {
        editor.chain().toggleHeading({ level }).focus().run()
    }
}

// 判断当前节点是正文还是几级标题
export const getNodeInfo = (editor) => {
    if (!editor) {
        return '未知类型'
    }

    const { state } = editor
    const { selection } = state
    const { $from, $to } = selection

    let hasParagraph = false
    let hasHeading = false
    const headingLevels = new Set()

    for (let pos = $from.pos - 1; pos <= $to.pos; pos++) {
        let node = state.doc.nodeAt(pos)
        while (node && node.type.name === 'text') {
            node = state.doc.resolve(pos).parent
        }

        if (node) {
            if (node.type.name === 'heading') {
                headingLevels.add(node.attrs.level)
            } else if (node.type.name === 'paragraph') {
                hasParagraph = true
            }
        }
    }
    const levelsArr = Array.from(headingLevels).sort((a, b) => a - b)
    if (hasParagraph && levelsArr.length > 0) {
        return ''
    } else if (hasParagraph) {
        return '正文'
    } else if (levelsArr.length === 1) {
        const levels = levelsArr.join(', ')
        return `标题 ${levels}`
    }

    return ''
}

// 插入表格的方法
export const insertTable = (editor) => {
    if (editor) {
        editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
    }
}

// 新增行
export const addRow = (editor, count = 1) => {
    if (editor) {
        for (let i = 0; i < count; i++) {
            editor.chain().focus().addRowAfter().run()
        }
    }
}

// 删除行
export const deleteRow = (editor) => {
    if (editor) {
        editor.chain().focus().deleteRow().run()
    }
}

// 新增列
export const addColumn = (editor) => {
    if (editor) {
        editor.chain().focus().addColumnAfter().run()
    }
}

// 删除列
export const deleteColumn = (editor) => {
    if (editor) {
        editor.chain().focus().deleteColumn().run()
    }
}

// 插入代码块的函数
export const insertCodeBlock = (editor) => {
    if (editor) {
        editor.chain().focus().toggleCodeBlock().run()
    }
}

// 删除代码块
export const deleteCodeBlock = (editor) => {
    if (editor) {
        editor.chain().focus().deleteNode('codeBlock').run()
    }
}

// 插入本地图片
export const insertImage = (editor, event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            const src = e.target.result
            editor
                .chain()
                .focus()
                .insertContent({
                    type: 'image',
                    attrs: {
                        src,
                        alt: '插入的图片',
                        title: '插入的图片',
                    },
                })
                .run()
        }
        reader.readAsDataURL(file)
    }
    event.target.value = ''
}

// 粘贴剪切板中的图片
export const handlePaste = (editor, event) => {
    event.preventDefault()
    const items = (event.clipboardData && event.clipboardData.items) || []

    if (items && items.length) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            if (item.type.indexOf('image') !== -1) {
                const blob = item.getAsFile()
                if (blob) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        const src = e.target.result
                            editor
                                .chain()
                                .focus()
                                .insertContent({
                                    type: 'image',
                                    attrs: {
                                        src,
                                        alt: '插入的图片',
                                        title: '插入的图片',
                                    },
                                })
                                .run()
                    }
                    reader.readAsDataURL(blob)
                }
                break
            }
        }
    }
}

// // 获取选中文本的font-size属性值
// export function getSelectedTextFontSize() {
//     const selection = window.getSelection();
//     if (selection && selection.rangeCount > 0) {
//       const range = selection.getRangeAt(0);
//       const startContainer = range.startContainer;
//       let element;
//       if (startContainer.nodeType === Node.TEXT_NODE) {
//         element = startContainer.parentElement;
//       } else {
//         element = startContainer;
//       }

//       // 递归查找font-size属性值
//       function getFontSizeRecursive(el) {
//         if (!el) return '';
//         const computedStyle = window.getComputedStyle(el);
//         const fontSize = computedStyle.fontSize;
//         if (fontSize && fontSize!== 'medium') {
//           return fontSize;
//         }
//         return getFontSizeRecursive(el.parentElement);
//       }

//       if (element) {
//         return getFontSizeRecursive(element);
//       }
//     }
//     return null;
// }

// // 设置字体大小
// export const setFontSize = (editor, fontSize) => {
//     if (editor) {
//         editor.chain().focus().setMark('textStyle', { fontSize }).run();
//     }
// };
