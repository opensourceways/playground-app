export default {
  experience: {
    // 资源镜像信息
    resource: {
      id: "1",
      // template: "openeuler-20.03-lts-sp1/container/x86.tmpl",
      template: "openeuler-20.03-lts-sp1/lxd/x86.tmpl",
      email: "contact@openeuler.io",
      timeout: 20, // 创建资源的超时时间（秒）
      query_interval: 3, // 创建资源后，轮询资源是否ready的间隔时间（秒）
    },
  },
};
