import Vue from "vue";
import Router from "vue-router";
import Index from "@/views/Index";
import Preview from "@/views/Preview";
import Login from "@/views/Login";
import Error from "@/views/Error";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Index",
      component: Index,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/preview",
      name: "Preview",
      component: Preview,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "*",
      name: "Error",
      component: Error,
      meta: {
        requiresAuth: true
      }
    }
  ],
  mode: "history"
});
