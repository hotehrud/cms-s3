import createS3 from "@/s3";
let s3;
let bucket_name = "BUCKET_NAME";

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
  renameFile({ commit }, data) {
    let old = data.old;
    let key = data.key;
    let callback = data.callback;

    let params = {
      Bucket: bucket_name,
      CopySource: bucket_name + "/" + old,
      Key: key
    };

    s3 = s3 || createS3();
    s3.renameFile(params, callback);
  },
  deleteFile({ commit }, data) {
    let key = data.path;
    let callback = data.callback;

    let params = {
      Bucket: bucket_name,
      Key: key
    };

    s3 = s3 || createS3();
    s3.deleteFile(params, callback);
  },
  deleteFolder({ commit }, data) {
    let key = data.path;
    let callback = data.callback;

    let params = {
      Bucket: bucket_name,
      Prefix: key
    };

    s3 = s3 || createS3();
    s3.deleteFolder(params, callback);
  },
  createFolder({ commit }, data) {
    let key = data.path;
    let callback = data.callback;

    let params = {
      Bucket: bucket_name,
      Key: key
    };

    s3 = s3 || createS3();
    s3.createFolder(params, callback);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
