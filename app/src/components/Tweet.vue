<template>
  <div>
    <div class="main">
      <div class="main__pic-wrapper">
        <img :src="$store.state.picUrl" class="main__pic">
        <div v-if="index < $store.state.tweets.length - 1" class="main__next-tweet-line"></div>
      </div>
      <div class="main__tweet-actions">
        <div class="tweet-area">
          <textarea 
            ref="textarea" 
            :value="tweet" 
            @input="onInput" 
            @focus="$store.commit('SET_FOCUSED_TWEET', index)" 
            autosize 
            class="main__textarea" 
            :placeholder="placeholder">
          </textarea>
          <div>
            <button
              @click="$store.commit('REMOVE_TWEET', index)" 
              v-if="$store.state.tweets.length > 1 && $store.state.focusedTweet === index" 
              class="footer__add"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div v-if="$store.state.focusedTweet === index" class="footer">
          <div class="spacer"></div>
          <button v-if="tweet.length > 0" @click="addTweet" class="footer__add">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
   </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      required: true
    }
  },

  computed: {
    tweet() {
      return this.$store.state.tweets[this.index];
    },

    placeholder() {
      return this.index === 0 ? "What's Happening?" : "Add another Tweet"
    }
  },

  mounted() {
    this.$refs.textarea.focus();
  },

  methods: {
    onInput(e) {
      this.$store.commit("SET_TWEET_AT_INDEX", {
        index: this.index,
        tweet: e.target.value
      });
      const textarea = e.target;
      textarea.style.height = "";
      textarea.style.height = Math.min(textarea.scrollHeight, 300) + "px";
    },

    addTweet() {
      this.$store.commit("ADD_TWEET", this.index + 1);
    }
  }
}
</script>

<style>
.main {
  display: flex;
  flex-direction: row;
  margin: 1rem;
  margin-bottom: 0;
}

.main__pic-wrapper {
  margin-right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main__pic {
  height: 49px;
  width: 49px;
  border-radius: 100%;
}

.main__next-tweet-line {
  width: 2px;
  background: #3D5466;
  flex-grow: 1;
  margin-top: 1rem;
}

.tweet-area {
  flex-grow: 1;
  display: flex;
  margin-bottom: rem;
}

.main__textarea {
  height: 6rem;
  width: 100%;
  background: transparent;
  border: 0;
  outline: 0;
  color: white;
  font-size: 1.25rem;
  resize: none;
}

.footer {
  display: flex;
  align-items: center;
  padding: 0.25rem 1rem;
  border-top: 2px solid #3D5466;
}

.footer__add {
  color: #1DA1F2;
  background: transparent;
  padding: 0;
  font-size: 1.5rem;
}

.main__tweet-actions {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>