<template>
  <div class="preview">
    <div class="before">
      <video id="beforeFile" controls="controls">
        <source :src="fileURL" />
      </video>
    </div>
    <div class="between">
      <div class="arrow">
        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTYgOHYtNGw4IDgtOCA4di00aC01di04aDV6bS03IDBoLTJ2OGgydi04em0tNC4wMTQgMGgtMS45ODZ2OGgxLjk4NnYtOHptLTMuOTg2IDBoLTF2OGgxdi04eiIvPjwvc3ZnPg==">
      </div>
    </div>
    <div class="after">
      <drag-and-drop v-show="!isUpload" :accept="'video'" />
      <video v-show="isUpload" id="afterFile" controls="controls" controlsList="nodownload">
        <source :src="uploadFile" />
      </video>
    </div>
  </div>
</template>

<script>
import Audio from "@/components/preview/Audio";

export default {
  extends: Audio
};
</script>

<style lang="scss" scoped>
video {
  width: 100%;
}
</style>
