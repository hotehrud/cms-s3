<template>
  <div class="preview">
    <div class="before">
      <img id="beforeImage" :src="imageURL">
    </div>
    <div class="between">
      <div class="arrow">
        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTYgOHYtNGw4IDgtOCA4di00aC01di04aDV6bS03IDBoLTJ2OGgydi04em0tNC4wMTQgMGgtMS45ODZ2OGgxLjk4NnYtOHptLTMuOTg2IDBoLTF2OGgxdi04eiIvPjwvc3ZnPg==">
      </div>
    </div>
    <div class="after">
      <drag-and-drop v-show="!isUploadImage" :accept="'image'" />
      <img v-show="isUploadImage" :src="uploadFile">
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
    const img = document.getElementById("beforeImage");
    img.addEventListener(
      "load",
      () => {
        this.$store.dispatch("completed");
      },
      false
    );
  },
  computed: {
    imageURL() {
      return this.$store.getters.filePath;
    },
    isUploadImage() {
      return this.$store.getters.isUploadFile;
    }
  },
  methods: {
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
.preview {
  width: 900px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0 auto;
  .before {
    border: 2px solid #ccc;
  }
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
}
</style>
