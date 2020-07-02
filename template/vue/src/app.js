import "./index.scss";
require("./assets/images/favicon.ico");

import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./pages/routes";

Vue.use(VueRouter);

const router = new VueRouter({ routes, mode: "history" });

new Vue({
  el: "#water-app",
  router,
});
