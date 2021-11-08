import { createRouter, createWebHashHistory } from "vue-router";
import Playground from "@/pages/playground/Index.vue";
export const routes = [
  { path: "/", redirect: "/app" },
  {
    path: "/app",
    component: Playground,
    children: [
      {
        path: "welcome",
        component: () => import("@/pages/playground/Welcome.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
