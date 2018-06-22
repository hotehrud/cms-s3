import s3 from "@/s3";
import config from "@/config/s3";
const BUCKET_NAME = config.BUCKET_NAME;
const RESOURCE_DIR = config.RESOURCE_DIR;

const state = {
  _tree: {},
  _focus: {
    path: "",
    extensions: ""
  },
  _file: {
    url: ""
  }
};

const getters = {
  tree(state) {
    return state._tree;
  },
  currentPath(state) {
    return state._focus.path;
  },
  currentExtensions(state) {
    return state._focus.extensions;
  },
  filePath(state) {
    return state._file.url;
  }
};

const mutations = {
  setTree(state, tree) {
    state._tree = tree;
  },
  setCurrentType(state, type) {
    if (type) {
      state._focus.path = type.path;
      state._focus.extensions = type.extensions;
    } else {
      state._focus = {
        path: "",
        extensions: ""
      };
    }
  },
  fileURL(state, url) {
    state._file.url = url;
  }
};
const actions = {
  clearPath({ commit }) {
    commit("setCurrentType");
  },
  async getTree({ commit }) {
    let lists = [];
    await s3.bridge(
      "getTreeList",
      {
        Bucket: BUCKET_NAME
      },
      lists
    );
    commit("setTree", listAllKeys(lists));
  },
  async currentPath({ commit }, path) {
    let ext = "." + path.split(".").pop();
    let current = {
      path: path,
      extensions: ext
    };
    commit("setCurrentType", current);
    let url = await s3.bridge("getFileURL", {
      Bucket: BUCKET_NAME,
      Key: path
    });
    commit("fileURL", url);
  }
};

function listAllKeys(lists) {
  let refine = {};

  lists.forEach(p => {
    let part = p.split("/");
    let pointer = refine;
    part.forEach((w, idx) => {
      if (idx === part.length - 1) {
        if (w !== "") {
          pointer[w] = "";
        }
      } else {
        if (pointer[w] === undefined) {
          pointer[w] = {};
        }

        pointer = pointer[w];
      }
    });
  });

  function objectToObj(obj, parent) {
    let array = [];
    let path = parent || "";
    Object.keys(obj).forEach(k => {
      let v = obj[k];
      let temp = path ? path + "/" + k : k;

      if (v === "") {
        array.push({
          path: temp,
          label: k,
          type: "file"
        });
      } else {
        array.push({
          path: temp,
          label: k,
          type: "folder",
          nodes: objectToObj(v, temp)
        });
      }
    });

    // Order, file -> folder
    let len = array.length;
    for (let i = 0; i < len; i++) {
      if (array[i].type === "folder") {
        let v = array.splice(i, 1)[0];
        array.push(v);
        i--;
        len--;
      }
    }
    return array;
  }

  const array = objectToObj(refine);

  for (let idx in array) {
    let item = array[idx];
    if (item.label === RESOURCE_DIR && item.type === "folder") {
      return item;
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
};
