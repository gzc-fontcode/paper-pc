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
        editor.chain().focus().toggleBlockquote().run();
    }
};

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
        editor.chain().focus().setHorizontalRule().run();
    }
};

// 切换上标
export const toggleSuperscript = (editor) => {
    if (editor) {
        editor.chain().focus().toggleSuperscript().run();
    }
};

// 切换下标
export const toggleSubscript = (editor) => {
    if (editor) {
        editor.chain().focus().toggleSubscript().run();
    }
};

// 获取选中部分文本的属性
export const getSelectedTextAttributes = (editor) => {
    if (editor) {
        const { state } = editor;
        const { selection } = state;
        const { from, to } = selection;
        console.log(selection, 'selection');
        
        if (from === to) {
            return null;
        }
        
        const startPos = state.doc.resolve(from);
        const endPos = state.doc.resolve(to);
        
        const marks = [];
        let fontSize = null;
        startPos.marks().forEach((mark) => {
            marks.push({ type: mark.type.name, attrs: mark.attrs });
            if (mark.type.name === 'fontSize') {
                fontSize = mark.attrs.size;
            }
        });
        const node = startPos.parent;
        const nodeType = node.type.name;
        const nodeAttrs = node.attrs;
        return {
            marks,
            nodeType,
            nodeAttrs,
            fontSize
        };
    }
    return null;
};