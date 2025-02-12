// stores/home-page/activeMenuStore.js
import { defineStore } from 'pinia';

export const useActiveMenuStore = defineStore('activeMenu', {
  state: () => ({
    activeMenu: 'dashboard',
  }),
  actions: {
    setActiveMenu(menu) {
      console.log(menu);
      this.activeMenu = menu;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'activeMenu',
        storage: localStorage,
      },
    ],
  },
});
