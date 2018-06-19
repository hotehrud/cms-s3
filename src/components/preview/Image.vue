<template>
  <div class="preview">
    <div class="before">
      <img id="beforeFile" :src="fileURL">
    </div>
    <div class="between">
      <div class="arrow">
        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTYgOHYtNGw4IDgtOCA4di00aC01di04aDV6bS03IDBoLTJ2OGgydi04em0tNC4wMTQgMGgtMS45ODZ2OGgxLjk4NnYtOHptLTMuOTg2IDBoLTF2OGgxdi04eiIvPjwvc3ZnPg==">
      </div>
    </div>
    <div class="after">
      <drag-and-drop v-show="!isUpload" :accept="'image'" />
      <img v-show="isUpload" :src="uploadFile">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uploadFile: ""
    };
  },
  created() {
    this.$on("upload-completed", () => {
      this.$store.dispatch("resetUploadFile");
    });
    this.$on("preview-file", this.previewFile);
  },
  mounted() {
    this.init();
  },
  computed: {
    fileURL() {
      return this.$store.getters.filePath;
    },
    isUpload() {
      return this.$store.getters.isUploadFile;
    }
  },
  methods: {
    init() {
      const el = document.getElementById("beforeFile");
      el.addEventListener(
        "load",
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

      const reader = new FileReader();
      reader.onload = e => {
        this.uploadFile = e.target.result;
        this.$store.dispatch("completed");
      };
      reader.readAsDataURL(file);
    }
  }
};
</script>

<style lang="scss" scoped>
.before {
  border: 2px solid #ccc;
}
</style>
