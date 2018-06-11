<template>
  <ul class="setting-box" v-if="show" :style="{transform: translateXY}">
    <li class="setting-item" v-for="(item, index) in items" :key="index" @click="selectItem(item.event, $event)" :class="{inactive: !item.active}">
      {{ item.title }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    x: {
      type: Number
    },
    y: {
      type: Number
    }
  },
  data() {
    return {
      items: [
        {
          title: "새 폴더",
          accept: ["folder"],
          active: false,
          event: "folder"
        },
        {
          title: "새 파일",
          accept: ["folder"],
          active: false,
          event: "file"
        },
        {
          title: "이름 바꾸기",
          accept: ["file"],
          active: false,
          event: "rename"
        },
        {
          title: "삭제",
          accept: ["file", "folder"],
          active: false,
          event: "delete"
        }
      ]
    };
  },
  methods: {
    selectItem(kind, e) {
      e.stopPropagation();
      if (e.target.className.indexOf("inactive") > -1) {
        return;
      }

      const info = this.$store.getters.settingInfo;
      let path = info.path;
      let type = info.type;

      switch (kind) {
        case "folder":
          this.createInput(v => {
            this.$store.dispatch("accessFileLoading");
            this.$store.dispatch("createFolder", {
              path: path + "/" + v + "/"
            });
          }, "folder");
          break;
        case "file":
          this.createInput(v => {
            if (v.indexOf(".inc") > -1) {
              const data = new Blob([v], { type: "text/plain" });
              this.$store.dispatch("upload", {
                file: data,
                key: path + "/" + v,
                first: true
              });
            } else {
              alert("Only .inc is supported");
            }
          }, "file");
          break;
        case "rename":
          const el = this.$store.getters.settingElement;
          el.setAttribute("contenteditable", "true");
          el.focus();

          el.addEventListener("focusout", this.handlerFocus, false);
          el.addEventListener("keydown", this.handlerEnter, false);
          break;
        case "delete":
          this.$store.dispatch("accessFileLoading");
          if (type === "file") {
            this.$store.dispatch("deleteFile", {
              path: path
            });
          } else {
            this.$store.dispatch("deleteFolder", {
              path: path
            });
          }
          break;
      }
      this.$store.dispatch("closeSetting");
    },
    createInput(callback, type) {
      let el = document.querySelector(".dir");
      let newItem = document.createElement("div");
      let inputNode = document.createElement("input");
      let spanNode = document.createElement("span");
      let indent = this.$store.getters.indent;

      const transRegex = /\.*translate\((.*)px\)/i;
      const x = Number(transRegex.exec(indent)[1]);
      newItem.style.transform = "translate(" + (x + 30) + "px)";

      newItem.className = "input-f-wrapper";
      inputNode.className = "input-f";
      spanNode.className = "span-alert";
      newItem.appendChild(inputNode);
      newItem.appendChild(spanNode);

      // Insert, new element
      if (el.firstChild) {
        el.insertBefore(newItem, el.firstChild);
      } else {
        el.appendChild(newItem);
      }

      let input = document.querySelector(".input-f");
      let span = document.querySelector(".span-alert");
      let removed = false;
      input.focus();

      input.addEventListener("keyup", e => {
        let text = e.target.value;
        if (type === "folder") {
          if (!text.match(/^[0-9a-zA-Z]*$/)) {
            input.focus();
            span.innerText = "Not a valid formats";
          } else {
            span.innerText = "";
          }
        } else {
          if (!text.match(/\.[0-9a-z]+$/i)) {
            input.focus();
            span.innerText = "Not a valid formats";
          } else {
            span.innerText = "";
          }
        }

        if (e.keyCode === 13) {
          input.blur();
        }

        if (e.keyCode === 27) {
          removed = true; // Please set it before the input. because remove() issue.
          input.parentNode.remove(); // By removing the dom, the listener is also removed.
        }
      });

      input.addEventListener("blur", e => {
        if (removed) {
          return;
        }
        if (input && input.parentNode) {
          let v = input.value;
          if (v) {
            if (type === "folder" && !v.match(/^[0-9a-zA-Z]*$/)) {
              input.focus();
              return;
            } else if (type === "file" && !v.match(/\.[0-9a-z]+$/i)) {
              input.focus();
              return;
            } else {
              callback(v);
            }
          }
          removed = true; // Please set it before the input. because remove() issue.
          input.parentNode.remove(); // By removing the dom, the listener is also removed.
        }
      });
    },
    handlerFocus(e) {
      // for rename
      const el = e.target;
      let path = this.$store.getters.settingInfo.path;
      let rename = e.target.innerText;
      el.setAttribute("contenteditable", "false");

      if (path.substr(path.lastIndexOf("/") + 1) !== rename) {
        this.$store.dispatch("accessFileLoading");
        this.$store.dispatch("renameFile", {
          old: path,
          key: path.substr(0, path.lastIndexOf("/") + 1) + rename
        });
      }

      el.removeEventListener("keydown", this.handlerEnter, false);
      el.removeEventListener("focusout", this.handlerFocus, false);
    },
    handlerEnter(e) {
      if (e.keyCode === 13 || e.keyCode === 27) {
        e.target.blur();
      }
    }
  },
  computed: {
    translateXY() {
      let pos = this.$store.getters.settingPosition;
      return "translate(" + pos.x + "px, " + pos.y + "px)";
    },
    show() {
      return this.$store.getters.setting;
    }
  },
  watch: {
    show(v) {
      if (v) {
        const info = this.$store.getters.settingInfo;
        this.items.forEach(item => {
          item.active = false;
          item.accept.forEach(v => {
            if (info.type === v) {
              item.active = true;
            }
          });
        });
      } else {
        document.querySelectorAll(".setting-item").forEach(v => {
          v.className = "setting-item";
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.setting-box {
  display: inline-block;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 3px 0px #ccc;
  transform: translate(198px, 250px);
  background-color: rgb(250, 250, 250);
  .setting-item {
    cursor: pointer;
    padding: 0 1rem;
    &:hover {
      color: #fff;
      background-color: blue;
    }
  }
  .setting-item:first-child {
    margin-top: 5px;
  }
  .setting-item:last-child {
    margin-bottom: 5px;
  }
  .setting-item:not(:first-child):not(:last-child) {
    margin: 5px 0;
  }
}

.inactive {
  opacity: 0.5;
}
</style>
