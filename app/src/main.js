import Vue from "vue";
import App from "./App.vue";

import "@/assets/css/app.css";

import store from "./store";
import router from "./router";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store,
  router
}).$mount("#app");
