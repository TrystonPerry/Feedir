<template>
  <div v-if="$store.state.alertText" class="alert-wrapper">
    <div class="alert">
      {{ $store.state.alertText }}
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    timeout: null
  }),

  beforeDestroy() {
    if (this.timeout !== null) clearTimeout(this.timeout);
  },

  watch: {
    "$store.state.alertText"(value) {
      if (value.length) {
        if (this.timeout !== null) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.$store.commit("SET_ALERT_TEXT", "");
          this.timeout = null;
        }, 3000);
      }
    }
  }
}
</script>

<style>
.alert-wrapper {
  position: fixed;
  bottom: 4rem;
  display: flex;
  justify-content: center;
  width: 100vw;
}

.alert {
  background: #1DA1F2;
  color: white;
  padding: 0.5rem 2rem;
  border-radius: 1000px;
}
</style>