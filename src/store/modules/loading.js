const state = {
  _loading: false,
  _percent: false,
  _progress: 0
};

const getters = {
  loading(state) {
    return state._loading;
  },
  showPercent(state) {
    return state._percent;
  },
  progress() {
    return state._progress;
  }
};

const mutations = {
  loadingStatus(state, data) {
    let flag = data;
    state._percent = false;
    if (typeof data === "object") {
      flag = data.flag;
      state._percent = true;
    }
    state._loading = flag;
  },
  progress(state, n) {
    state._progress = n;
  }
};

const actions = {
  pageMove({ commit }) {
    commit("loadingStatus", true);
  },
  accessFileLoading({ commit }) {
    commit("loadingStatus", true);
  },
  uploadFileLoading({ commit }) {
    commit("loadingStatus", {
      flag: true,
      type: "upload"
    });
  },
  completed({ commit }) {
    setTimeout(() => {
      commit("loadingStatus", false);
    }, 500);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
