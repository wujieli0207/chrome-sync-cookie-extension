# chrome-sync-cookie-extension

开发环境同步测试 cookie 至 localhost，便于本地请求服务携带 cookie

## 使用方式

1. 下载源码：`git clone https://github.com/wujieli0207/chrome-sync-cookie-extension.git`
2. 安装 node_modules 并打包代码
   ```shell
    pnpm run  i
    pnpm run dev
   ```
3. 打开 chrome 浏览器开发者模式，选择“加载解压缩的扩展”，选择打包的 dist 文件
