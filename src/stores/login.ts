import { defineStore } from "pinia";

export const useLoginStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
  }),

  getters: {
    getAuthenticated: (state) => {
      return state.isAuthenticated;
    },
  },

  actions: {
    setAuthenticated(isAuth: boolean) {
      this.isAuthenticated = isAuth;
    },
  },
});
