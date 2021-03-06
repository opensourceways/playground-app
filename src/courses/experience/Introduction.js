export default [
  "openEuler支持 yum 及 dnf 等RPM包管理工具对软件包进行管理，下面通过安装一个简单的示例展示如何在openEuler上安装软件包。",
  [
    "1.执行：",
    {
      value: "sudo yum -y update",
      type: "code",
      commond: "sudo yum -y update",
    },
    "或",
    {
      value: "sudo dnf -y update",
      type: "code",
      commond: "sudo dnf -y update",
    },
    "对软件包源进行更新",
  ],
  [
    "2.执行：",
    {
      value: "sudo yum -y install nginx",
      type: "code",
      commond: "sudo yum -y install nginx",
    },
    "或",
    {
      value: "sudo dnf -y install nginx",
      type: "code",
      commond: "sudo dnf -y install nginx",
    },
    "安装 nginx",
  ],
  [
    "3.执行：",
    {
      value: "sudo systemctl start nginx",
      type: "code",
      commond: "sudo systemctl start nginx",
    },
    "以后台方式启动nginx",
  ],
  [
    "4.执行：",
    { value: "curl 127.0.0.1:80", type: "code", commond: "curl 127.0.0.1:80" },
    "访问nginx页面",
  ],
];
