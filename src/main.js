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
  if (requiresAuth && document.cookie.indexOf("auth=ok") < 0) {
    next("/login");
  } else {
    next();
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
