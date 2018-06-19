// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import { sync } from "vuex-router-sync";

import App from "./App";
import store from "./store";
import router from "./router";

sync(store, router);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth) {
    if (
      window.localStorage.getItem("loginKeep") ||
      document.cookie.indexOf("auth=ok") > -1
    ) {
      next();
    } else {
      next("/login");
    }
  } else {
    if (
      window.localStorage.getItem("loginKeep") ||
      document.cookie.indexOf("auth=ok") > -1
    ) {
      next("/");
    } else {
      next();
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  components: { App },
  template: "<App/>"
});
