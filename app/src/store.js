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
    lists: [],
    tweets: [""],
    picUrl: "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"
  },

  mutations: {
    SET_CONSUMER_TOKENS(state, { token, secret, screen_name, user_id }) {
      state.token = token;
      state.secret = secret;
      state.screen_name = screen_name;
      state.user_id = user_id;
    },

    SET_LISTS(state, lists) {
      state.lists = lists;
    },

    SET_PIC_URL(state, url) {
      state.picUrl = url
    },

    SET_TWEET_AT_INDEX(state, { index, tweet }) {
      state.tweets[index] = tweet;
      Vue.set(state.tweets, index, tweet);
      console.log(state.tweets);
    },

    ADD_TWEET(state, index) {
      state.tweets.splice(index, 0, "");
    },

    REMOVE_TWEET(state, index) {
      state.tweets.splice(index, 1);
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
      console.log(state)
      const res = await API.user(state.screen_name);

      if (res.ok) {
        commit("SET_PIC_URL", res.data.profile_image_url_https);
      }
    }
  }
});
