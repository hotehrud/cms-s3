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
}
</style>
