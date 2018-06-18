import s3 from "@/s3";
import config from "@/config/s3";
const BUCKET_NAME = config.BUCKET_NAME;

const state = {
  _file: null
};

const getters = {
  uploadFile(state) {
    return state._file;
  },
  isUploadFile(state) {
    if (state._file) {
      return true;
    } else {
      return false;
    }
  }
};

const mutations = {
  setUploadFile(state, file) {
    state._file = file;
  }
};

const actions = {
  storeFile({ commit }, file) {
    commit("setUploadFile", file);
  },
  resetUploadFile({ commit }) {
    const input = document.getElementById("inputFile");
    if (input && input.value) {
      input.value = "";
    }
    commit("setUploadFile", null);
  },
  async upload({ commit }, data) {
    let body = data.file;
    let key = data.key;
    let type = data.file.type;
    let refresh = data.refresh;
    let multi = data.multi || false;

    let params = {
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: type,
      Body: body
    };

    await s3.bridge("upload", params, refresh);
    if (refresh && !multi) {
      commit("reloadSetting");
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
