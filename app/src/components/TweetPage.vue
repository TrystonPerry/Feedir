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
      <button @click="submit" class="header__tweet">
        Tweet
      </button>
    </div>
    <div class="main">
      <img :src="picUrl" class="main__pic">
      <textarea autosize @input="onChange" class="main__textarea" placeholder="What's Happening?"></textarea>
    </div>
  </div>
</template>

<script>
import API from "@/api"

export default {
  data: () => ({
    isLoading: true,
    tweet: "",
    picUrl: "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"
  }),

  async mounted() {
    const res = await API.user(this.$store.state.screen_name);

    if (res.ok) {
      this.picUrl = res.data.profile_image_url_https;
    }

    this.isLoading = false;
  },

  methods: {
    onChange(e) {
      this.tweet = e.target.value;
    },

    async submit() {
      if (!this.tweet.length) return 
      await API.tweet({
        tweets: [this.tweet],
        oauth_token: this.$store.state.token,
        oauth_token_secret: this.$store.state.secret
      });
    }
  }
}
</script>

<style scoped>
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

.main {
  display: flex;
  flex-direction: row;
  margin: 1rem;
}

.main__pic {
  height: 49px;
  width: 49px;
  border-radius: 100%;
  margin-right: 1rem;
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
</style>