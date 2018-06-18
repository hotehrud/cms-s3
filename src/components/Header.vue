<template>
  <nav>
    <h1>Vue.js + S3, CMS</h1>
    <div v-if="loginStatus" class="btn-logout" @click="logout">Logout</div>
  </nav>
</template>

<script>
export default {
  props: {
    loginStatus: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logoutUser");
    }
  }
};
</script>

<style lang="scss" scoped>
nav {
  position: absolute;
  width: 100%;
  height: 3.25rem;
  display: flex;
  padding: 0 1em;
  align-items: center;
  background-color: #222;
  color: #fff;
  z-index: 10;
  .btn-logout {
    position: absolute;
    padding: 3px 8px;
    right: 3rem;
    font-weight: bold;
    border: 1px solid #fff;
    border-radius: 0.25rem;
    cursor: pointer;
  }
}
</style>
