# water

## cli 介绍

> 基于 `webpack` 整合前端项目中构建配置流程，让项目越来越轻；

1. 开发环境构建，基于 `webpack-dev-server`, 整合 eslint/stylelint 语法监测，支持 hrm 实时热更新；
2. 生产环境构建，统一构建产物，支持代码 `chunk` 拆包，并支持打包分析；
3. umd 打包，可用于制作 cdn 整合包，比如 `react`/`react-router`/`react-router-dom` 合并为一个包；
4. `TODO` 项目模板初始化，待完善；

<!-- ## 安装

```bash
$ npm i -g @water/cli
or
$ yarn global add  @water/cli
``` -->

## 模板说明

```bash
.
├── react # react jsx 模板
│   ├── dist # 构建产物
│   │   ├── index.html
│   │   └── static
│   │       ├── images
│   │       │   └── favicon.ico
│   │       ├── scripts
│   │       │   ├── app.66734.js
│   │       │   ├── app.66734.js.LICENSE.txt
│   │       │   └── common.05092.js
│   │       └── styles
│   │           └── app.78e30.css
│   ├── package.json
│   ├── src
│   │   ├── app.jsx # 必须 主入口文件
│   │   ├── assets
│   │   │   ├── images
│   │   │   │   └── favicon.ico
│   │   │   └── styles
│   │   │       ├── animate.scss
│   │   │       ├── common.scss
│   │   │       └── variable.scss
│   │   ├── index.html # 必须 主入口 html
│   │   ├── index.scss
│   │   ├── pages
│   │   │   ├── app.jsx
│   │   │   ├── index.scss
│   │   │   └── views
│   │   │       ├── index.jsx
│   │   │       └── other.jsx
│   │   └── source
│   │       ├── auth.js
│   │       ├── http.js
│   │       └── storage.js
│   ├── water.config.js # 必须 cli 核心配置文件
│   └── yarn.lock
├── react-ts # react typescript 模板
│   ├── dist # 构建产物
│   │   ├── index.html
│   │   └── static
│   │       ├── scripts
│   │       │   ├── app.870da.js
│   │       │   ├── app.870da.js.LICENSE.txt
│   │       │   └── common.05092.js
│   │       └── styles
│   │           └── app.78e30.css
│   ├── package.json
│   ├── src
│   │   ├── app.tsx # 必须 主入口文件
│   │   ├── assets
│   │   │   ├── images
│   │   │   │   └── favicon.ico
│   │   │   └── styles
│   │   │       ├── animate.scss
│   │   │       ├── common.scss
│   │   │       └── variable.scss
│   │   ├── index.html # 必须 主入口 html
│   │   ├── index.scss
│   │   ├── pages
│   │   │   ├── app.tsx
│   │   │   ├── index.scss
│   │   │   └── views
│   │   │       ├── index.tsx
│   │   │       └── other.tsx
│   │   └── source
│   │       ├── auth.ts
│   │       ├── http.ts
│   │       └── storage.ts
│   ├── tsconfig.json # typescript 配置文件
│   ├── water.config.js # 必须 cli 核心配置文件
│   └── yarn.lock
├── vue # vue js 模板
│   ├── dist # 构建产物
│   │   ├── index.html
│   │   └── static
│   │       ├── images
│   │       │   └── favicon.ico
│   │       ├── scripts
│   │       │   ├── app.9a6e3.js
│   │       │   ├── app.9a6e3.js.LICENSE.txt
│   │       │   └── common.05092.js
│   │       └── styles
│   │           └── app.dc868.css
│   ├── package.json
│   ├── src
│   │   ├── app.js # 必须 主入口文件
│   │   ├── assets
│   │   │   ├── images
│   │   │   │   └── favicon.ico
│   │   │   └── styles
│   │   │       ├── animate.scss
│   │   │       ├── common.scss
│   │   │       └── variable.scss
│   │   ├── index.html # 必须 主入口 html
│   │   ├── index.scss
│   │   ├── pages
│   │   │   ├── app.vue
│   │   │   ├── other.vue
│   │   │   └── routes.js
│   │   └── source
│   │       ├── auth.js
│   │       ├── http.js
│   │       └── storage.js
│   ├── water.config.js # 必须 cli 核心配置文件
│   └── yarn.lock
└── vue-ts # vue typescript 模板
    ├── package.json
    ├── src
    │   ├── app.ts # 必须 主入口文件
    │   ├── assets
    │   │   ├── images
    │   │   │   └── favicon.ico
    │   │   └── styles
    │   │       ├── animate.scss
    │   │       ├── common.scss
    │   │       └── variable.scss
    │   ├── index.html # 必须 主入口 html
    │   ├── index.scss
    │   ├── pages
    │   │   ├── app.vue
    │   │   ├── other.vue
    │   │   └── routes.ts
    │   └── source
    │       ├── auth.ts
    │       ├── http.ts
    │       └── storage.ts
    ├── tsconfig.json # typescript 配置文件
    ├── typings # vue 相关 typescript 全局类型说明
    │   ├── shims-tsx.d.ts
    │   └── shims-vue.d.ts
    ├── water.config.js # 必须 cli 核心配置文件
    └── yarn.lock
```

## `water.config.js` 核心配置文件说明

```javascript
// 接口前缀
const apiPrefix = "https://api.test.example.com";
// const apiPrefix = "https://api.test.example.com";

const proxyMapping = {};
// 接口 uri 前缀
const uriPrefix = ["/api"];

// 代理映射
uriPrefix.map(
  (uri) =>
    (proxyMapping[uri] = {
      target: apiPrefix,
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        [`^${uri}`]: apiPrefix + uri,
      },
    })
);

module.exports = {
  // 允许端口
  port: 3001,
  // 代码 chunk 打包分析端口，仅在生产打包配置才生效，端口自定义
  analyzerPort: null,
  // 解析路径，用于映射 src 下路径为 @/source，@/pages， @/assets
  resolvePath: "src",
  // 读取 app.ts 根路径
  target: "./src",
  // 打包 chunk 文件 前缀根路径
  publicPath: "/",
  // 打包导向路径
  buildPath: "./dist",
  // 复制路径，需要做文件迁移的路径，该目录下文件将被直接转移到 dist 根路径
  // 比如 微信校验文件、robot.txt 等无项目依赖类型的文件
  copyPath: "./src/assets/public",
  // api 代理，仅在开发环境生效
  proxy: proxyMapping,
  // css 预编译期配置，内置了 less/sass 按需配置
  css: ["sass"],
  // 内置了 markdown-loader，项目中可将 markdown 文件直接转义为标准 html
  markdown: false,
  // 拆包配置，必须配置 ['antd', 'echarts'] 这里将项目中 antd/echarts 相关的包单独打包到 antd.js/echarts.js 中
  splitPackages: [],
  // vue 项目设置为 true
  vue: true,
  // react 项目配置
  react: {
    // 项目中是否使用了 antd，对于 antd 引入了优化方案，moment 替换 dayjs 的操作
    antd: true,
    // 是否覆盖 antd 主题，这里配置好自定义的主题地址即可，cli 会检测文件存在则启用，否则不生效
    antdLess: "./src/assets/styles/antd.less",
  },
  // TODO 后续将根据使用情况在进行拓展，以上其实已经可以兼容大多数场景
};
```

## 使用说明

1. `vue` 模板默认对 `element-ui` 支持了按需加载
2. `react` 模板默认对 `antd` 支持了按需加载

## 关于我

1. 公众号「前端艺匠」作者，最近刚开始推文，未来也会一直坚持原创优质文章；
2. [掘金「水逆」](https://juejin.im/user/5872f2578d6d81005896aa48)，一个原创作者，希望对你有帮助;
3. 欢迎骚扰，大家共同探讨，共享资源，一起进步

![前端艺匠](./doc/qrcode.gif)