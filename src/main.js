import "virtual:svg-icons-register";

import "@authing/native-js-ui-components/lib/index.min.css";
import "./shared/styles/login.scss";
import "./shared/styles/base.scss";

import { createApp } from "vue";
import { router } from "./router";
import App from "./App.vue";
import SvgIcon from "@/components/SvgIcon.vue";

import { doSignUp } from "@/shared/login";

const app = createApp(App);

// TODO:偶现异步执行顺序出错
doSignUp();

app.component("SvgIcon", SvgIcon);

app.use(router);

app.mount("#app");
