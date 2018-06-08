/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import tree from "./modules/tree";
import loading from "./modules/loading";
import upload from "./modules/upload";
import setting from "./modules/setting";
import download from "./modules/download";

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    tree,
    loading,
    upload,
    setting,
    download
  },
  strict: debug
});
