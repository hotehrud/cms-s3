<template>
  <div id="app">
    <header-nav/>
    <section id="sidebar">
      <tree-view :label="tree.label" :nodes="tree.nodes" :depth="0" :path="tree.path" :type="tree.type" class="tree_container" />
      <div class="loading-area" v-if="isTree">
        <loading-view />
      </div>
    </section>
    <section id="body">
      <div class="loading-area" v-if="isLoading">
        <loading-view :spotStyle="loadingSpot" :textStyle="loadingText" />
      </div>
      <transition appear name="slide-fade" mode="out-in">>
        <router-view/>
      </transition>
    </section>
    <setting-box />
  </div>
</template>

<script>
import Vue from "vue";
import TreeView from "@/components/Tree";
import HeaderNav from "@/components/Header";
import LoadingView from "@/components/shared-components/Loading";
import DragAndDrop from "@/components/shared-components/DragAndDrop";
import Upload from "@/components/shared-components/Upload";
import Reset from "@/components/shared-components/Reset";
import Download from "@/components/shared-components/Download";
import Setting from "@/components/shared-components/Setting";

Vue.component("LoadingView", LoadingView);
Vue.component("DragAndDrop", DragAndDrop);
Vue.component("UploadBtn", Upload);
Vue.component("ResetBtn", Reset);
Vue.component("DownloadBtn", Download);
Vue.component("SettingBox", Setting);

export default {
  name: "App",
  components: {
    TreeView,
    HeaderNav
  },
  data() {
    return {
      loadingText: {
        fontSize: "2rem",
        fontWeight: "bold"
      },
      loadingSpot: {
        width: "16px",
        height: "16px"
      },
      isTree: true
    };
  },
  mounted() {
    window.addEventListener("click", () => {
      this.$store.dispatch("closeSetting");
    });
  },
  async created() {
    this.$store.dispatch("createS3", {
      id: "CLIENT_ID",
      ps: "CLIENT_SECRET"
    });
    await this.$store.dispatch("getTree");
  },
  computed: {
    tree() {
      return this.$store.getters.tree;
    },
    isLoading() {
      return this.$store.getters.loading;
    }
  },
  watch: {
    $route(to) {
      if (to.name === "Index") {
        this.$store.dispatch("clearPath");
      }
    },
    tree() {
      setTimeout(() => {
        this.isTree = false;
      }, 500);
    }
  }
};
</script>

<style lang="scss">
*,
:after,
:before {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
body,
html {
  width: 100%;
  height: 100%;
  background-color: #eee;
}
html {
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 16px;
}
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}

h1,
h2,
h3,
h4 {
  margin: 0;
}

ul,
li {
  padding: 0;
  margin: 0;
}

svg {
  fill: #fff;
}

.span-alert {
  font-size: 0.625rem;
  font-weight: bold;
  margin-left: 0.25rem;
  color: red;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  #sidebar {
    position: fixed;
    top: 0;
    padding-top: 3.25rem;
    background-color: #fff;
    width: 25%;
    height: 100%;
    overflow: scroll;
    .tree_container {
      margin: 2rem;
    }
  }
  #body {
    position: absolute;
    top: 3.25rem;
    width: 75%;
    left: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 3.25rem);
  }
  .loading-area {
    position: absolute;
    z-index: 9999;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8);
  }
  li {
    list-style: none;
  }
}
</style>
