import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Dashboard from "../views/Dashboard.vue";
import Slideshows from "../views/Slideshows.vue";
import Departments from "../views/Departments.vue";
import Categories from "../views/Categories.vue";
import Employees from "../views/Employees.vue";
import Documents from "../views/Documents.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/slideshows",
    name: "Slideshows",
    component: Slideshows
  },
  {
    path: "/departments",
    name: "Departments",
    component: Departments
  },
  {
    path: "/categories",
    name: "Categories",
    component: Categories
  },
  {
    path: "/employees",
    name: "Employees",
    component: Employees
  },
  {
    path: "/documents",
    name: "Documents",
    component: Documents
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import("../views/Login.vue"),
    meta: {
      isPublic: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => !record.meta.isPublic)) {
    if (store.state.auth.status.loggedIn) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

export default router;
