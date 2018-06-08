<template>
  <div class="preview">
    <div class="before">
      <video id="beforeVideo" controls="controls">
        <source :src="videoURL" />
      </video>
    </div>
    <div class="between">
      <div class="arrow">
        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTYgOHYtNGw4IDgtOCA4di00aC01di04aDV6bS03IDBoLTJ2OGgydi04em0tNC4wMTQgMGgtMS45ODZ2OGgxLjk4NnYtOHptLTMuOTg2IDBoLTF2OGgxdi04eiIvPjwvc3ZnPg==">
      </div>
    </div>
    <div class="after">
      <drag-and-drop v-show="!isUploadFile" :accept="'video'" />
      <video v-show="isUploadFile" id="afterVideo" controls="controls" controlsList="nodownload">
        <source :src="uploadFile" />
      </video>
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
    const video = document.getElementById("beforeVideo");
    video.addEventListener(
      "loadeddata",
      () => {
        this.$store.dispatch("completed");
      },
      false
    );
  },
  computed: {
    videoURL() {
      return this.$store.getters.filePath;
    },
    isUploadFile() {
      return this.$store.getters.isUploadFile;
    }
  },
  methods: {
    previewFile() {
      this.uploadFile = "";
      const file = this.$store.getters.uploadFile;
      this.$store.dispatch("accessFileLoading");

      const video = document.getElementById("afterVideo");
      this.uploadFile = window.URL.createObjectURL(file);

      video.addEventListener(
        "loadeddata",
        () => {
          this.$store.dispatch("completed");
        },
        false
      );
      video.load();
    }
  },
  watch: {
    videoURL() {
      const before = document.getElementById("beforeVideo");
      const after = document.getElementById("afterVideo");
      before.load();
      after.load();
    }
  }
};
</script>

<style lang="scss" scoped>
.preview {
  width: 900px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0 auto;
  .before,
  .after {
    flex-basis: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .between {
    flex-basis: 20%;
    .arrow {
      margin: 0 auto;
      width: 80%;
      height: 100%;
      border-radius: 0.5rem;
      color: #fff;
      font-weight: bold;
      display: flex;
      align-items: center;
    }
  }
  img {
    width: 100%;
  }
  video {
    width: 100%;
  }
}
</style>
