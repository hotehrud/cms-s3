import s3 from "@/s3";

const state = {
  _user: {
    id: ""
  },
  _loginStatus: false,
  _loginMessage: ""
};

const getters = {
  user() {
    return state._user;
  },
  loginMessage() {
    return state._loginMessage;
  },
  loginStatus() {
    return state._loginStatus;
  }
};

const mutations = {
  loginMessage(state, msg) {
    state._loginMessage = msg;
  },
  loginStatus(state, status) {
    state._user = status.user;
    state._loginStatus = status.isLogin;
  }
};

const actions = {
  async loginUser({ commit }, info) {
    let username = info.id;
    let password = info.ps;
    let status = false;

    const response = await s3.login(username, password);
    response.id = username;
    if (response.code === 400) {
      commit("loginMessage", response.msg);
    } else {
      status = true;
      commit("loginMessage", response);
    }
    commit("loginStatus", {
      isLogin: status,
      user: {
        id: username
      }
    });
  },
  logoutUser({ commit }) {
    s3.logout();
    commit("loginStatus", {
      isLogin: false,
      user: null
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
