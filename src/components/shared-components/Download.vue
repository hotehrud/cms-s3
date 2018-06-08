<template>
  <div class="btn-download" @click="download">
    <h4>
      <svg width="24px" height="24px" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
        <g>
          <g>
            <path d="M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64
			c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472
			c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z" />
          </g>
        </g>
        <g>
          <g>
            <path d="M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z" />
          </g>
        </g>
      </svg>

      Download
    </h4>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      default: "",
      type: String
    }
  },
  methods: {
    async download() {
      if (this.type !== "image") {
        alert("Please use download-button in element");
        return;
      }
      await this.$store.dispatch("download");
      let blobURL = this.$store.getters.blobURL;
      let a = document.createElement("a");
      a.download = "choongju";
      a.href = blobURL;
      a.click();
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-download {
  width: 15%;
  height: 3rem;
  text-align: center;
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
