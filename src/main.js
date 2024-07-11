import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import MembershipForm from "./components/MembershipForm.vue";
import SuccessPage from "./components/SuccessPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: MembershipForm },
    { path: "/success", component: SuccessPage },
  ],
});

const app = createApp(App);
app.use(router);
app.mount("#app");
