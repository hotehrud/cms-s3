<template>
  <div>
    <component :is="previewType" />
    <div class="function">
      <upload-btn/>
      <download-btn :type="type" />
      <reset-btn />
    </div>
  </div>
</template>

<script>
import ImagePreview from "@/components/preview/Image";
import VideoPreview from "@/components/preview/Video";
import AudioPreview from "@/components/preview/Audio";

export default {
  data() {
    return {
      type: ""
    };
  },
  components: {
    ImagePreview,
    VideoPreview,
    AudioPreview
  },
  computed: {
    previewType() {
      let type = this.$store.getters.currentExtensions;

      if (!type) {
        this.router();
        return;
      }

      if (type.match(/\.(jpg|jpeg|png|gif)$/)) {
        // eslint-disable-next-line
        this.type = "image";
        return ImagePreview;
      } else if (type.match(/\.(mp4|mov)$/)) {
        this.type = "video";
        return VideoPreview;
      } else if (type.match(/\.(mp3|ogg)$/)) {
        this.type = "audio";
        return AudioPreview;
      } else {
        this.$store.dispatch("completed");
        // eslint-disable-next-line
        this.$router.push({
          name: "Error",
          params: {
            type: 403
          }
        });
      }
    }
  },
  methods: {
    router() {
      this.$router.push({
        name: "Index"
      });
    }
  }
};
</script>

<style lang="scss">
.function {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5rem;
  > div {
    margin-right: 1rem;
  }
}
#input_img {
  display: none;
}
</style>
