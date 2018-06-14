<template>
  <div :class="type" class="tree-view">
    <div :style="indent" :class="{focus: isFocus}" class="tree-icon" @mousedown="selectControl" @mouseup="selectResource" contenteditable="false">{{label}}</div>
    <transition-group name="fade">
      <tree-view v-for="(node, index) in nodes" v-if="showChildren" :key="index" :nodes="node.nodes" :label="node.label" :depth="depth + 1" :path="node.path" :type="node.type" />
    </transition-group>
  </div>
</template>

<script>
import { Drop } from "@/mixins/drop";

export default {
  name: "TreeView",
  mixins: [Drop],
  props: {
    label: {
      default: "",
      type: String
    },
    nodes: {
      default: () => [],
      type: Array
    },
    depth: {
      default: 0,
      type: Number
    },
    path: {
      default: "",
      type: String
    },
    type: {
      default: "",
      type: String
    }
  },
  data() {
    return {
      showChildren: true,
      focus: false
    };
  },
  mounted() {
    if (this.type === "folder") {
      this.dropEvent(this.drop);
    } else {
      this.removeDropEvent();
    }
  },
  updated() {
    if (this.type === "folder") {
      this.dropEvent(this.drop);
    } else {
      this.removeDropEvent();
    }
  },
  destroyed() {
    this.removeDropEvent();
  },
  computed: {
    indent() {
      return { transform: `translate(${this.depth * 30}px)` };
    },
    isFocus() {
      let current = this.$store.getters.currentPath;
      if (current && current === this.path) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    selectControl(e) {
      e.stopPropagation();

      if (e.which === 3) {
        if (this.type === "folder") {
          document.querySelectorAll(".dir").forEach(el => {
            el.className = "";
          });

          let sibling = e.target.nextElementSibling;
          sibling.className = "dir";
        }

        this.$store.dispatch("openSetting", {
          el: e.target,
          type: this.type,
          path: this.path,
          indent: e.target.style.transform,
          x: e.pageX,
          y: e.pageY
        });
      }
    },
    selectResource(e) {
      if (e.which === 3) {
        return;
      }
      if (this.type === "file") {
        this.displayPreview();
        return;
      }
      this.showChildren = !this.showChildren;
    },
    async displayPreview() {
      this.$store.dispatch("pageMove");
      await this.$store.dispatch("currentPath", this.path);

      if (this.$route.name !== "Preview") {
        this.$router.push({
          name: "Preview"
        });
      } else {
        this.$store.dispatch("resetUploadFile");
        this.$store.dispatch("completed");
      }
    },
    async drop(input) {
      if (input.files && input.files[0]) {
        const files = input.files;
        const len = files.length;
        let multi = len !== 1;

        this.$store.dispatch("uploadFileLoading");
        for (let i = 0; i < len; i++) {
          const file = files[i];
          if (!file.name.match(/\.(jpg|jpeg|png|gif|mov|mp4|mp3|ogg)$/)) {
            alert("Not supported file type : " + file.name);
          } else {
            await this.$store.dispatch("upload", {
              file: file,
              key: this.path + "/" + file.name,
              refresh: true,
              multi: multi
            });
          }
        }
        this.$store.dispatch("completed");
        this.$store.dispatch("getTree");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tree-icon {
  cursor: pointer;
  display: inline-block;
  padding-right: 0.5rem;
  &:hover {
    color: white;
    background-color: gray;
  }
  &::before {
    margin-right: 0.5rem;
    content: "";
    height: 20px;
    vertical-align: middle;
    width: 20px;
    background-repeat: no-repeat;
    display: inline-block;
  }
}

.file {
  > .tree-icon {
    &::before {
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path fill='lightgrey' d='M85.714,42.857V87.5c0,1.487-0.521,2.752-1.562,3.794c-1.042,1.041-2.308,1.562-3.795,1.562H19.643 c-1.488,0-2.753-0.521-3.794-1.562c-1.042-1.042-1.562-2.307-1.562-3.794v-75c0-1.487,0.521-2.752,1.562-3.794 c1.041-1.041,2.306-1.562,3.794-1.562H50V37.5c0,1.488,0.521,2.753,1.562,3.795s2.307,1.562,3.795,1.562H85.714z M85.546,35.714 H57.143V7.311c3.05,0.558,5.505,1.767,7.366,3.627l17.41,17.411C83.78,30.209,84.989,32.665,85.546,35.714z' /></svg>");
      background-position: center 2px;
      background-size: 60% auto;
    }
  }
}

.folder {
  > .tree-icon {
    &::before {
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path fill='lightblue' d='M96.429,37.5v39.286c0,3.423-1.228,6.361-3.684,8.817c-2.455,2.455-5.395,3.683-8.816,3.683H16.071 c-3.423,0-6.362-1.228-8.817-3.683c-2.456-2.456-3.683-5.395-3.683-8.817V23.214c0-3.422,1.228-6.362,3.683-8.817 c2.455-2.456,5.394-3.683,8.817-3.683h17.857c3.422,0,6.362,1.228,8.817,3.683c2.455,2.455,3.683,5.395,3.683,8.817V25h37.5 c3.422,0,6.361,1.228,8.816,3.683C95.201,31.138,96.429,34.078,96.429,37.5z' /></svg>");
      background-position: center top;
      background-size: 75% auto;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.focus {
  color: white;
  background-color: gray;
}

.highlight {
  outline-offset: -20px !important;
  background-color: rgba(0, 0, 0, 0.2);
  border-color: purple !important;
}
</style>
