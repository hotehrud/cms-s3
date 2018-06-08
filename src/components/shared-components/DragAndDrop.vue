<template>
  <div id="dropArea" @click="openFileChooser">
    <div class="drop-container">
      <svg class="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43">
        <path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path>
      </svg>
      <div>
        <strong>Choose a file</strong>
        <span class="box__dragndrop"> or drag it here</span>
      </div>
    </div>
    <input id="inputFile" type="file" :accept="inputAccept" @change="previewFile">
  </div>
</template>

<script>
import { Drop } from "@/mixins/drop";

export default {
  mixins: [Drop],
  props: {
    accept: {
      default: "",
      type: String
    }
  },
  mounted() {
    this.dropEvent(this.previewFile);
  },
  computed: {
    inputAccept() {
      return this.accept + "/*";
    }
  },
  methods: {
    openFileChooser() {
      const event = document.createEvent("MouseEvents");
      event.initMouseEvent("click", false, true, window);
      setTimeout(() => {
        document.getElementById("inputFile").dispatchEvent(event);
      }, 0);
    },
    previewFile(e, type) {
      let input;
      if (type === "drop") {
        input = e;
      } else {
        input = e.target || e.srcElement;
        if (input.value.length == 0) {
          return;
        }
      }

      if (input.files && input.files[0]) {
        let fileType = "";
        const file = input.files[0];
        if (file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
          fileType = "image";
        } else if (file.name.match(/\.(mp4|mov)$/)) {
          fileType = "video";
        } else if (file.name.match(/\.(mp3|ogg)$/)) {
          fileType = "audio";
        } else {
          fileType = "etc";
        }

        if (this.accept === fileType) {
          this.$store.dispatch("storeFile", file);
          this.$parent.$emit("preview-file");
        } else {
          if (fileType === "etc") {
            alert("Not supported file type");
          } else {
            alert("Different file type");
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#dropArea {
  outline: 2px dashed #ccc;
  outline-offset: -10px;
  width: 100%;
  min-height: 300px;
  height: 100%;
  transition: outline-offset 0.15s ease-in-out, background-color 0.15s linear;
  .drop-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    svg {
      margin-bottom: 10px;
    }
  }
}
.highlight {
  outline-offset: -20px !important;
  background-color: #fff;
  border-color: purple !important;
}
#inputFile {
  display: none;
}
svg {
  fill: #000;
}
</style>
