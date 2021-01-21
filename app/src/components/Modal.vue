<template>
  <div @click.self="closeModal" class="modal-container">
    <div class="modal">
      <h3 v-if="!$store.state.drafts.length">No drafts.</h3>
      <div v-else>
        <h3>Drafts</h3>
        <ul class="drafts">
          <li
            v-for="(draft, i) in $store.state.drafts" 
            :key="i" 
            class="drafts__draft"
          >
            <button @click="$store.commit('SET_DRAFT_AS_TWEETS', i)" class="draft__select">
              {{ draft.tweets[0].substr(0, 64) }}
            </button>
            <button @click="$store.commit('DELETE_DRAFT', i)"  class="draft__delete">
              <i class="fas fa-trash"></i>
            </button>
          </li>
        </ul>
      </div>
      <button @click="closeModal" class="modal__close-button">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    closeModal() {
      this.$store.commit("SET_MODAL", "");
    },

    onKeyUp(e) {
      if (e.key === "Escape") {
        this.closeModal();
      }
    }
  },

  mounted() {
    window.addEventListener("keyup", this.onKeyUp);
  },

  beforeDestroy() {
    window.removeEventListener("keyup", this.onKeyUp);
  }
}
</script>

<style>
.modal-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000c2;
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.modal {
  margin: 1rem;
  flex-grow: 1;
  border-radius: 16px;
  max-width: 900px;
  max-height: 70vh;
  overflow: scroll;
  background: #15202B;
  color: white;
  padding: 1rem;
  z-index: 100;
}

.modal__close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #15202B;
  color: #fff;
}

.drafts {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
}

.drafts__draft {
  display: flex;
  align-items: center;
  width: 100%;
}

.draft__select {
  flex-grow: 1;
  text-align: left;
  background: transparent;
  color: white;
}

.drafts__draft:hover {
  background: #000000c2;
}

.draft__delete {
  background: transparent;
  color: rgb(219, 47, 47);
}
</style>