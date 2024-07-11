import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import MembershipForm from "./components/MembershipForm.vue";
import SuccessPage from "./components/SuccessPage.vue";
import InfoPage from "./components/InfoPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: MembershipForm },
    { path: "/success", component: SuccessPage },
    { path: "/info", component: InfoPage },
  ],
});

const app = createApp(App);
app.use(router);
app.mount("#app");
