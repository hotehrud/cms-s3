import createS3 from "@/s3";
let s3;
let bucket_name = "BUCKET_NAME";

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
  async upload({}, data) {
    let body = data.file;
    let key = data.key;
    let type = data.file.type;
    let callback = data.callback;

    let params = {
      Bucket: bucket_name,
      Key: key,
      ContentType: type,
      Body: body
    };

    s3 = s3 || createS3();
    await s3.upload(params, callback);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
