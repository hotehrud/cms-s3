import Vue from "vue";
import Router from "vue-router";
import Index from "@/views/Index";
import Preview from "@/views/Preview";
import Error from "@/views/Error";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Index",
      component: Index
    },
    {
      path: "/preview",
      name: "Preview",
      component: Preview
    },
    {
      path: "*",
      name: "Error",
      component: Error
    }
  ],
  mode: "history"
});
