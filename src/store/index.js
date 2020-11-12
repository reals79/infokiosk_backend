import Vue from "vue";
import Vuex from "vuex";

import { auth } from "./modules/auth";
import { dashboard } from "./modules/dashboard";
import { slideshow } from "./modules/slideshow";
import { department } from "./modules/department";
import { category } from "./modules/category";
import { employee } from "./modules/employee";
import { document } from "./modules/document";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    message: ""
  },
  mutations: {},
  actions: {},
  getters: {
    getLoading: state => state.loading
  },
  modules: {
    auth,
    dashboard,
    slideshow,
    department,
    category,
    employee,
    document,
  }
});
