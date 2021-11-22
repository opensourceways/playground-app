import { createRouter, createWebHashHistory } from "vue-router";
import Playground from "@/pages/playground/Index.vue";
import { isLogined } from "./shared/login";
export const routes = [
  { path: "/", redirect: "/app" },
  {
    path: "/app",
    component: Playground,
    children: [
      { path: "", redirect: "/app/welcome" },
      {
        path: "welcome",
        name: "welcome",
        component: () => import("@/pages/playground/Welcome.vue"),
      },
      {
        path: "introduction",
        name: "introduction",
        component: () => import("@/pages/playground/Introduction.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from) => {
  if (!["welcome"].includes(to.name) && !isLogined()) {
    return { name: "welcome" };
  }
});
