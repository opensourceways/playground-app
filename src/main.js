import "virtual:svg-icons-register";
import "./styles/base.scss";

// 从URL中获取code，必须提前引入
import "./before";

import { createApp } from "vue";
import { router } from "./router";
import App from "./App.vue";
import SvgIcon from "@/components/SvgIcon.vue";

const app = createApp(App);

app.component("SvgIcon", SvgIcon);

app.use(router);
app.mount("#app");
