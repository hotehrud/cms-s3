<template>
  <component :is="page" />
</template>

<script>
import ForbiddenPage from "@/components/error/Forbidden";
import NotFound from "@/components/error/NotFound";

export default {
  components: {
    ForbiddenPage,
    NotFound
  },
  data() {
    return {
      page: null
    };
  },
  mounted() {
    let type = this.$route.params.type;

    if (type === 403) {
      this.page = ForbiddenPage;
    } else {
      this.page = NotFound;
    }
  }
};
</script>

<style scoped>
</style>
