<template>
  <div class="preview">
    <div class="before">
      <audio id="beforeFile" controls>
        <source :src="fileURL" type="audio/ogg">
        <source :src="fileURL" type="audio/mpeg"> Your browser does not support the audio tag.
      </audio>
    </div>
    <div class="between">
      <div class="arrow">
        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTYgOHYtNGw4IDgtOCA4di00aC01di04aDV6bS03IDBoLTJ2OGgydi04em0tNC4wMTQgMGgtMS45ODZ2OGgxLjk4NnYtOHptLTMuOTg2IDBoLTF2OGgxdi04eiIvPjwvc3ZnPg==">
      </div>
    </div>
    <div class="after">
      <drag-and-drop v-show="!isUpload" :accept="'audio'" />
      <audio v-show="isUpload" id="afterFile" controls controlsList="nodownload">
        <source :src="uploadFile" type="audio/ogg">
        <source :src="uploadFile" type="audio/mpeg"> Your browser does not support the audio tag.
      </audio>
    </div>
  </div>
</template>

<script>
import Image from "@/components/preview/Image";

export default {
  extends: Image,
  methods: {
    init() {
      const audio = document.getElementById("beforeFile");
      audio.addEventListener(
        "loadeddata",
        () => {
          this.$store.dispatch("completed");
        },
        false
      );
    },
    previewFile() {
      this.uploadFile = "";
      const file = this.$store.getters.uploadFile;
      this.$store.dispatch("accessFileLoading");

      const audio = document.getElementById("afterFile");
      this.uploadFile = window.URL.createObjectURL(file);
      audio.load();

      audio.addEventListener(
        "loadeddata",
        () => {
          this.$store.dispatch("completed");
        },
        false
      );
    }
  },
  watch: {
    fileURL() {
      const before = document.getElementById("beforeFile");
      const after = document.getElementById("afterFile");
      before.load();
      after.load();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
