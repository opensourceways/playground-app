import { createRouter, createWebHashHistory } from "vue-router";
import Playground from "@/pages/playground/Index.vue";
import { setFooterVisible } from "@/pages/shared";
import { isLogined } from "./shared/login";

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
    // beforeEnter: () => {
    //   if (!isLogined.value) {
    //     return { name: "home" };
    //   }
    // },
  },
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
  {
    path: "/demo-markdown",
    name: "demo",
    component: () => import("@/pages/demo/MarkdownDemo.vue"),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// router.beforeEach((to) => {
// if (!["home"].includes(to.name) && !isLogined()) {
//   return { name: "home" };
// }
// });

router.beforeEach((to) => {
  if (["chapter"].includes(to.name)) {
    setFooterVisible(false);
  } else {
    setFooterVisible(true);
  }
});
