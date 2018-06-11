import createS3 from "@/s3";
import config from "@/config/s3";
const BUCKET_NAME = config.BUCKET_NAME;
let s3;

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
  async upload({commit}, data) {
    let body = data.file;
    let key = data.key;
    let type = data.file.type;
    let newFile = data.first;

    let params = {
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: type,
      Body: body
    };

    s3 = s3 || createS3();
    await s3.bridge("upload", params, newFile);
    if (newFile) {
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
