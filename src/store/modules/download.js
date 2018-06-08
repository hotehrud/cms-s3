import createS3 from "@/s3";
let s3;
let bucket_name = "BUCKET_NAME";

const state = {
  _blobURL: ""
};

const getters = {
  blobURL() {
    return state._blobURL;
  }
};

const mutations = {
  toBlob(state, url) {
    state._blobURL = url;
  }
};

const actions = {
  async download({ commit }) {
    s3 = s3 || createS3();
    const data = await s3.getFileBinary({
      Bucket: bucket_name,
      Key: null
    });
    const blob = new Blob([data.Body], {
      type: data.ContentType
    });
    const blobURL = URL.createObjectURL(blob);
    commit("toBlob", blobURL);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
