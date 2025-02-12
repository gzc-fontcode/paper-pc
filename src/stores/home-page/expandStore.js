// stores/myStore.js
import { defineStore } from 'pinia';

export const useExpandStore = defineStore('expand', {
  state: () => ({
    isExpand: [false,false],
  }),
  actions: {
    setExpand(index) {
      this.isExpand[index] = !this.isExpand[index];
    },
  },
  persist: {
    enabled: true, // 启用持久化
    strategies: [
      {
        key: 'expand', // 自定义存储键
        storage: localStorage, // 使用 localStorage
      },
    ],
  },
});
