<template>
  <div id="app">
    <button
      v-if="!$store.state.token"
      @click="$store.dispatch('requestOauthToken')"
    >
      Log In With Twitter
    </button>
    <div class="bg-gray-400" v-else>
      <div>
      </div>
      <TweetPage />
    </div>
  </div>
</template>

<script>
import TweetPage from "@/components/TweetPage.vue";

export default {
  name: "App",

  components: {
    TweetPage
  }, 

  mounted() {
    // Check if user is already logged in with tokens
    let oauth_token = localStorage.getItem("OAUTH_TOKEN");
    let oauth_token_secret = localStorage.getItem("OAUTH_TOKEN_SECRET");
    if (oauth_token && oauth_token_secret) {
      this.$store.commit("SET_CONSUMER_TOKENS", {
        token: oauth_token,
        secret: oauth_token_secret,
        screen_name: localStorage.getItem("SCREEN_NAME"),
        user_id: localStorage.getItem("USER_ID")
      });
      return;
    }

    // Check if user is returning from Twitter authorization of app
    oauth_token = this.$route.query.oauth_token;
    const oauth_verifier = this.$route.query.oauth_verifier;
    if (oauth_token && oauth_verifier) {
      console.log("yes")
      console.log(oauth_token, oauth_verifier)
      this.$store.dispatch("getAccessToken", {
        oauth_token,
        oauth_verifier
      });

      this.$router.push({ route: "/" })
    }
  }
};
</script>

<style>
</style>
