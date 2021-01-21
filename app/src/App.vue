<template>
  <div id="app">
    <div v-if="!$store.state.token" style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)">
      <h1 style="font-size: 3rem;margin-top:0;color:white;font-weight:bold">
        Tweet<br>
        Without<br>
        Distractions.
      </h1>
      <button @click="$store.dispatch('requestOauthToken')">
        Tweet with Feedir
      </button>
    </div>
    
    <div style="display:flex;justify-content:center" v-else>
      <TweetPage />

      <button 
        v-if="$store.state.tweets.length === 1 && !$store.state.tweets[0].length"
        @click="logout"
        style="position:fixed;bottom:1rem;right:1rem;background:transparent;color:#DB2F2F;border:2px solid #DB2F2F;font-size:0.75rem"
      >
        Log Out
      </button>
    </div>
    <Modal v-if="$store.state.modal" />
    <Alert />
  </div>
</template>

<script>
import TweetPage from "@/components/TweetPage.vue";
import Alert from "@/components/Alert";
import Modal from "@/components/Modal";

export default {
  name: "App",

  components: {
    TweetPage,
    Alert,
    Modal
  }, 

  methods: {
    logout() {
      localStorage.clear(); 
      window.location.reload(false)
    }
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
