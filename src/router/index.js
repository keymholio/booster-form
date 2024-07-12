// src/router/index.js

import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/HomePage.vue";
import MembershipForm from "@/components/MembershipForm.vue";
import SuccessPage from "@/components/SuccessPage.vue";
import InfoPage from "@/components/InfoPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: { title: "Wantagh Performing Arts Booster Club" },
  },
  {
    path: "/join",
    name: "Join",
    component: MembershipForm,
    meta: { title: "Join Our Booster Club" },
  },
  {
    path: "/success",
    name: "Success",
    component: SuccessPage,
    meta: { title: "Thank You for Joining" },
  },
  {
    path: "/info",
    name: "Info",
    component: InfoPage,
    meta: { title: "Club Information" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Wantagh Performing Arts Booster Club";
  next();
});

export default router;
