import s3 from "@/s3";
import config from "@/config/s3";
const BUCKET_NAME = config.BUCKET_NAME;
let s3;

const state = {
  _setting: false,
  _type: "",
  _path: "",
  openX: 0,
  openY: 0,
  indent: "",
  prevElement: null
};

const getters = {
  setting(state) {
    return state._setting;
  },
  settingPosition(state) {
    return {
      x: state.openX,
      y: state.openY
    };
  },
  settingInfo(state) {
    return {
      type: state._type,
      path: state._path
    };
  },
  indent() {
    return state.indent;
  },
  settingElement() {
    return state.prevElement;
  }
};

const mutations = {
  showSetting(state, info) {
    state.prevElement = info.el;
    state._setting = true;
    state._type = info.type;
    state._path = info.path;
    state.openX = info.x;
    state.openY = info.y;
    state.indent = info.indent;
  },
  hideSetting(state) {
    state._setting = false;
  },
  clearHover(state) {
    state.prevElement.style.backgroundColor = "";
  },
  reloadSetting() {
    rootAction.dispatch("completed");
    rootAction.dispatch("getTree");
  }
};

const actions = {
  openSetting({ commit }, info) {
    if (state.prevElement) {
      commit("clearHover");
    }

    info.el.style.backgroundColor = "rgba(0, 0, 0, .1)";
    commit("hideSetting");
    setTimeout(() => {
      commit("showSetting", info);
    }, 0);
  },
  closeSetting({ commit }) {
    if (state.prevElement) {
      commit("clearHover");
    }
    commit("hideSetting", false);
  },
  async renameFile({ commit }, data) {
    let old = data.old;
    let key = data.key;

    let params = {
      Bucket: BUCKET_NAME,
      CopySource: BUCKET_NAME + "/" + old,
      Key: key
    };

    await s3.bridge("renameFile", params);
    commit("reloadSetting");
  },
  async deleteFile({ commit }, data) {
    let key = data.path;

    let params = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    await s3.bridge("deleteFile", params);
    commit("reloadSetting");
  },
  async deleteFolder({ commit }, data) {
    let key = data.path;

    let params = {
      Bucket: BUCKET_NAME,
      Prefix: key
    };

    await s3.bridge("deleteFolder", params);
    commit("reloadSetting");
  },
  async createFolder({ commit }, data) {
    let key = data.path;

    let params = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    await s3.bridge("createFolder", params);
    commit("reloadSetting");
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
