<template>
    <div class="toolbar-content">
        <div class="toolbar-btn">
            <el-icon class="plus-action"><CirclePlusFilled /></el-icon>
        </div>
        <el-tooltip :show-arrow="false" effect="customized" placement="bottom">
            <template #content>
                撤 销<br />
                Ctrl Z
            </template>
            <div class="toolbar-btn" @click="undo(editor)">
                <i class="iconfont icon-undo"></i>
            </div>
        </el-tooltip>
        <el-tooltip :show-arrow="false" effect="customized" placement="bottom">
            <template #content>
                重 做<br />
                <i class="iconfont icon-shift"></i> Ctrl Z
            </template>
            <div class="toolbar-btn" @click="redo(editor)">
                <i class="iconfont icon-redo"></i>
            </div>
        </el-tooltip>
        <el-tooltip :show-arrow="false" effect="customized" placement="bottom">
            <template #content>
                粗 体<br />
                Ctrl B
            </template>
            <div class="toolbar-btn" @click="toggleBold(editor)">
                <i class="iconfont icon-bold"></i>
            </div>
        </el-tooltip>
        <el-tooltip :show-arrow="false" effect="customized" placement="bottom">
            <template #content>
                斜 体<br />
                Ctrl I
            </template>
            <div class="toolbar-btn" @click="toggleItalic(editor)">
                <i class="iconfont icon-italic"></i>
            </div>
        </el-tooltip>
        <el-tooltip :show-arrow="false" effect="customized" placement="bottom">
            <template #content>
                删除线<br />
                <i class="iconfont icon-shift"></i> Ctrl X
            </template>
            <div class="toolbar-btn" @click="toggleStrike(editor)">
                <i class="iconfont icon-strikethrough"></i>
            </div>
        </el-tooltip>
        <el-tooltip :show-arrow="false" effect="customized" placement="bottom">
            <template #content>
                下划线<br />
                Ctrl U
            </template>
            <div class="toolbar-btn" @click="toggleUnderline(editor)">
                <i class="iconfont icon-underline"></i>
            </div>
        </el-tooltip>
        <el-tooltip :show-arrow="false" effect="customized" placement="bottom">
            <template #content>
                上 标<br />
                <i class="iconfont icon-shift"></i> Ctrl .
            </template>
            <div class="toolbar-btn" @click="toggleSuperscript(editor)">
                <i class="iconfont icon-shangbiao2"></i>
            </div>
        </el-tooltip>
        <el-tooltip :show-arrow="false" effect="customized" placement="bottom">
            <template #content>
                下 标<br />
                <i class="iconfont icon-shift"></i> Ctrl ,
            </template>
            <div class="toolbar-btn" @click="toggleSubscript(editor)">
                <i class="iconfont icon-xiabiao2"></i>
            </div>
        </el-tooltip>
        <el-tooltip :show-arrow="false" effect="customized" placement="bottom">
            <template #content>
                无序列表<br />
                <i class="iconfont icon-shift"></i> Ctrl 8
            </template>
            <div class="toolbar-btn" @click="toggleBulletList(editor)">
                <i class="iconfont icon-list-disorder"></i>
            </div>
        </el-tooltip>
        <el-tooltip :show-arrow="false" effect="customized" placement="bottom">
            <template #content>
                有序列表<br />
                <i class="iconfont icon-shift"></i> Ctrl 7
            </template>
            <div class="toolbar-btn" @click="toggleOrderedList(editor)">
                <i class="iconfont icon-list-order"></i>
            </div>
        </el-tooltip>
        <el-tooltip :show-arrow="false" effect="customized" placement="bottom">
            <template #content>
                插入引用<br />
                <i class="iconfont icon-shift"></i> Ctrl U
            </template>
            <div class="toolbar-btn" @click="toggleBlockquote(editor)">
                <i class="iconfont icon-shuangyinhaozuo"></i>
            </div>
        </el-tooltip>
        <el-tooltip :show-arrow="false" effect="customized" placement="bottom">
            <template #content>
                插入分割线<br />
                Alt Ctrl S
            </template>
            <div class="toolbar-btn" @click="insertHorizontalRule(editor)">
                <i class="iconfont icon-fengefu"></i>
            </div>
        </el-tooltip>
        <el-tooltip :show-arrow="false" effect="customized" placement="bottom">
            <template #content>
                插入链接<br />
                Ctrl K
            </template>
            <div class="toolbar-btn" @click="insertLink(editor)">
                <i class="iconfont icon-link"></i>
            </div>
        </el-tooltip>
    </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { CirclePlusFilled } from '@element-plus/icons-vue'
import {
    undo,
    redo,
    toggleBold,
    toggleItalic,
    toggleStrike,
    toggleUnderline,
    insertLink,
    toggleBulletList,
    toggleOrderedList,
    toggleBlockquote,
    insertHorizontalRule,
    toggleSuperscript,
    toggleSubscript,
} from '@/utils/editorUtils'

// 注入编辑器实例
const editor = inject('editor')

// 存储当前节点类型
const currentNodeType = ref('')
</script>

<style lang="scss" scoped>
.toolbar-content {
    display: flex;
    align-self: center;
    align-items: center;
    margin-bottom: 10px;
    width: calc(100% + 40px);
    height: 42px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.04);
    .toolbar-btn {
        height: 26px;
        margin-left: 10px;
        display: flex;
        align-items: center;
        font-size: 20px;
        padding: 0 3px;
        border-radius: 4px;
        .iconfont {
            font-size: 20px;
        }
        &:hover {
            cursor: pointer;
            background-color: rgba(0, 0, 0, 0.04);
        }
        .plus-action {
            color: #00b96b;
        }
    }
}
</style>
<style lang="scss">
.el-popper.is-customized {
    font-size: 12px;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 600;
    color: #666;
    text-align: center;
    padding: 4px 8px;
    background: linear-gradient(90deg, rgb(127, 189, 254), rgb(164, 200, 162));
    .iconfont {
        font-size: 12px;
    }
}
</style>
