import { createRouter, createWebHashHistory } from "vue-router";
// import Playground from "@/pages/playground/Index.vue";
import mitt from "@/shared/mitt";

import { PLAYGROUND_PAGES } from "@/pages/playground/shared";

export const routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    name: "home",
    component: () => import("@/pages/home/TheHome.vue"),
  },
  {
    path: "/course/:coursePath",
    name: "course",
    component: () => import("@/pages/course/TheCourse.vue"),
  },
  {
    path: "/course/:coursePath/chapter/:chapterPath",
    name: "chapter",
    component: () => import("@/pages/course/chapter/TheChapter.vue"),
  },
  // {
  //   path: "/app",
  //   component: Playground,
  //   children: [
  //     { path: "", redirect: "/app/welcome" },
  //     {
  //       path: "welcome",
  //       name: "welcome",
  //       component: () => import("@/pages/playground/Welcome.vue"),
  //     },
  //     {
  //       path: "introduction",
  //       name: "introduction",
  //       component: () => import("@/pages/playground/Introduction.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "/demo-markdown",
  //   name: "demo",
  //   component: () => import("@/pages/demo/MarkdownDemo.vue"),
  // },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  if (["chapter"].includes(to.name)) {
    mitt.emit(PLAYGROUND_PAGES.SET_FOOTER, false);
  } else {
    mitt.emit(PLAYGROUND_PAGES.SET_FOOTER, true);
  }

  if (["home"].includes(to.name)) {
    mitt.emit(PLAYGROUND_PAGES.SET_BODY_BG, "#7721f4");
  } else {
    mitt.emit(PLAYGROUND_PAGES.SET_BODY_BG, "#f5f7fb");
  }
});
