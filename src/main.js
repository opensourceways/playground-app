import "virtual:svg-icons-register";

import "@authing/native-js-ui-components/lib/index.min.css";
import "./shared/styles/login.scss";
import "./shared/styles/base.scss";

import "./before";
import { createApp } from "vue";
import { router } from "./router";
import App from "./App.vue";
import SvgIcon from "@/components/SvgIcon.vue";

const app = createApp(App);

app.component("SvgIcon", SvgIcon);

app.use(router);

app.mount("#app");
