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
      component: Login,
      beforeEnter(to, from, next) {
        if (document.cookie.indexOf("auth=ok") > -1) {
          next("/");
        }
        next();
      }
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
