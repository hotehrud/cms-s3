import s3 from "@/s3";
import config from "@/config/s3";
const BUCKET_NAME = config.BUCKET_NAME;

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
    const data = await s3.getFileBinary({
      Bucket: BUCKET_NAME,
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
