<template>
  <div v-if="!isLoading" class="box">
    <div class="header">
      <button class="header__donate">
        <i class="fas fa-dollar-sign"></i>
        Donate
      </button>
      <div class="spacer"></div>
      <!-- <button class="header__unsent">
        Unsent Tweets
      </button> -->
      <button @click="publishTweet" class="header__tweet">
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
      return this.$store.state.tweets.length === 1 ? "Tweet" : "Tweet all"
    }
  },

  methods: {
    async publishTweet() {
      if (!this.tweet.length) return 

      const res = await API.tweet({ tweets: [this.tweet] });

      if (!res.ok) {
        console.log(res);
        alert("There was an error sending your tweet");
        return;
      }

      this.tweet = ""
      this.$refs.textarea.style.height = "6rem";
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