# Github Pages 部署指南

## 前端部署
1. 进入仓库 Settings → Pages
2. 选择 Source: "Github Actions"
3. 选择分支: `main`
4. 等待工作流自动运行

## 后端部署
1. 确保已安装Node.js环境
2. 工作流会自动在每次push时部署
3. 访问地址: `https://[你的用户名].github.io/[仓库名]/api`