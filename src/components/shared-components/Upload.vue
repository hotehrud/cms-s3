<template>
  <div class="btn-upload" @click="uploadFile">
    <h4>
      <svg width="24px" height="24px" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
        <g>
          <g>
            <path d="M380.032,133.472l-112-128C264.992,2.016,260.608,0,256,0c-4.608,0-8.992,2.016-12.032,5.472l-112,128
			c-4.128,4.736-5.152,11.424-2.528,17.152C132.032,156.32,137.728,160,144,160h64v208c0,8.832,7.168,16,16,16h64
			c8.832,0,16-7.168,16-16V160h64c6.272,0,11.968-3.648,14.56-9.376C385.152,144.896,384.192,138.176,380.032,133.472z" />
          </g>
        </g>
        <g>
          <g>
            <path d="M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z" />
          </g>
        </g>
      </svg>
      Upload
    </h4>
  </div>
</template>

<script>
export default {
  methods: {
    uploadFile(e) {
      e.stopPropagation();
      const file = this.$store.getters.uploadFile;
      let key = this.$store.getters.currentPath;
      if (file) {
        this.$store.dispatch("uploadFileLoading");
        this.$store.dispatch("upload", {
          file: file,
          key: key
        });
        this.$store.dispatch("resetUploadFile");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-upload {
  height: 3rem;
  text-align: center;
  width: 15%;
  border-radius: 0.5rem;
  background-color: #000;
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  h4 {
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      margin-right: 10px;
    }
  }
}
</style>
