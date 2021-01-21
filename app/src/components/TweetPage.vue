<template>
  <div v-if="!isLoading" class="box">
    <div class="header">
      <!-- <button class="header__donate">
        <i class="fas fa-dollar-sign"></i>
        Donate
      </button> -->
      <div class="spacer"></div>
      <button @click="$store.commit('SET_MODAL', 'DRAFTS')" v-if="$store.state.tweets.length === 1 && !$store.state.tweets[0].length" class="header__unsent">
        Drafts
      </button>
      <button v-else @click="$store.commit('SAVE_TWEETS_AS_DRAFT')" class="header__unsent">
        Save as Draft
      </button>
      <button @click="publishTweet" :disabled="isTweetButtonDisabled" class="header__tweet">
        {{ tweetButtonText }}
      </button>
    </div>
    <div class="tweets">
      <Tweet v-for="(tweet, i) in $store.state.tweets" :key="i" :index="i" />
    </div>
  </div>
</template>

<script>
import API from "@/api"

import Tweet from "@/components/Tweet"

export default {
  components: {
    Tweet
  },

  data: () => ({
    isLoading: true
  }),

  async mounted() {
    await this.$store.dispatch("getPicUrl");
    this.isLoading = false;
  },

  computed: {
    tweetButtonText() {
      if (this.$store.state.isSubmittingTweet) return "Publishing...";
      return this.$store.state.tweets.length === 1 ? "Tweet" : "Tweet all"
    },

    tweets() {
      return this.$store.state.tweets;
    },

    isTweetButtonDisabled() {
      if (this.$store.state.isSubmittingTweet) return true;
      for (let i = 0; i < this.tweets.length; i++) {
        if (this.tweets[i].length === 0) {
          return true;
        }
      }
    }
  },

  methods: {
    async publishTweet() {
      if (this.isTweetButtonDisabled) return;      
      await this.$store.dispatch("publishTweet");
    }
  }
}
</script>

<style>
button {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 100px;
  border: 0;
  outline: 0;
  cursor: pointer;
  margin: 0.25rem;
  font-weight: bold;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.box {
  width: 100vw;
  height: 100vh;
}

.header {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid grey;
}

.header__tweet {
  background: #1DA1F2;
  color: white;
}

.spacer {
  flex-grow: 1;
}

.header__unsent, .header__donate {
  background: transparent;
  color: #1DA1F2;
}
</style>