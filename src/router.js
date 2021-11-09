import { createRouter, createWebHashHistory } from "vue-router";
import Playground from "@/pages/playground/Index.vue";
export const routes = [
  { path: "/", redirect: "/app" },
  {
    path: "/app",
    component: Playground,
    children: [
      { path: "", redirect: "/app/welcome" },
      {
        path: "welcome",
        component: () => import("@/pages/playground/Welcome.vue"),
      },
      {
        path: "introduction",
        component: () => import("@/pages/playground/Introduction.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
