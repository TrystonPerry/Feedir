import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import API from "./api";

export default new Vuex.Store({
  state: {
    token: "",
    secret: "",
    user_id: "",
    screen_name: "",
    tweets: [""],
    focusedTweet: 0,
    picUrl: "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
    isSubmittingTweet: false,
    alertText: ""
  },

  mutations: {
    SET_CONSUMER_TOKENS(state, { token, secret, screen_name, user_id }) {
      state.token = token;
      state.secret = secret;
      state.screen_name = screen_name;
      state.user_id = user_id;
    },

    SET_PIC_URL(state, url) {
      state.picUrl = url
    },

    SET_TWEET_AT_INDEX(state, { index, tweet }) {
      state.tweets[index] = tweet;
      Vue.set(state.tweets, index, tweet);
    },

    SET_FOCUSED_TWEET(state, index) {
      state.focusedTweet = index
    },

    ADD_TWEET(state, index) {
      state.tweets.splice(index, 0, "");
    },

    REMOVE_TWEET(state, index) {
      state.tweets.splice(index, 1);
    },

    RESET_TWEETS(state) {
      state.tweets = [""];
      state.focusedTweet = 0;
    },

    SET_IS_SUBMITTING_TWEET(state, value) {
      state.isSubmittingTweet = value;
    },

    SET_ALERT_TEXT(state, text) {
      state.alertText = text;
    }
  },

  actions: {
    async requestOauthToken() {
      const { ok, error, data } = await API.oauth.requestToken({
        callback: window.location.href
      });

      if (!ok) {
        console.error(error);
        return;
      }

      window.location.replace(
        `https://api.twitter.com/oauth/authenticate?oauth_token=${data.oauth_token}`
      );
    },

    async getAccessToken({ commit }, tokens) {
      const { ok, error, data } = await API.oauth.accessToken(tokens);

      if (!ok) {
        console.error(error);
        return;
      }

      commit("SET_CONSUMER_TOKENS", {
        token: data.oauth_token,
        secret: data.oauth_token_secret,
        screen_name: data.screen_name,
        user_id: data.user_id
      });

      localStorage.setItem("OAUTH_TOKEN", data.oauth_token);
      localStorage.setItem("OAUTH_TOKEN_SECRET", data.oauth_token_secret);
      localStorage.setItem("SCREEN_NAME", data.screen_name);
      localStorage.setItem("USER_ID", data.user_id);
    },

    async getPicUrl({ commit, state }) {
      const res = await API.user(state.screen_name);

      if (res.ok) {
        commit("SET_PIC_URL", res.data.profile_image_url_https);
      }
    },

    async publishTweet({ commit, state }) {
      commit("SET_IS_SUBMITTING_TWEET", true);
      const res = await API.tweet({ tweets: state.tweets });
      commit("SET_IS_SUBMITTING_TWEET", false);

      if (!res.ok) {
        commit("SET_ALERT_TEXT", "Error: " + res.error);
        return false;
      }

      commit("SET_ALERT_TEXT", `Tweet${state.tweets.length > 1 ? "s" : ""} sent successfully.`)
      commit("RESET_TWEETS");      
      return true;
    }
  }
});
