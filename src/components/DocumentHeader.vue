<template>
    <div class="header">
        <div class="doc-head-inner">
            <div class="doc-head-left">
                <div class="doc-head-title">
                    <span>{{ document.label }}</span>
                </div>
            </div>
            <div class="doc-head-right">
                <div class="doc-head-actions">
                    <div v-if="!isEditable">
                        <el-button type="primary" class="edit" @click="toggleEditable">编辑</el-button>
                    </div>
                    <div v-else>
                        <el-button class="save" @click="toggleEditable">更新</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    document: {
        type: Object,
        required: true,
    },
    isEditable: {
        type: Boolean,
        required: true, 
    },
    toggleEditable: {
        type: Function,
        required: true,
    },
})
</script>

<style lang="scss" scoped>
.header {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 260px;
    right: 0;
    height: 52px;
    width: auto;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    transform: translateY(0);
    transition: transform 0.2s ease 0.2s, left 0.2s cubic-bezier(0.1, 0, 0, 1) 0s;
    will-change: transform, left;
    font-size: 14px;
    padding: 0 10px;
    .doc-head-inner {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        .doc-head-left {
            display: flex;
            align-items: center;
            .doc-head-title {
                display: flex;
                align-items: center;
                font-size: 16px;
                color: #585a5a;
            }
        }
        .doc-head-right {
            display: flex;
            align-items: center;
            .doc-head-actions {
                display: flex;
                align-items: center;
            }
            .doc-head-actions {
                .el-button {
                    margin-right: 10px;
                    height: 28px;
                    padding: 0px 10px;
                    font-size: 14px;
                }
                .edit {
                    background-color: #00b96b;
                }
            }
        }
    }
}
</style>
